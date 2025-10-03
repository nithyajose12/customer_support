# app/main.py
"""
FastAPI entrypoint. Creates the app, mounts routes, and initializes DB.
Swagger UI will be available at /docs and Redoc at /redoc.
"""

import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth as auth_router
from app.routes import users as users_router
from app.core.config import settings
from app.core import dependencies
from app.services.user_service import init_db

app = FastAPI(title="Auth & User Service",
              description="Auth service for users, agents and admin (hardcoded).",
              version="1.0.0")

# Allow CORS for frontend (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router, prefix="/auth", tags=["auth"])
app.include_router(users_router.router, prefix="/users", tags=["users"])

# Initialize DB (create tables) at startup
@app.on_event("startup")
def on_startup():
    init_db()  # create tables if not exist

# Simple health-check
@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}