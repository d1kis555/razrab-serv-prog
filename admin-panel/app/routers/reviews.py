from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_admin_db
from app.models_admin import Review, Doctor, User
from app import schemas
from app.routers.auth import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/", response_model=schemas.ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
        review: schemas.ReviewCreate,
        db: Session = Depends(get_admin_db),
        current_user: User = Depends(get_current_user)
):
    doctor = db.query(Doctor).get(review.doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    existing = db.query(Review).filter(
        Review.doctor_id == review.doctor_id,
        Review.author_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(400, detail="You already have a review for this doctor")

    db_review = Review(
        content=review.content,
        rating=review.rating,
        doctor_id=review.doctor_id,
        author_id=current_user.id
    )

    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    db_review.author_email = current_user.email
    return schemas.ReviewOut.model_validate(db_review)

@router.get("/doctor/{doctor_id}", response_model=List[schemas.ReviewOut])
def get_doctor_reviews(doctor_id: int, db: Session = Depends(get_admin_db)):
    reviews = db.query(Review).filter(Review.doctor_id == doctor_id).all()
    for review in reviews:
        user = db.query(User).get(review.author_id)
        review.author_email = user.email if user else "Unknown"
    return [schemas.ReviewOut.model_validate(r) for r in reviews]

@router.get("/doctor/{doctor_id}/stats")
def get_doctor_stats(doctor_id: int, db: Session = Depends(get_admin_db)):
    doctor = db.query(Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    reviews = doctor.reviews
    if not reviews:
        return {
            "average_rating": 0,
            "total_reviews": 0,
            "ratings_distribution": {i: 0 for i in range(1, 6)}
        }

    total = len(reviews)
    average = sum(r.rating for r in reviews) / total
    distribution = {i: 0 for i in range(1, 6)}
    for r in reviews:
        distribution[r.rating] += 1

    return {
        "average_rating": round(average, 1),
        "total_reviews": total,
        "ratings_distribution": distribution
    }