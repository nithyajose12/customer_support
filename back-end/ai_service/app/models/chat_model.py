#chatmodel.Py
from typing import List, Optional
from pydantic import BaseModel
from enum import Enum
from datetime import datetime

# Optional: enforce sender type
class Sender(str, Enum):
    USER = "user"
    BOT = "bot"

# Single chat message
class ChatMessage(BaseModel):
    from_user: Sender
    text: str
    timestamp: datetime = datetime.utcnow()  # optional, useful for frontend

# Ticket draft suggested by AI
class TicketDraft(BaseModel):
    title: str
    description: str

# Conversation context for WebSocket / chat session
class ChatContext(BaseModel):
    user_id: int
    messages: List[ChatMessage] = []
    draft: Optional[TicketDraft] = None
    step: int = 1  # tracks multi-step conversation
