from fastapi import APIRouter, Depends
from app.core.auth import verify_api_key
from app.services.workload_service import get_workload_summary

router = APIRouter()

@router.get("/workload")
def agent_workload(authorized: bool = Depends(verify_api_key)):
    """
    Returns agent workload summary based on open tickets and priority scores.
    """
    return get_workload_summary()
