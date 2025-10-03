#this take care of all external services
#eg:chatbot api,weather api,stocks api,news api from another server

from openai import OpenAI
from app.core.config import settings
# we will be able to access the vars inside config.py using settings

#initialize our 3rd party service,chat LLM from OpenAI
#OPENAI_API_KEY is inside the config.py

client=OpenAI(api_key=settings.OPENAPI_API_KEY)