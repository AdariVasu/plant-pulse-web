"""
Gemini Vision Service for PlantPulse.AI
Provides plant identification, pathology detection, and agronomic advisory using Google Gemini Vision.
"""

import io
import json
import base64
from typing import Dict, Any, Optional
from PIL import Image

try:
    from backend.config import get_gemini_api_key, GEMINI_MODEL, SUPPORTED_MODELS
except ImportError:
    from config import get_gemini_api_key, GEMINI_MODEL, SUPPORTED_MODELS

SYSTEM_PROMPT = """You are an expert agricultural botanist and plant pathologist for PlantPulse.AI.
Analyze the provided photograph of a plant, crop, leaf, stem, or horticultural specimen.

Strict Analysis Rules:
1. NON-PLANT GATE: If the image does not show a plant, crop, tree, leaf, fruit, or flower (e.g. it shows human skin, selfies, animals, electronics, furniture, or random non-botanical objects), you MUST set "plant_detected": false and "health": {"status": "not_plant"}.
2. IMAGE QUALITY: If the photo is too blurry, dark, or obstructed to reliably assess plant health, set "image_quality": "poor".
3. SPECIES IDENTIFICATION: Identify the common crop/plant name, binomial scientific name, and botanical family.
4. HEALTH STATUS:
   - If the foliage is vigorous and free from active diseases, set "health": {"status": "healthy"}, "disease": {"detected": false, "name": "None", "type": "None", "severity": "none"}.
   - If pathogen lesions, chlorosis, blights, rusts, mildews, spots, or pest damages are present, set "health": {"status": "diseased"}, "disease": {"detected": true}.
5. TREATMENT & PROTOCOLS: Provide practical, evidence-based recommendations:
   - immediate_actions (urgent steps to arrest spread)
   - biological_options (bio-fungicides, beneficial microbes, organic neem)
   - agricultural_options (sanitation, pruning, irrigation adjustments)
   - chemical_options (registered active ingredients and fungicide/bactericide classes)
   - prevention (long-term IPM practices)

You MUST respond strictly with a valid JSON object adhering to this schema (do not wrap in markdown or prose outside JSON):
{
  "analysis_status": "complete",
  "image_quality": "good",
  "plant_detected": true,
  "plant": {
    "common_name": "Crop Name",
    "scientific_name": "Binomial Name",
    "plant_type": "Broadleaf Crop | Cereal | Orchard | Vine",
    "confidence": 95
  },
  "health": {
    "status": "healthy | diseased | not_plant | uncertain",
    "confidence": 92,
    "summary": "Concise summary of plant vigor and condition."
  },
  "disease": {
    "detected": true,
    "name": "Disease Name or None",
    "type": "Fungal | Bacterial | Viral | Oomycete | Pest | Nutritional | None",
    "confidence": 90,
    "severity": "Mild | Moderate | Critical | none",
    "affected_part": "Leaves | Stem | Fruit | Whole Plant"
  },
  "symptoms": [
    "Symptom 1",
    "Symptom 2"
  ],
  "possible_cause": {
    "category": "Pathogen / Environmental cause",
    "explanation": "Epidemiology explanation."
  },
  "plant_identification_evidence": [
    "Morphological evidence 1",
    "Morphological evidence 2"
  ],
  "treatment": {
    "immediate_actions": ["Action 1", "Action 2"],
    "biological_options": ["Option 1"],
    "agricultural_options": ["Option 1"],
    "chemical_options": ["Option 1"]
  },
  "prevention": [
    "Prevention guideline 1",
    "Prevention guideline 2"
  ],
  "general_care": [
    "Irrigation & nutrient guideline 1"
  ],
  "final_summary": "Comprehensive summary of diagnosis and prognosis."
}
"""


def _clean_json_response(raw_text: str) -> Dict[str, Any]:
    """Cleans code blocks and extracts JSON object from LLM response."""
    text = raw_text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    # Find boundaries
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        text = text[start:end+1]

    return json.loads(text)


async def test_gemini_api_key(api_key: Optional[str] = None) -> Dict[str, Any]:
    """Tests if a given or configured Gemini API key is active and working."""
    key = (api_key or get_gemini_api_key()).strip()
    if not key:
        return {
            "success": False,
            "connected": False,
            "configured": False,
            "status": "missing_key",
            "error": "Gemini API key is not configured. Please add GEMINI_API_KEY in .env."
        }

    # Attempt test query with google-genai or direct request
    try:
        from google import genai
        client = genai.Client(api_key=key)
        
        for model in SUPPORTED_MODELS:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents="Respond with: OK"
                )
                if response and response.text:
                    return {
                        "success": True,
                        "connected": True,
                        "configured": True,
                        "status": "ready",
                        "provider": "Google Gemini",
                        "model": model,
                        "message": "Gemini connection successful"
                    }
            except Exception as model_err:
                continue

        return {
            "success": False,
            "connected": False,
            "configured": True,
            "status": "api_error",
            "error": "Gemini API key could not reach tested models."
        }
    except Exception as e:
        return {
            "success": False,
            "connected": False,
            "configured": True,
            "status": "api_error",
            "error": str(e)
        }


async def analyze_plant_image(image_bytes: bytes, api_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Submits a leaf/crop image to Gemini Vision API and returns validated pathology diagnosis.
    """
    key = (api_key or get_gemini_api_key()).strip()
    if not key:
        return {
            "error": True,
            "status": "missing_key",
            "message": "Gemini API key not configured on backend. Please configure GEMINI_API_KEY in backend/.env."
        }

    # Validate image format and optimize resolution
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        max_dim = 1600
        if max(img.size) > max_dim:
            img.thumbnail((max_dim, max_dim))
        
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=90)
        jpeg_bytes = buffer.getvalue()
    except Exception as img_err:
        return {
            "error": True,
            "status": "invalid_image",
            "message": f"Unable to decode uploaded image: {img_err}"
        }

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=key)

    last_error = None
    for model_name in SUPPORTED_MODELS:
        try:
            image_part = types.Part.from_bytes(
                data=jpeg_bytes,
                mime_type="image/jpeg"
            )

            response = client.models.generate_content(
                model=model_name,
                contents=[image_part, SYSTEM_PROMPT],
                config=types.GenerateContentConfig(
                    temperature=0.2,
                    response_mime_type="application/json"
                )
            )

            if response and response.text:
                parsed = _clean_json_response(response.text)
                parsed["modelUsed"] = model_name
                return parsed

        except Exception as err:
            last_error = err
            print(f"[Gemini Vision] Model {model_name} failed: {err}. Trying fallback...")

    # If all models failed
    return {
        "error": True,
        "status": "api_error",
        "message": f"Gemini Vision analysis failed: {last_error}"
    }
