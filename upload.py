from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
import pytesseract

router = APIRouter()

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    try:
        # Load the uploaded image
        image = Image.open(file.file)

        # Extract text using OCR
        text = pytesseract.image_to_string(image)

        return {"extracted_text": text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
