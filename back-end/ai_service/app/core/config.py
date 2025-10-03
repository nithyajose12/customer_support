# app/core/config.py

import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Settings:
    OPENAPI_API_KEY: str = os.getenv("OPEN_API_KEY", "").strip('"')
    APP_API_KEY: str = os.getenv("APP_API_KEY", "")  # strip quotes
    APP_NAME: str = "Customer Support APP API"
    APP_PORT: int = int(os.getenv("APP_PORT", 8000))
    APP_VERSION: str = os.getenv("APP_VERSION", "").strip('"')
    DATABASE_URL: str = "sqlite:///./ai.db"

settings = Settings()
