# qa.py
"""
Hybrid Q&A engine for MedEase AI.
Modes:
 - grounded : answer ONLY using document text.
 - related  : broader general questions (OpenAI if available, else fallback).
 - hybrid   : prefer grounded; expand with OpenAI only if needed.

All modes avoid medical advice while allowing factual queries.
"""

import os, re
from typing import List, Tuple, Dict, Any

# Optional OpenAI client
_openai_client = None
try:
    from openai import OpenAI
    if os.environ.get("OPENAI_API_KEY"):
        _openai_client = OpenAI()
except Exception:
    _openai_client = None


# ---------------------------------------------------------
# Text splitting and retrieval utilities
# ---------------------------------------------------------

SENTENCE_SPLIT_RE = re.compile(r'(?<=[\.\?\!])\s+')

def chunk_text(text: str, max_chars: int = 800) -> List[str]:
    sentences = SENTENCE_SPLIT_RE.split(text)
    chunks = []
    cur = ""
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        if len(cur) + len(s) + 1 <= max_chars:
            cur = (cur + " " + s).strip()
        else:
            if cur:
                chunks.append(cur)
            cur = s
    if cur:
        chunks.append(cur)
    return chunks

def score_chunk(query: str, chunk: str) -> int:
    q = set(re.findall(r"\w+", query.lower()))
    c = set(re.findall(r"\w+", chunk.lower()))
    return len(q & c)

def retrieve_top_k(query: str, chunks: List[str], k: int = 3) -> List[Tuple[int, str, int]]:
    scored = []
    for i, c in enumerate(chunks):
        s = score_chunk(query, c)
        scored.append((i, c, s))
    scored.sort(key=lambda x: x[2], reverse=True)

    nonzero = [t for t in scored if t[2] > 0]
    return nonzero[:k] if nonzero else scored[:k]


# ---------------------------------------------------------
# Improved medical-advice detector
# Allows factual queries like “what dose was given?”
# ---------------------------------------------------------

def looks_like_medical_advice(question: str) -> bool:
    q = question.lower()

    # These blocks advice, NOT factual document queries.
    triggers = [
        "should i", "should we", "what should", "i should", "we should",
        "diagnose", "diagnosis", "treat", "treatment", "prescribe",
        "is it safe for me", "can i take", "can i start", "can i stop",
        "urgent", "emergency", "call 911", "call your doctor", "seek medical"
    ]

    return any(t in q for t in triggers)


# ---------------------------------------------------------
# Local explanations
# ---------------------------------------------------------

def local_answer_from_snippets(question: str, retrieved: List[Tuple[int,str,int]]) -> str:
    if not retrieved:
        return "I couldn't find relevant information in the uploaded document."

    parts = []
    for idx, chunk, score in retrieved:
        parts.append(f"[source {idx}] {chunk}")

    return "Relevant information from the document:\n\n" + "\n\n".join(parts)


# ---------------------------------------------------------
# OpenAI helpers
# ---------------------------------------------------------

def _call_openai_answer(question: str, context: str, model="gpt-4o-mini") -> str:
    if not _openai_client:
        raise RuntimeError("OpenAI client not available.")

    system = (
        "You answer using ONLY the provided document context when possible. "
        "If the question is outside the context, say so politely. "
        "Do NOT give medical advice or instructions."
    )

    user = f"Context:\n{context}\n\nQuestion: {question}\n\nAnswer concisely."

    resp = _openai_client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user}
        ],
        temperature=0.0,
        max_tokens=400
    )

    return resp.choices[0].message["content"].strip()


def _call_openai_general(question: str, model="gpt-4o-mini") -> str:
    if not _openai_client:
        raise RuntimeError("OpenAI unavailable.")

    system = (
        "Provide general educational information. "
        "Do NOT give personalized medical advice."
    )

    resp = _openai_client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": question}
        ],
        temperature=0.0,
        max_tokens=400
    )

    return resp.choices[0].message["content"].strip()


# ---------------------------------------------------------
# Main Q&A engine (ensure this is defined)
# ---------------------------------------------------------

def answer_question(document_text: str, question: str, mode: str = "grounded", top_k: int = 3) -> Dict[str, Any]:
    
    # 1. Medical advice safety check
    if looks_like_medical_advice(question):
        return {
            "answer": (
                "I can't provide medical advice. I can explain what the document says or "
                "provide general educational information."
            ),
            "sources": [],
            "method": "refusal",
            "confidence": 0.0,
            "audit": {"reason": "medical_advice_blocked"}
        }

    chunks = chunk_text(document_text)
    retrieved = retrieve_top_k(question, chunks, k=top_k)
    sources = [{"index": idx, "snippet": chunk[:500]} for idx, chunk, sc in retrieved]

    # ----------------------------
    # MODE: GROUNDED
    # ----------------------------
    if mode == "grounded":
        ans = local_answer_from_snippets(question, retrieved)
        return {
            "answer": ans,
            "sources": sources,
            "method": "local",
            "confidence": 0.9,
            "audit": {"mode": "grounded"}
        }

    # ----------------------------
    # MODE: RELATED
    # ----------------------------
    if mode == "related":
        if _openai_client:
            try:
                ans = _call_openai_general(question)
                return {
                    "answer": ans,
                    "sources": [],
                    "method": "openai",
                    "confidence": 0.7,
                    "audit": {"mode": "related", "openai_used": True}
                }
            except Exception as e:
                fallback = local_answer_from_snippets(question, retrieved)
                return {
                    "answer": "Model unavailable — showing document snippets:\n\n" + fallback,
                    "sources": sources,
                    "method": "local_fallback",
                    "confidence": 0.4,
                    "audit": {"mode":"related","error":str(e)}
                }
        else:
            fallback = local_answer_from_snippets(question, retrieved)
            return {
                "answer": "Offline mode — here are document snippets:\n\n" + fallback,
                "sources": sources,
                "method": "local_only",
                "confidence": 0.4,
                "audit": {"mode":"related","openai":False}
            }

    # ----------------------------
    # MODE: HYBRID
    # ----------------------------
    low_overlap = all(s == 0 for (_, _, s) in retrieved)

    # if document has useful snippets → use them
    if not low_overlap:
        ans = local_answer_from_snippets(question, retrieved)
        return {
            "answer": ans,
            "sources": sources,
            "method": "local",
            "confidence": 0.9,
            "audit": {"mode": "hybrid", "reason": "good_document_match"}
        }

    # fallback: expand using OpenAI if available
    if _openai_client:
        try:
            context = "\n\n".join([c for (_, c, _) in retrieved])
            expanded = _call_openai_answer(question, context)
            return {
                "answer": expanded,
                "sources": sources,
                "method": "hybrid_openai",
                "confidence": 0.6,
                "audit": {"mode":"hybrid","openai_used":True}
            }
        except Exception as e:
            fallback = local_answer_from_snippets(question, retrieved)
            return {
                "answer": "Could not expand — showing document snippets:\n\n" + fallback,
                "sources": sources,
                "method": "local_fallback",
                "confidence": 0.3,
                "audit": {"mode":"hybrid","error":str(e)}
            }

    # no OpenAI → safe fallback
    fallback = local_answer_from_snippets(question, retrieved)
    return {
        "answer": "Document match is weak and no model available — showing snippets:\n\n" + fallback,
        "sources": sources,
        "method": "local_only",
        "confidence": 0.2,
        "audit": {"mode":"hybrid","openai":False}
    }


# -------------------- FastAPI router for QA (robust) --------------------
try:
    from fastapi import APIRouter, Form
    import importlib

    router = APIRouter()

    @router.post("/qa", summary="Document-grounded Q&A")
    async def qa_endpoint(
        text: str = Form(...),
        question: str = Form(...),
        mode: str = Form("grounded")
    ):
        """
        Form fields:
          - text: document text
          - question: user's question
          - mode: grounded | related | hybrid
        This handler will attempt to find and call answer_question() inside this module.
        """
        try:
            # Try to get answer_question from this module's globals
            fn = globals().get("answer_question", None)

            # If not present (odd import-order), try to import the module by name and fetch it
            if fn is None:
                try:
                    mod = importlib.import_module("qa")
                    fn = getattr(mod, "answer_question", None)
                except Exception:
                    fn = None

            if not fn:
                return {"error": "qa_failed", "detail": "answer_question not found in qa module"}

            # Call the function synchronously (it's pure CPU/IO bound; OK for now)
            result = fn(text, question, mode)
            return result

        except Exception as e:
            return {"error": "qa_failed", "detail": str(e)}

except Exception:
    # If FastAPI not available, keep router as None
    router = None
