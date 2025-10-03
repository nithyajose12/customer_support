# app/routes/chatbot.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.services.chatbot_service import generate_chat_reply
from app.models.ticket_model import TicketDB
from app.models.ticke_py_model import TicketCreate, TicketResponse
from app.core.config import settings
from app.database.session import SessionLocal

router = APIRouter()

# -----------------------------
# POST endpoint (legacy)
# -----------------------------
class ChatRequest(BaseModel):
    user_id: int
    message: str
    conversation_history: List[Dict]

class ChatResponse(BaseModel):
    reply: str
    draft: Optional[Dict] = None
    ticket: Optional[TicketResponse] = None

@router.post("/", response_model=ChatResponse)
def chat_with_bot(req: ChatRequest):
    """
    Legacy HTTP POST endpoint for chat.
    """
    result = generate_chat_reply(req.message, req.conversation_history)

    ticket_obj = None
    if result.get("draft"):
        draft = result["draft"]
        db = SessionLocal()
        try:
            ticket_db = TicketDB(
                subject=draft.get("title"),
                created_user_id=req.user_id
            )
            db.add(ticket_db)
            db.commit()
            db.refresh(ticket_db)
            ticket_obj = TicketResponse.from_orm(ticket_db)
        finally:
            db.close()

    return ChatResponse(
        reply=result["reply"],
        draft=result.get("draft"),
        ticket=ticket_obj
    )

# -----------------------------
# WebSocket endpoint (real-time)
# -----------------------------
conversations: Dict[int, List[Dict]] = {}

@router.websocket("/ws/chat/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: int):
    """
    Real-time WebSocket endpoint with token verification.
    """
    # --- Verify token from query params ---
    token = websocket.query_params.get("token")
    print(f"Token received from client: '{token}' | Expected: '{settings.APP_API_KEY}'")
    if token != settings.APP_API_KEY:
        await websocket.close(code=403)
        return

    # --- Accept connection ---
    await websocket.accept()

    if user_id not in conversations:
        conversations[user_id] = []

    # --- Open DB session manually ---
    db: Session = SessionLocal()

    try:
        while True:
            # Receive user message
            data = await websocket.receive_json()
            user_message = data.get("message")

            # Save user message
            conversations[user_id].append({"from": "user", "text": user_message})

            # Generate AI response
            result = generate_chat_reply(user_message, conversations[user_id])
            bot_reply = result.get("reply", "Sorry, I didn't understand that.")
            conversations[user_id].append({"from": "bot", "text": bot_reply})

            # Auto-create ticket if AI suggests a draft
            ticket_obj = None
            if result.get("draft"):
                draft = result["draft"]
                ticket_db = TicketDB(
                    subject=draft.get("title"),
                    created_user_id=user_id
                )
                db.add(ticket_db)
                db.commit()
                db.refresh(ticket_db)
                ticket_obj = TicketResponse.from_orm(ticket_db)

            # Send JSON back to frontend
            await websocket.send_json({
                "reply": bot_reply,
                "draft": result.get("draft"),
                "ticket": ticket_obj.dict() if ticket_obj else None
            })

    except WebSocketDisconnect:
        print(f"User {user_id} disconnected")
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {e}")
    finally:
        db.close()
