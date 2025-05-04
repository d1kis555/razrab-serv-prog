from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models_admin import Review

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("/")
def search_reviews(
    query: str,
    min_rating: int = None,
    db: Session = Depends(get_db)
):
    search_query = f"%{query}%"
    results = db.query(Review).filter(
        Review.content.ilike(search_query),
        Review.rating >= (min_rating if min_rating else 0)
    ).all()
    return results