# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "Auth & User Service"
    JWT_SECRET: str = "dev-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "adminpass"
    S2S_SHARED_SECRET: str = "s2s-secret-change-me"
    DATABASE_URL: str = "sqlite:///./auth_service.db"
    CORS_ORIGINS: List[str] = ["*"]

    # ✅ tell pydantic to load from .env file
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

print(">>> Loaded JWT_SECRET:", settings.JWT_SECRET)
print(">>> Loaded JWT_ALGORITHM:", settings.JWT_ALGORITHM)