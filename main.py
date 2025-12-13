from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from qa import router as qa_router
import pytesseract
from PIL import Image
import io
import os

# Import routers
from simplify import router as simplify_router
from glossary import router as glossary_router
from summaries import router as summaries_router   # <-- NEW
# qa router will be added later when implemented
# from qa import router as qa_router

app = FastAPI(title="MedEase AI Backend", version="1.0")

# Allow frontend (to be added later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Root endpoint
# ---------------------------
@app.get("/")
def root():
    return {"message": "MedEase AI Backend Running"}

# ---------------------------
# OCR Upload Endpoint
# ---------------------------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        # Try reading as image
        try:
            image = Image.open(io.BytesIO(contents))
            text = pytesseract.image_to_string(image)
            return {"text": text, "engine": "tesseract-image"}
        except Exception:
            pass

        # Try PDF -> requires pdf2image + poppler
        try:
            from pdf2image import convert_from_bytes

            pages = convert_from_bytes(contents)
            text_output = []
            for page in pages:
                text_output.append(pytesseract.image_to_string(page))

            return {"text": "\n".join(text_output), "engine": "tesseract-pdf"}
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="PDF processing failed. Poppler not installed or unreadable file."
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------
# Routers for AI Ops
# ---------------------------
app.include_router(simplify_router, prefix="", tags=["simplify"])
app.include_router(glossary_router, prefix="", tags=["glossary"])
app.include_router(summaries_router, prefix="", tags=["summaries"])  # <-- NEW
app.include_router(qa_router, prefix="", tags=["qa"])
# app.include_router(qa_router, prefix="", tags=["qa"])  # added later


# ---------------------------
# Health check
# ---------------------------
@app.get("/health")
def health():
    return {"status": "ok"}
