from datetime import datetime
from typing import List, Optional, Literal

from core.schemas import EmailStr, PhoneStr
from pydantic import BaseModel, Field, field_validator

from .config import settings
from .exceptions import ErrorCode as UserErrorCode


class RegisterRequest(BaseModel):
    fullname: str
    email: EmailStr
    phone: Optional[PhoneStr] = None
    password: str

    @field_validator("password")
    @classmethod
    def check_the_minimum_length_of_the_password(cls, v: str) -> str:
        if len(v) < settings.minimum_length_of_the_password:
            raise UserErrorCode.InvalidPasswordLength()
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Response(BaseModel):
    id: int
    fullname: str
    email: str
    phone: Optional[str] = None
    type: str
    created_at: datetime


class ListResponse(BaseModel):
    total_items: int
    total_page: int
    records_per_page: int
    results: List[Response]


class LoginResponse(Response):
    access_token: str
    token_type: str


class EditRequest(BaseModel):
    fullname: Optional[str] = None
    phone: Optional[PhoneStr] = None


class LoginGoogleRequest:
    access_token: str
    language: Literal['vietnamese','english']