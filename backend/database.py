from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os

# Go one folder up (project root)
ROOT_DIR = Path(__file__).resolve().parent.parent

env_path = ROOT_DIR / ".env"
print("Loading:", env_path)
load_dotenv(env_path)

client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client[os.getenv("DB_NAME")]
print("MONGO_URL =", os.getenv("MONGO_URL"))
print("DB_NAME =", os.getenv("DB_NAME"))