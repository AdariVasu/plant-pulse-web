"""
Health Check & Gemini Status Endpoints
Handles /health, /api/health, /api/gemini/health, and /api/gemini/test.
"""

from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional

try:
    from backend.config import get_gemini_api_key, set_gemini_api_key
    from backend.services.gemini_service import test_gemini_api_key
except ImportError:
    from config import get_gemini_api_key, set_gemini_api_key
    from services.gemini_service import test_gemini_api_key

router = APIRouter()


class SaveKeyRequest(BaseModel):
    apiKey: Optional[str] = ""


class TestKeyRequest(BaseModel):
    apiKey: Optional[str] = ""


@router.get("/health")
def health_root():
    """Requirement #3: Health check endpoint at GET /health."""
    return {
        "status": "healthy",
        "service": "PlantPulse FastAPI Backend",
        "version": "1.0.0"
    }


@router.get("/api/health")
def api_health():
    """Frontend compatibility endpoint for GET /api/health."""
    return {
        "success": True,
        "service": "PlantPulse backend",
        "status": "running"
    }


@router.get("/api/gemini/health")
def gemini_health():
    """Frontend compatibility endpoint for GET /api/gemini/health."""
    key = get_gemini_api_key()
    return {
        "configured": bool(key),
        "provider": "Google Gemini"
    }


@router.get("/api/gemini/test")
@router.post("/api/gemini/test")
async def gemini_test(request: Optional[TestKeyRequest] = None):
    """Tests connection to Google Gemini API."""
    key = request.apiKey if request else None
    return await test_gemini_api_key(key)


@router.post("/api/save-key")
def save_key(payload: SaveKeyRequest):
    """Persists API key safely to backend/.env."""
    set_gemini_api_key(payload.apiKey)
    key_set = bool((payload.apiKey or "").strip())
    return {
        "success": True,
        "configured": key_set,
        "status": "ready" if key_set else "missing_key",
        "message": "Gemini API key saved to backend environment." if key_set else "Gemini API key cleared."
    }
