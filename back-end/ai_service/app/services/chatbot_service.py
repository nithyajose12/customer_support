# app/services/chat_service.py
from app.core.dependencies import client
from typing import Dict, List
import json
import re

def generate_chat_reply(user_message: str, conversation_history: List[Dict]) -> Dict:
    """
    Generate a dynamic AI chat reply and optionally a ticket draft
    using GPT model, based on conversation context.

    conversation_history: List of messages, e.g.
    [{"from": "user", "text": "I can't log in"},
     {"from": "bot", "text": "Shall I create a ticket?"}]
    """

    # Build conversation text for AI
    conversation_text = ""
    for msg in conversation_history:
        conversation_text += f"{msg['from'].capitalize()}: {msg['text']}\n"

    prompt = f"""
    You are a helpful customer support assistant.
    The conversation so far is:

    {conversation_text}

    The user just said: "{user_message}"

    - Respond naturally and empathetically.
    - If it seems like a ticket should be created, propose a draft JSON like:
      {{
        "title": "Ticket title here",
        "description": "Detailed issue description"
      }}
      Do NOT include queue, priority, or status—they will be set later by AI classification.
    - If it's a normal chat/greeting, reply appropriately without a draft.
    - Always keep your reply clear and concise.
    """

    # Call GPT
    chat_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    ai_text = chat_response.choices[0].message.content.strip()
    draft = None

    # Look for JSON block in AI response
    match = re.search(r"\{.*\}", ai_text, re.DOTALL)
    if match:
        try:
            draft = json.loads(match.group())
            # Remove only the matched JSON block from bot reply
            ai_text = ai_text.replace(match.group(), "").strip()
        except json.JSONDecodeError:
            draft = None

    return {
        "reply": ai_text,
        "draft": draft,
        "suggest_ticket": bool(draft)  # frontend can use this to show "Create Ticket" button
    }
