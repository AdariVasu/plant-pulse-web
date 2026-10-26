"""
Plant Image Analysis Endpoint
Accepts leaf/crop image uploads and executes Gemini Vision AI analysis.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

try:
    from backend.services.gemini_service import analyze_plant_image
except ImportError:
    from services.gemini_service import analyze_plant_image

router = APIRouter()


@router.post("/api/analyze")
@router.post("/analyze")
async def analyze_leaf(
    image: UploadFile = File(...),
    apiKey: Optional[str] = Form(None)
):
    """
    Requirements #5, 6, 7, 8:
    Receives uploaded plant image, executes Gemini Vision detection,
    and returns comprehensive pathology diagnosis and treatment advisory.
    """
    if not image:
        raise HTTPException(status_code=400, detail="No image file provided.")

    contents = await image.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = await analyze_plant_image(contents, apiKey)
    return result
