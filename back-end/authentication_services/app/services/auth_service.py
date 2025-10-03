# app/services/auth_service.py
"""
Auth logic for admin hardcoded login + JWT generation.
"""

from datetime import timedelta
from typing import Dict, Optional

from app.core.config import settings
from app.core.auth import create_access_token
from app.services.user_service import create_user


def login_admin_with_hardcoded_credentials(username: str, password: str) -> Optional[Dict]:
    """
    Verify admin credentials against configured ADMIN_USERNAME / ADMIN_PASSWORD.
    Returns a pseudo-user dict for admin on success.
    """
    if username == settings.ADMIN_USERNAME and password == settings.ADMIN_PASSWORD:
        return {
            "id": "admin", 
            "email": username, 
            "role": 1, 
            "first_name": "Admin", 
            "last_name": ""
        }
    return None


def generate_token_for_user(user: Dict) -> str:
    """
    Create JWT including user_id, role, and email.
    For admin user_id will be "admin".
    """
    data = {
        "user_id": user["id"],   # ✅ always use user_id in JWT
        "role": user["role"],
        "email": user["email"]
    }
    token = create_access_token(
        data, 
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return token


def register_user(first_name: str, last_name: str, email: str, password: str, role: int = 2) -> Dict:
    """
    Register a new user (role=2 only).
    Agents (role=3) must be created by admin in /users/.
    """
    if role != 2:
        raise ValueError("Only role=2 (user) can self-register. Agents must be created by admin.")
    return create_user(first_name, last_name, email, password, role)