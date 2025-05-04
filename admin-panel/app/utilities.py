# app/utils.py
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import logging
from transformers import pipeline

# Локальные импорты
from app.models_admin import User  # Правильный импорт модели User

# Настройка логгера
logger = logging.getLogger(__name__)

# Инициализация модели для проверки токсичности
try:
    toxicity_classifier = pipeline(
        "text-classification",
        model="unitary/toxic-bert",
        return_all_scores=True
    )
    logger.info("Toxicity model loaded successfully")
except Exception as e:
    logger.error(f"Error loading toxicity model: {str(e)}")
    raise


def check_toxicity(text: str, threshold: float = 0.85) -> tuple[bool, float]:
    """
    Проверяет текст на токсичность с использованием предобученной модели.
    Возвращает кортеж (is_toxic: bool, toxicity_score: float)
    """
    try:
        if not text.strip():
            return False, 0.0

        results = toxicity_classifier(text)[0]
        toxic_score = next(
            (s['score'] for s in results if s['label'] == 'toxic'),
            0.0
        )
        return toxic_score > threshold, round(toxic_score, 4)

    except Exception as e:
        logger.error(f"Toxicity check failed: {str(e)}")
        return False, 0.0


def update_reputation(
        user: User,
        delta: int,
        db: Session,
        reason: str,
        max_rating: int = 100,
        min_rating: int = 0
) -> None:
    """
    Обновляет рейтинг пользователя и сохраняет историю изменений.
    Автоматически банит пользователей с низким рейтингом.
    """
    try:
        # Обновляем рейтинг
        new_rating = user.rating + delta
        new_rating = max(min_rating, min(max_rating, new_rating))

        # Сохраняем историю
        history_entry = {
            "date": datetime.utcnow().isoformat(),
            "old_rating": user.rating,
            "new_rating": new_rating,
            "delta": delta,
            "reason": reason
        }

        user.rating = new_rating
        if not user.rating_history:
            user.rating_history = []
        user.rating_history.append(history_entry)

        # Автобан при низком рейтинге
        if new_rating < 30 and not user.is_banned:
            user.is_banned = True
            user.banned_until = datetime.utcnow() + timedelta(days=7)
            logger.info(f"User {user.id} auto-banned until {user.banned_until}")

        db.commit()
        logger.debug(f"Updated rating for user {user.id}. New rating: {new_rating}")

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update reputation: {str(e)}")
        raise