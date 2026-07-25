from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Database
from database import client, db

# Import route modules
from routes.interview import router as interview_router
from routes.resume import router as resume_router
from routes.jobs import router as jobs_router
from routes.auth import router as auth_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Create the main app
app = FastAPI(
    title="Xprep AI Platform",
    version="1.0.0"
)

# Create API router
api_router = APIRouter(prefix="/api")


# Root endpoint
@api_router.get("/")
async def root():
    return {
        "message": "Xprep AI Platform API",
        "status": "running"
    }


# Register all routers
api_router.include_router(interview_router)
api_router.include_router(resume_router)
api_router.include_router(jobs_router)
api_router.include_router(auth_router)

# Include API router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    logger.info("Xprep AI Platform API started successfully")
    logger.info(
        f"Gemini API Key configured: {'Yes' if os.environ.get('GEMINI_API_KEY') else 'No'}"
    )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()