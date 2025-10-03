from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Ticket(BaseModel):
    id: int
    subject: str
    queue: str                # 1=HR, 2=IT, 3=Facilities, 4=Others
    priority_id: int           # 1=High, 2=Medium, 3=Low
    creation_time: datetime
    status: str                # 1=Open, 2=Closed
    created_user_id: int
    assigned_user_id: Optional[int] = None
    comment_thread_id: Optional[int] = None

