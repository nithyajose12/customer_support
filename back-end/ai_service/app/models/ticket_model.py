#ticket model.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class TicketDB(Base):
    __tablename__ = "tickets" 

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    subject = Column(String, nullable=False)
    created_user_id = Column(Integer, nullable=False)
    creation_time = Column(DateTime, default=datetime.utcnow)

    queue = Column(String, nullable=True)           # 1=HR, 2=IT, 3=Facilities, 4=Others
    priority_id = Column(Integer, nullable=True)    # 1=High, 2=Medium, 3=Low
    status = Column(String, default="Open")         # Open/Closed
    assigned_user_id = Column(Integer, nullable=True)
    comment_thread_id = Column(Integer, nullable=True)
