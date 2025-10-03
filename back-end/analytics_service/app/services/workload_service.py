import json
from typing import List, Dict
from collections import defaultdict
from app.models.ticket_model import Ticket
from app.models.user_model import User

# Load tickets from mock data
with open("app/data/mock_tickets.json") as f:
    tickets_raw = json.load(f)
tickets: List[Ticket] = [Ticket(**t) for t in tickets_raw]

# Load users from mock data
with open("app/data/mock_users.json") as f:
    users_raw = json.load(f)
users: List[User] = [User(**u) for u in users_raw]

# Priority weights: High=3, Medium=2, Low=1
PRIORITY_WEIGHT = {1: 3, 2: 2, 3: 1}

# Map agent id to name
AGENT_MAP = {u.id: f"{u.first_name} {u.last_name}" for u in users if u.role == 3}

# Map agent id to their department/category based on the tickets they handle
AGENT_CATEGORY_MAP = {}
for ticket in tickets:
    if ticket.assigned_user_id:
        # Assign the queue of their first ticket as their category
        if ticket.assigned_user_id not in AGENT_CATEGORY_MAP:
            AGENT_CATEGORY_MAP[ticket.assigned_user_id] = ticket.queue

# ------------------------
# Workload calculation functions
# ------------------------
def workload_by_agent() -> Dict[str, int]:
    """
    Calculate workload score for each agent.
    Workload = sum of priority weights of open tickets assigned to agent
    """
    workload = defaultdict(int)
    for ticket in tickets:
        if ticket.assigned_user_id and ticket.status == "Open":  # Only open tickets
            workload[ticket.assigned_user_id] += PRIORITY_WEIGHT.get(ticket.priority_id, 1)
    # Convert agent IDs to names
    return {AGENT_MAP[aid]: score for aid, score in workload.items()}

def total_open_tickets_by_agent() -> Dict[str, int]:
    """
    Returns the total number of open tickets assigned to each agent.
    """
    count = defaultdict(int)
    for ticket in tickets:
        if ticket.assigned_user_id and ticket.status == "Open":
            count[ticket.assigned_user_id] += 1
    return {AGENT_MAP[aid]: c for aid, c in count.items()}

def get_workload_summary() -> Dict[str, Dict[str, int]]:
    """
    Returns a summary dict with workload score, number of open tickets, and category per agent
    """
    summary = {}
    for aid in AGENT_MAP:
        summary[AGENT_MAP[aid]] = {
            "workload_score": workload_by_agent().get(AGENT_MAP[aid], 0),
            "open_tickets": total_open_tickets_by_agent().get(AGENT_MAP[aid], 0),
            "category": AGENT_CATEGORY_MAP.get(aid, "N/A")
        }
    return summary
