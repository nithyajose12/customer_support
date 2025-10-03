from  fastapi import Header,HTTPException 
from app.core.config import settings 

#define  a function that will act as dependancy for our API key authentication
def verify_api_key(api_key_from_user:str=Header(...)):
    #extract the header from the incoming request and save it as api_key_from_user
    #then compare the api_key_from_user with the APP_API_KEY in settings
    #if dont match,give unauthorized error(401)
    if api_key_from_user!= settings.APP_API_KEY:
        raise HTTPException(status_code=401,detail="Unauthorized")
    
#if key matches return true
    return True

