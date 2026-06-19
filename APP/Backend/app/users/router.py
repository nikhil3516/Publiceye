from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.auth.router import get_current_user
from app.schemas import UserResponse, UpdateProfileRequest, FcmTokenRequest, StatusResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_profile(
    req: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.name is not None:
        current_user.name = req.name.strip()
    if req.email is not None:
        current_user.email = req.email.strip().lower()
    if req.location is not None:
        current_user.location = req.location.strip()
        
    try:
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database update failed: {str(e)}")
        
    return current_user

@router.put("/me/fcm-token", response_model=StatusResponse)
def update_fcm_token(
    req: FcmTokenRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.fcm_token = req.fcm_token.strip()
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update token: {str(e)}")
        
    return {"status": "success", "message": "FCM token updated successfully"}
