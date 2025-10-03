# app/core/auth.py
"""
Authentication utilities: password hashing, JWT creation/verification and role helpers.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict
import jwt

from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash plain password for storage."""
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    """Verify plain password against stored hash."""
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")
    except jwt.PyJWTError:
        raise Exception("Invalid token")