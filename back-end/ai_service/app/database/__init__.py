# app/database/init_db.py
from sqlalchemy import create_engine
from app.core.config import settings
from app.models.ticket_model import Base  # your SQLAlchemy models

engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})

# Create all tables
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
