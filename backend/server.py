from pathlib import Path
import os
import logging

from dotenv import load_dotenv

# -------------------------------------------------
# Load .env FIRST
# -------------------------------------------------
ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

# Database
from database import client

# Routes
from routes.interview import router as interview_router
from routes.resume import router as resume_router
from routes.jobs import router as jobs_router
from routes.auth import router as auth_router

# -------------------------------------------------
# App
# -------------------------------------------------

app = FastAPI(
    title="Xprep AI Platform",
    version="1.0.0"
)

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {
        "message": "Xprep AI Platform API",
        "status": "running"
    }


# Register Routers
api_router.include_router(interview_router)
api_router.include_router(resume_router)
api_router.include_router(jobs_router)
api_router.include_router(auth_router)

app.include_router(api_router)


# -------------------------------------------------
# CORS
# -------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------
# Logging
# -------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

logger = logging.getLogger("server")


# -------------------------------------------------
# Startup / Shutdown
# -------------------------------------------------

@app.on_event("startup")
async def startup_event():
    logger.info("Xprep AI Platform API started successfully")
    logger.info(
        f"MongoDB configured: {'Yes' if os.getenv('MONGO_URL') else 'No'}"
    )
    logger.info(
        f"Gemini API configured: {'Yes' if os.getenv('GEMINI_API_KEY') else 'No'}"
    )


@app.on_event("shutdown")
async def shutdown_event():
    client.close()


# -------------------------------------------------
# Run
# -------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )