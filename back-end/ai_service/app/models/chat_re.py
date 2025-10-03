#chat_re.py
from pydantic import BaseModel
from typing import Optional, List
from .ticket_model import TicketResponse
from .chat_model import ChatMessage

# Request to chatbot POST API
class ChatRequest(BaseModel):
    user_id: int
    message: str
    conversation_history: Optional[List[ChatMessage]] = []

# Response from chatbot POST API
class ChatResponse(BaseModel):
    reply: str
    draft: Optional[TicketResponse] = None   # AI-suggested ticket (preview)
    ticket: Optional[TicketResponse] = None  # Final created ticket
