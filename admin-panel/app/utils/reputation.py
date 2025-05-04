from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models_admin import User
def update_reputation(user: User, delta: int, db: Session):
    new_rating = user.rating + delta
    user.rating = max(0, min(100, new_rating))  # Исправьте лишнюю скобку здесь

    if user.rating < 30 and not user.is_banned:
        user.is_banned = True
        user.banned_until = datetime.utcnow() + timedelta(days=7)

    db.commit()