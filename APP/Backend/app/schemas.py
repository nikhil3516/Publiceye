from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# User Schemas
class UserBase(BaseModel):
    phone: str
    name: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Email Auth Schemas (Bridges existing screen fields to backend)
class UserRegisterRequest(BaseModel):
    fullName: str
    email: EmailStr
    phone: str
    password: str
    ward: str
    city: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

# OTP Auth Schemas
class PhoneRequest(BaseModel):
    phone: str

class OtpRequest(BaseModel):
    phone: str
    otp: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Complaint Schemas
class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str
    lat: float
    lng: float
    city: str
    address: str

class ComplaintResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    status: str
    image_url: Optional[str] = None
    lat: float
    lng: float
    city: Optional[str] = None
    address: Optional[str] = None
    vote_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintListResponse(BaseModel):
    complaints: List[ComplaintResponse]
    total: int

class VoteResponse(BaseModel):
    voted: bool
    vote_count: int

# User Profile Schemas
class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None

class FcmTokenRequest(BaseModel):
    fcm_token: str

# Notification Schemas
class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationSendRequest(BaseModel):
    fcm_token: str
    title: str
    message: str

class StatusResponse(BaseModel):
    status: str
    message: Optional[str] = None
