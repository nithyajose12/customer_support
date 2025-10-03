# app/core/dependencies.py
"""
Dependencies for authentication and role-based access.
Uses JWT Bearer tokens.
"""

from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, APIKeyHeader
from typing import Optional

from app.core.auth import decode_access_token
from app.services.user_service import get_user_by_id
from app.core.config import settings

bearer_scheme = HTTPBearer()
s2s_header = APIKeyHeader(name="X-Service-Secret", auto_error=False)


def get_current_payload(token = Depends(bearer_scheme)) -> dict:
    """Decode JWT from Authorization header and return payload."""
    credentials = token.credentials  # comes from "Bearer <token>"
    try:
        payload = decode_access_token(credentials)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalid or expired")

    # ✅ Always check for user_id and role
    if "user_id" not in payload or "role" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing required claims")

    return payload


def get_current_user(payload: dict = Depends(get_current_payload)):
    """
    Return user object from DB, or admin if role=1 and user_id="admin".
    """
    user_id = payload.get("user_id")
    role = payload.get("role")

    # Special case: admin (hardcoded)
    if role == 1 and str(user_id) == "admin":
        return {
            "id": "admin",
            "email": settings.ADMIN_USERNAME,
            "role": 1,
            "first_name": "Admin",
            "last_name": ""
        }

    # Otherwise fetch from DB
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def require_role(allowed_roles: list):
    """Check that current user has one of the allowed roles."""
    def _require_role(current_user = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user
    return _require_role


def service_to_service_auth(x_service_secret: Optional[str] = Security(s2s_header)):
    """Service-to-service header authentication."""
    if not x_service_secret or x_service_secret != settings.S2S_SHARED_SECRET:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Service auth failed")
    return True