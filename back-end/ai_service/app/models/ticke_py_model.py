#ticke_py model

from pydantic import BaseModel
from typing import Optional, List

from datetime import datetime
class TicketCreate(BaseModel):
    subject: str
    created_user_id: int
    queue: Optional[str] = None
    priority_id: Optional[int] = 2
    status: Optional[str] = "Open"
    assigned_user_id: Optional[int] = None

class TicketResponse(TicketCreate):
    id: int
    creation_time: datetime

    class Config:
        from_attributes= True
