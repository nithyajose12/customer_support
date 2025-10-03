from fastapi import APIRouter, Depends
from app.core.auth import verify_api_key

from app.services.ticketdetails import get_ticket_summary

router = APIRouter()

@router.get("/")
def analytics_dashboard(authorized: bool = Depends(verify_api_key)):
    """
    Returns analytics data (currently mock data, later from ticket service).
    """
    return get_ticket_summary()
