from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field, constr
from app.core.auth import decode_access_token

from app.services.auth_service import (
    register_user,
    login_admin_with_hardcoded_credentials,
    generate_token_for_user,
)
from app.services.user_service import authenticate_user

router = APIRouter()

# -------- Schemas --------
class SignupRequest(BaseModel):
    first_name: str
    last_name: str | None = None
    email: EmailStr
    password: constr(min_length=6, max_length=72)

class LoginRequest(BaseModel):
    email: str = Field(..., example="user@example.com", description="Admin can also login here")
    password: str = Field(..., example="password123")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# -------- User Signup --------
@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
def signup(req: SignupRequest):
    """
    User self-registration.  
    Role is fixed to 2 (user).  
    Agents must be created by admin.
    """
    try:
        user = register_user(req.first_name, req.last_name, req.email, req.password, role=2)
        return {"message": "registered", "user": user}
    except ValueError as ex:
        raise HTTPException(status_code=400, detail=str(ex))


# -------- Login as User --------
@router.post("/user-login", response_model=TokenResponse)
def login_user(form_data: LoginRequest):
    """
    Login as **User** (role=2).  
    ✅ Admin can also login here.  
    """
    # Admin login
    admin = login_admin_with_hardcoded_credentials(form_data.email, form_data.password)
    if admin:
        return {"access_token": generate_token_for_user(admin), "token_type": "bearer"}

    # User login
    user = authenticate_user(form_data.email, form_data.password)
    if not user or user["role"] != 2:
        raise HTTPException(status_code=401, detail="Invalid user credentials")
    return {"access_token": generate_token_for_user(user), "token_type": "bearer"}


# -------- Login as Agent --------
@router.post("/agent-login", response_model=TokenResponse)
def login_agent(form_data: LoginRequest):
    """
    Login as **Agent** (role=3).  
    ✅ Admin can also login here.  
    """
    # Admin login
    admin = login_admin_with_hardcoded_credentials(form_data.email, form_data.password)
    if admin:
        return {"access_token": generate_token_for_user(admin), "token_type": "bearer"}

    # Agent login
    user = authenticate_user(form_data.email, form_data.password)
    if not user or user["role"] != 3:
        raise HTTPException(status_code=401, detail="Invalid agent credentials")
    return {"access_token": generate_token_for_user(user), "token_type": "bearer"}

@router.get("/debug-token")
def debug_token(token: str):
    return decode_access_token(token)