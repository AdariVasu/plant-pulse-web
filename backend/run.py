"""
Standalone runner for the PlantPulse FastAPI backend.
Usage:
    python backend/run.py
"""

import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import uvicorn
from backend.config import PORT, HOST

if __name__ == "__main__":
    print(f"Starting PlantPulse FastAPI backend on http://{HOST}:{PORT} ...")
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=False)
