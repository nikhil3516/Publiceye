import uuid
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Notification, User
from app.auth.router import get_current_user
from app.schemas import NotificationResponse, NotificationSendRequest, StatusResponse

router = APIRouter(prefix="/notifications", tags=["notifications"])
logger = logging.getLogger("notifications_router")

# Helper function for notifications (Supabase Realtime can be used)
def push_notification_to_user(fcm_token: str, title: str, body: str) -> bool:
    logger.info(f"Notification triggered (FCM disabled): {title} - {body}")
    return True

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()

@router.put("/{notification_id}/read", response_model=StatusResponse)
def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        n_uuid = uuid.UUID(notification_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    notification = db.query(Notification).filter(
        Notification.id == n_uuid,
        Notification.user_id == current_user.id
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.is_read = True
    db.commit()
    return {"status": "success", "message": "Notification marked as read"}

@router.post("/send", response_model=StatusResponse)
def send_notification(
    req: NotificationSendRequest,
    db: Session = Depends(get_db)
):
    # Find user with matching FCM token to save the notification history
    user = db.query(User).filter(User.fcm_token == req.fcm_token).first()
    if not user:
        raise HTTPException(status_code=404, detail="User with provided FCM token not found")

    # Send the notification (Placeholder)
    sent = push_notification_to_user(req.fcm_token, req.title, req.message)
    if not sent:
        raise HTTPException(status_code=500, detail="Failed to trigger notification")

    # Save to history db
    new_notif = Notification(
        user_id=user.id,
        title=req.title,
        message=req.message,
        is_read=False
    )
    db.add(new_notif)
    db.commit()

    return {"status": "success", "message": "FCM Notification pushed and saved to history"}
