import requests
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.models_admin import User, Review  # Прямой импорт
# Инициализация криптоконтекста
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

CAPTCHA_SECRET = "6Lf4bisrAAAAADeFcmsr4dTmk60_Ye9OI2ulHXa6"

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def validate_captcha(token: str) -> bool:
    response = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data={"secret": CAPTCHA_SECRET, "response": token}
    )
    return response.json().get("success", False)

def rate_limit_checks(user: User, db: Session) -> None:
    today_reviews = db.query(Review).filter(
        Review.author_id == user.id,
        Review.created_at >= datetime.utcnow().date()
    ).count()

    if today_reviews >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Daily limit exceeded"
        )