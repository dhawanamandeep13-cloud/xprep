from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os


# ============================================================
# XPREP DATABASE CONFIGURATION
# ============================================================

# Project root
ROOT_DIR = Path(__file__).resolve().parent.parent

# Load local .env file
ENV_FILE = ROOT_DIR / ".env"

print(f"Loading environment file: {ENV_FILE}")

load_dotenv(ENV_FILE)


# ============================================================
# Environment variables
# ============================================================

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")


# ============================================================
# Validate configuration
# ============================================================

if not MONGO_URL:
    raise RuntimeError(
        "MONGO_URL is not configured. "
        "Please add MONGO_URL to the environment variables."
    )

if not DB_NAME:
    raise RuntimeError(
        "DB_NAME is not configured. "
        "Please add DB_NAME to the environment variables."
    )


# ============================================================
# MongoDB Client
# ============================================================

client = AsyncIOMotorClient(
    MONGO_URL,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
)


# ============================================================
# Database
# ============================================================

db = client[DB_NAME]


# ============================================================
# Startup logging
# ============================================================

print("--------------------------------------------------")
print("Xprep MongoDB Configuration")
print("--------------------------------------------------")
print(f"Database name: {DB_NAME}")
print("MongoDB URL: configured")
print("MongoDB client: initialized")
print("--------------------------------------------------")