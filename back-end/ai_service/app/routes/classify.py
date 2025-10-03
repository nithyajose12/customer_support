from fastapi import APIRouter ,Depends #to implemented authentication
from pydantic import BaseModel
from app.core.auth import verify_api_key

from app.services.classify_service import classify_request
#create an instance of APIRouter
router= APIRouter()

#define the input schema for support endpoint
class ClassifyRequest(BaseModel):
    request_text:str #query is the only input that  we passs to the /support endpoint

#create the endpoint routes
@router.post("/")
def classify(req:ClassifyRequest,authorized:bool=Depends(verify_api_key)):
    return{"classification":classify_request(req.request_text)} #if api key matches provide answer