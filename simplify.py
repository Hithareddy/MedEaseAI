from fastapi import APIRouter
from pydantic import BaseModel
from protect import mask_numerics, restore_placeholders, numerics_unchanged

router = APIRouter()

class SimplifyRequest(BaseModel):
    text: str

@router.post("/simplify")
def simplify(req: SimplifyRequest):
    text = req.text

    masked, mapping = mask_numerics(text)

    # No AI → return same text
    simplified = masked  

    if not numerics_unchanged(masked, simplified):
        return {
            "status": "rejected",
            "masked_text": masked,
            "simplified_masked": simplified,
            "final_text": text,
            "audit": [
                {"check": "numeric_protection", "passed": False},
                {"action": "rejected"}
            ]
        }

    final = restore_placeholders(simplified, mapping)

    return {
        "status": "ok",
        "masked_text": masked,
        "simplified_masked": simplified,
        "final_text": final,
        "audit": [
            {"check": "numeric_protection", "passed": True},
            {"action": "accepted"}
        ]
    }
