# app/routes/summarize.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.auth import verify_api_key

from app.services.summarize_service import summarize_request

# create an instance of APIRouter
router = APIRouter()

# define the input schema for summarize endpoint
class SummarizeRequest(BaseModel):
    ticket_text: str  # input is the ticket description

# create the endpoint route
@router.post("/")
def summarize(req: SummarizeRequest, authorized: bool = Depends(verify_api_key)):
    return {"summary": summarize_request(req.ticket_text)}  # if API key matches, provide summary
