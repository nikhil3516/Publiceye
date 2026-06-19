import os
import uuid
import logging
import math
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy import text, func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Complaint, Vote, User
from app.auth.router import get_current_user
from app.schemas import ComplaintResponse, VoteResponse, StatusResponse

router = APIRouter(prefix="/complaints", tags=["complaints"])
logger = logging.getLogger("complaints_router")

# Placeholder for storage (Supabase can be used here)
def get_image_url(filename: str) -> str:
    return f"https://pqxusfbsfacqgpvrrrlo.supabase.co/storage/v1/object/public/complaints/{filename}"

@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
    city: str = Form(...),
    address: str = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    image_url = None
    if image:
        try:
            ext = os.path.splitext(image.filename)[1] or ".jpg"
            filename = f"{uuid.uuid4()}{ext}"
            # In a real Supabase migration, you'd upload using supabase-py
            image_url = get_image_url(filename)
        except Exception as e:
            logger.error(f"Failed to process image: {str(e)}")
            image_url = "https://images.unsplash.com/photo-1597248881519-db089d3744a0?auto=format&fit=crop&q=80&w=600"

    new_complaint = Complaint(
        user_id=current_user.id,
        title=title,
        description=description,
        category=category,
        status="open",
        image_url=image_url,
        lat=lat,
        lng=lng,
        city=city,
        address=address,
        vote_count=0
    )

    db.add(new_complaint)
    try:
        db.commit()
        db.refresh(new_complaint)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return new_complaint

@router.get("/", response_model=List[ComplaintResponse])
def list_complaints(
    page: int = 1,
    limit: int = 20,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    query = db.query(Complaint)
    if category:
        query = query.filter(Complaint.category == category)
    if status:
        query = query.filter(Complaint.status == status)
    
    return query.order_by(Complaint.created_at.desc()).offset(offset).limit(limit).all()

@router.get("/nearby", response_model=List[ComplaintResponse])
def get_nearby_complaints(
    lat: float,
    lng: float,
    radius_km: float = 5.0,
    db: Session = Depends(get_db)
):
    # 1. Try PostGIS (Docker/Production)
    try:
        radius_meters = radius_km * 1000.0
        query = db.query(Complaint).filter(
            text(
                "ST_DWithin("
                "ST_MakePoint(complaints.lng, complaints.lat)::geography, "
                "ST_MakePoint(:lng, :lat)::geography, "
                ":radius_meters"
                ")"
            )
        ).params(lng=lng, lat=lat, radius_meters=radius_meters)
        return query.all()
    except Exception:
        db.rollback()
        
    # 2. Try Haversine SQL (Postgres without PostGIS)
    try:
        haversine_formula = text(
            "6371 * acos("
            "cos(radians(:lat)) * cos(radians(lat)) * "
            "cos(radians(lng) - radians(:lng)) + "
            "sin(radians(:lat)) * sin(radians(lat))"
            ") <= :radius_km"
        )
        query = db.query(Complaint).filter(haversine_formula).params(lat=lat, lng=lng, radius_km=radius_km)
        return query.all()
    except Exception:
        db.rollback()

    # 3. Python Fallback (SQLite / Local)
    all_complaints = db.query(Complaint).all()
    nearby = []
    for c in all_complaints:
        # Haversine distance formula in Python
        R = 6371.0 # Earth radius in km
        dlat = math.radians(c.lat - lat)
        dlng = math.radians(c.lng - lng)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat)) * math.cos(math.radians(c.lat)) * math.sin(dlng / 2)**2
        c_dist = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c_dist
        if distance <= radius_km:
            nearby.append(c)
    return nearby

@router.get("/city", response_model=List[ComplaintResponse])
def get_city_complaints(city: str, db: Session = Depends(get_db)):
    return db.query(Complaint).filter(func.lower(Complaint.city) == city.lower()).all()

@router.get("/my", response_model=List[ComplaintResponse])
def get_my_complaints(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Complaint).filter(Complaint.user_id == current_user.id).all()

@router.get("/voted", response_model=List[ComplaintResponse])
def get_voted_complaints(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Complaint).join(Vote).filter(Vote.user_id == current_user.id).all()

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint_detail(complaint_id: str, db: Session = Depends(get_db)):
    try:
        c_uuid = uuid.UUID(complaint_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
        
    complaint = db.query(Complaint).filter(Complaint.id == c_uuid).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(
    complaint_id: str,
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    status: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        c_uuid = uuid.UUID(complaint_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    complaint = db.query(Complaint).filter(Complaint.id == c_uuid).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if complaint.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only owner can modify")

    complaint.title = title
    complaint.description = description
    complaint.category = category
    complaint.status = status
    
    db.commit()
    db.refresh(complaint)
    return complaint

@router.delete("/{complaint_id}", response_model=StatusResponse)
def delete_complaint(
    complaint_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        c_uuid = uuid.UUID(complaint_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    complaint = db.query(Complaint).filter(Complaint.id == c_uuid).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if complaint.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only owner can delete")

    db.delete(complaint)
    db.commit()
    return {"status": "success", "message": "Complaint deleted successfully"}

@router.post("/{complaint_id}/vote", response_model=VoteResponse)
def vote_complaint(
    complaint_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        c_uuid = uuid.UUID(complaint_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    complaint = db.query(Complaint).filter(Complaint.id == c_uuid).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    existing_vote = db.query(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.complaint_id == c_uuid
    ).first()

    if existing_vote:
        db.delete(existing_vote)
        complaint.vote_count = max(0, complaint.vote_count - 1)
        voted = False
    else:
        new_vote = Vote(user_id=current_user.id, complaint_id=c_uuid)
        db.add(new_vote)
        complaint.vote_count += 1
        voted = True

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"voted": voted, "vote_count": complaint.vote_count}
