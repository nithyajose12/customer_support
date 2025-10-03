from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional

from app.core.dependencies import require_role
from app.services.user_service import create_user, update_user, delete_user

router = APIRouter()

class CreateOrUpdateUserRequest(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: EmailStr
    password: constr(min_length=6, max_length=72)
    role: int = Field(..., description="Must be 2=user or 3=agent. Admin not allowed.")


@router.post("/", response_model=dict, dependencies=[Depends(require_role([1]))], status_code=status.HTTP_201_CREATED)
def add_user(req: CreateOrUpdateUserRequest):
    """Admin-only: Add user (role=2) or agent (role=3)."""
    if req.role == 1:
        raise HTTPException(status_code=400, detail="Cannot create admin via API")
    try:
        user = create_user(req.first_name, req.last_name, req.email, req.password, req.role)
        return {"message": "created", "user": user}
    except ValueError as ex:
        raise HTTPException(status_code=400, detail=str(ex))


@router.put("/{user_id}", response_model=dict, dependencies=[Depends(require_role([1]))])
def update_user_admin(user_id: int, req: CreateOrUpdateUserRequest):
    """Admin-only: Update user or agent."""
    data = req.dict(exclude_unset=True)
    if "role" in data and data["role"] == 1:
        raise HTTPException(status_code=400, detail="Cannot assign admin role")
    updated = update_user(user_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "updated", "user": updated}


@router.delete("/{user_id}", response_model=dict, dependencies=[Depends(require_role([1]))])
def delete_user_admin(user_id: int):
    """Admin-only: Delete user or agent."""
    ok = delete_user(user_id)
    if not ok:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "deleted"}