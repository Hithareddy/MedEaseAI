from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal, Dict, Any
import re

router = APIRouter()

class SummaryRequest(BaseModel):
    text: str
    level: Literal["one_line", "bullets", "detailed"] = "bullets"

def local_one_line(text: str) -> str:
    parts = text.split(".")
    return parts[0] + "." if parts else text[:200]

def local_bullets(text: str) -> str:
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    bullets = sentences[:3]
    return "\n".join(f"- {b}." for b in bullets)

def local_detailed(text: str) -> str:
    return "Detailed Summary:\n" + text

@router.post("/summarize")
def summarize(req: SummaryRequest) -> Dict[str, Any]:
    if req.level == "one_line":
        summary = local_one_line(req.text)
    elif req.level == "bullets":
        summary = local_bullets(req.text)
    else:
        summary = local_detailed(req.text)

    return {
        "level": req.level,
        "summary": summary,
        "audit": {"source": "local", "ai_used": False}
    }
