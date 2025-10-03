from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import classify, summarize, chatbot

# -----------------------------
# Initialize FastAPI app
# -----------------------------
app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

# -----------------------------
# CORS middleware (for React frontend)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[" http://localhost:5173"],  # update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Include routers
# -----------------------------                   
app.include_router(classify.router, prefix="/classify", tags=["Classify"])
app.include_router(summarize.router, prefix="/summarize", tags=["summarization"])
app.include_router(chatbot.router, prefix="/chat", tags=["chatbot"])

# -----------------------------
# Global exception handler
# -----------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": f"Internal server error: {exc}"}
    )

# -----------------------------
# Optional: root endpoint
# -----------------------------
@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} is running."}
