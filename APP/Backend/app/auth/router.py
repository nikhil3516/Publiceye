import os
import random
import logging
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import APIRouter, Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import httpx

from app.database import get_db, redis_client
from app.models import User
from app.schemas import (
    PhoneRequest, OtpRequest, TokenResponse, StatusResponse, 
    UserRegisterRequest, UserLoginRequest, UserResponse
)

router = APIRouter(prefix="/auth", tags=["auth"])

JWT_SECRET = os.getenv("JWT_SECRET", "publiceye_jwt_secret_key_32chars!!")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "10080"))
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

logger = logging.getLogger("auth_router")

# JWT & Password Helpers
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)) -> User:
    token = credentials.credentials
    # Check if token is blacklisted in Redis
    if redis_client.get(f"blacklist:{token}"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token blacklisted. Please log in again.")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

# Email & Password Auth Endpoints (Bridges with existing Android screen UI)
@router.post("/register", response_model=TokenResponse)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    # Check if phone already registered
    existing_phone = db.query(User).filter(User.phone == req.phone).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")
        
    # Check if email already registered
    existing_email = db.query(User).filter(User.email == req.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        phone=req.phone,
        name=req.fullName,
        email=req.email,
        location=f"{req.ward}, {req.city}",
        password_hash=hash_password(req.password),
        is_active=True
    )
    
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    access_token = create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

# OTP Auth Endpoints (As requested by User Phase 3)
@router.post("/send-otp", response_model=StatusResponse)
async def send_otp(req: PhoneRequest):
    phone = req.phone.strip()
    if not phone:
        raise HTTPException(status_code=400, detail="Phone number is required")

    # Generate 6-digit OTP
    otp = f"{random.randint(100000, 999999)}"
    
    # Save to Redis with key otp:{phone} and TTL of 300 seconds (5 minutes)
    redis_client.setex(f"otp:{phone}", 300, otp)
    
    # Output to logs for easy local testing / bypass
    logger.warning(f"--- OTP Generated for {phone}: {otp} (expires in 5 mins) ---")
    print(f"--- OTP Generated for {phone}: {otp} (expires in 5 mins) ---")

    # Call MSG91 Send API if configured
    api_key = os.getenv("MSG91_API_KEY", "YOUR_MSG91_KEY_HERE")
    template_id = os.getenv("MSG91_TEMPLATE_ID", "YOUR_TEMPLATE_ID_HERE")
    
    if api_key != "YOUR_MSG91_KEY_HERE" and template_id != "YOUR_TEMPLATE_ID_HERE":
        try:
            url = "https://control.msg91.com/api/v5/otp"
            headers = {"authkey": api_key, "Content-Type": "application/json"}
            params = {
                "template_id": template_id,
                "mobile": phone,
                "authkey": api_key,
                "otp": otp
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=params, timeout=10.0)
                if response.status_code != 200:
                    logger.error(f"MSG91 API error: {response.text}")
        except Exception as e:
            logger.error(f"Failed to communicate with MSG91: {str(e)}")

    return {"status": "sent", "message": f"OTP sent successfully (Bypass OTP: 123456 or view logs)"}

@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(req: OtpRequest, db: Session = Depends(get_db)):
    phone = req.phone.strip()
    otp = req.otp.strip()

    if not phone or not otp:
        raise HTTPException(status_code=400, detail="Phone and OTP are required")

    cached_otp = redis_client.get(f"otp:{phone}")
    
    # Validation logic: accept cached OTP or developer master bypass code '123456'
    if otp != "123456" and cached_otp != otp:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OTP code")

    # Clear OTP from Redis
    redis_client.delete(f"otp:{phone}")

    # Check if user exists, else create new user
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        user = User(
            phone=phone,
            name=f"User {phone[-4:]}",
            is_active=True
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.post("/refresh-token", response_model=TokenResponse)
def refresh_token(credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token claims")
    except JWTError:
        raise HTTPException(status_code=401, detail="Expired or invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": new_token, "token_type": "bearer", "user": user}

@router.post("/logout", response_model=StatusResponse)
def logout(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        # Decode to check exp to set correct Redis cache expiry time
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        remaining = int(exp - datetime.utcnow().timestamp())
        if remaining > 0:
            # Blacklist token for its remaining validity duration
            redis_client.setex(f"blacklist:{token}", remaining, "true")
    except JWTError:
        pass # If token is already invalid, no need to blacklist

    return {"status": "logged out", "message": "Logged out successfully"}
