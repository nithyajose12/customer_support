# app/services/summarize_service.py
from app.core.dependencies import client

def summarize_request(ticket_text: str) -> str:
    """
    Summarize a long customer ticket description into 2-3 clear sentences.
    """
    prompt_for_summary = f"""
    You are a helpful AI assistant.
    Summarize the following customer ticket into 2 or 3 clear, concise sentences.
    Do not add extra details, only focus on what the customer reported.

    Ticket:
    "
    {ticket_text}
    "
    """

    chatresponse = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt_for_summary}]
    )

    return chatresponse.choices[0].message.content.strip()
