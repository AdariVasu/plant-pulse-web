"""
PlantPulse Backend Configuration
Loads settings securely from environment variables.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory: backend/
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

# Load backend/.env if exists
load_dotenv(dotenv_path=ENV_PATH)

# Also check root .env as fallback if present
ROOT_ENV = BASE_DIR.parent / ".env"
if ROOT_ENV.exists():
    load_dotenv(dotenv_path=ROOT_ENV, override=False)


def get_gemini_api_key() -> str:
    """Safely retrieves the Gemini API Key from backend environment."""
    return os.getenv("GEMINI_API_KEY", "").strip() or os.getenv("GOOGLE_API_KEY", "").strip()


def set_gemini_api_key(new_key: str):
    """Updates the Gemini API Key in the backend environment and persists to backend/.env."""
    clean_key = (new_key or "").strip()
    os.environ["GEMINI_API_KEY"] = clean_key

    # Persist to backend/.env
    try:
        content = ""
        if ENV_PATH.exists():
            content = ENV_PATH.read_text(encoding="utf-8")
        
        lines = []
        key_found = False
        for line in content.splitlines():
            if line.startswith("GEMINI_API_KEY="):
                lines.append(f"GEMINI_API_KEY={clean_key}")
                key_found = True
            else:
                lines.append(line)
        
        if not key_found:
            lines.append(f"GEMINI_API_KEY={clean_key}")
        
        ENV_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    except Exception as e:
        print(f"[Config] Error persisting API key to .env: {e}")


PORT = int(os.getenv("PORT", "5000"))
HOST = os.getenv("HOST", "0.0.0.0")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# Supported Gemini Model Fallbacks
SUPPORTED_MODELS = [
    GEMINI_MODEL,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-flash-latest"
]
