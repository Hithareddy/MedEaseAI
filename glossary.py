from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

LOCAL_GLOSSARY = {
    "BP": "Blood pressure — pressure of circulating blood.",
    "MRI": "Magnetic Resonance Imaging — creates internal body images.",
}

class GlossaryRequest(BaseModel):
    text: str

@router.post("/glossary")
def glossary(req: GlossaryRequest):
    words = req.text.split()
    output = []

    for w in words:
        key = w.upper().replace(".", "")
        if key in LOCAL_GLOSSARY:
            output.append((w, LOCAL_GLOSSARY[key]))
        else:
            output.append((w, "Definition not available locally."))

    return {"glossary": output}
