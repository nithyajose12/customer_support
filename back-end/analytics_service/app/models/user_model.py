from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: int  # 1=admin, 2=user, 3=agent
