"""
PlantPulse.AI - FastAPI Backend Application
"""

import sys
from pathlib import Path

# Add backend directory and parent directory to sys.path for universal import compatibility
CURRENT_DIR = Path(__file__).resolve().parent
PARENT_DIR = CURRENT_DIR.parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))
if str(PARENT_DIR) not in sys.path:
    sys.path.insert(0, str(PARENT_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.config import PORT, HOST
    from backend.routes.health import router as health_router
    from backend.routes.analyze import router as analyze_router
except ImportError:
    from config import PORT, HOST
    from routes.health import router as health_router
    from routes.analyze import router as analyze_router

app = FastAPI(
    title="PlantPulse.AI Backend Engine",
    description="Python FastAPI Plant Health Assessment & Disease Pathology Engine",
    version="1.0.0"
)

# Requirement #10: Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:9091",
        "http://127.0.0.1:9091",
        "http://localhost:9092",
        "http://127.0.0.1:9092",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health_router)
app.include_router(analyze_router)


@app.get("/")
def root():
    return {
        "status": "online",
        "framework": "FastAPI",
        "service": "PlantPulse.AI Pathology Backend",
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
