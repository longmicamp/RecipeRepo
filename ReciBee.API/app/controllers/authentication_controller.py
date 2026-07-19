from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    display_name: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    # TODO: Implement login logic
    raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    # TODO: Implement registration logic
    raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/logout")
async def logout():
    # TODO: Implement logout logic
    raise HTTPException(status_code=501, detail="Not implemented")
