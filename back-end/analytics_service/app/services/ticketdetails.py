import json
from typing import List
from app.models.ticket_model import Ticket

# Load tickets from mock data
with open("app/data/mock_tickets.json") as f:
    tickets_raw = json.load(f)
tickets: List[Ticket] = [Ticket(**t) for t in tickets_raw]

# Example aggregation functions

def total_tickets():
    return len(tickets)

def tickets_by_status():
    result = {}
    for t in tickets:
        result[t.status] = result.get(t.status, 0) + 1
    return result

def tickets_by_queue():
    """
    Returns ticket counts grouped by queue,
    with open and closed counts separately.
    """
    result = {}
    for t in tickets:
        if t.queue not in result:
            result[t.queue] = {"open": 0, "closed": 0}
        if t.status == "Open":
            result[t.queue]["open"] += 1
        elif t.status == "Closed":
            result[t.queue]["closed"] += 1
    return result

def get_ticket_summary():
    return {
        "total_tickets": total_tickets(),
        "by_status": tickets_by_status(),
        "by_queue": tickets_by_queue(),
    }
