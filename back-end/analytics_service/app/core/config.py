#app/core/config.py file handles the environment variables

import os
from dotenv import load_dotenv #load the load_dotenv() function from the dotenv package
#this helps  to load the env variables into the os.environment
load_dotenv()

#define a settings class to store the application configuration

class Settings:
    OPENAPI_API_KEY:str=os.getenv("OPEN_API_KEY","")
    APP_API_KEY:str =os.getenv("APP_API_KEY","")#LOAD the env vars from 
    APP_NAME: str = "Customer Support APP API"
    APP_PORT: int = int(os.getenv("APP_PORT",8000))
    APP_VERSION:str=os.getenv("APP_VERSION","")

settings=Settings()