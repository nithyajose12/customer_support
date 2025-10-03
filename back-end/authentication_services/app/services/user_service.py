# app/services/user_service.py
"""
User database operations. Using SQLAlchemy + SQLite for simplicity.
Provides functions the routes call (separation of concerns).
"""

from typing import Optional, List, Dict
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from app.core.config import settings
from app.core.auth import hash_password, verify_password

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(120), nullable=False)
    last_name = Column(String(120), nullable=True)
    email = Column(String(256), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    role = Column(Integer, default=2)  # 1=admin,2=user,3=agent

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role": self.role
        }

def init_db():
    """Create tables if they don't exist."""
    Base.metadata.create_all(bind=engine)

# CRUD operations

def create_user(first_name: str, last_name: str, email: str, password: str, role: int = 2) -> Dict:
    """Create a new user (user or agent)."""
    db: Session = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            raise ValueError("Email already registered")
        user = User(
            first_name=first_name,
            last_name=last_name or "",
            email=email,
            hashed_password=hash_password(password),
            role=role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user.to_dict()
    finally:
        db.close()

def get_user_by_email(email: str) -> Optional[Dict]:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        return user.to_dict() if user else None
    finally:
        db.close()

def get_user_by_id(user_id: int) -> Optional[Dict]:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        return user.to_dict() if user else None
    finally:
        db.close()

def authenticate_user(email: str, password: str) -> Optional[Dict]:
    """Validate credentials and return user dict if ok."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user.to_dict()
    finally:
        db.close()

def list_users(role_filter: Optional[int] = None) -> List[Dict]:
    db = SessionLocal()
    try:
        q = db.query(User)
        if role_filter:
            q = q.filter(User.role == role_filter)
        users = q.all()
        return [u.to_dict() for u in users]
    finally:
        db.close()

def update_user(user_id: int, fields: dict) -> Optional[Dict]:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        if "first_name" in fields:
            user.first_name = fields["first_name"]
        if "last_name" in fields:
            user.last_name = fields["last_name"]
        if "email" in fields:
            user.email = fields["email"]
        if "password" in fields:
            user.hashed_password = hash_password(fields["password"])
        if "role" in fields:
            user.role = fields["role"]
        db.commit()
        db.refresh(user)
        return user.to_dict()
    finally:
        db.close()

def delete_user(user_id: int) -> bool:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        db.delete(user)
        db.commit()
        return True
    finally:
        db.close()

