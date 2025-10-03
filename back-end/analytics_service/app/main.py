from fastapi import FastAPI
from app.core.config import settings
from app.routes import td,workload

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

app.include_router(td.router, prefix="/analytics", tags=["Analytics"])
app.include_router(workload.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "Analytics Service running with mock data"}
