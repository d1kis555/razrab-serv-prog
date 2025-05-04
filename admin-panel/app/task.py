# app/task.py
from celery import Celery
from sqlalchemy.orm import Session
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import os
import logging
from dotenv import load_dotenv
from contextlib import contextmanager

# Абсолютные импорты
from app.database import get_admin_db
from app.models_admin import User, Medication

# Загрузка переменных окружения
load_dotenv()

# Настройка логгера
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Инициализация Celery
celery = Celery(
    "tasks",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1"),
    include=["app.task"]  # Указываем текущий модуль
)

# Конфигурация периодических задач
celery.conf.beat_schedule = {
    'restore-ratings': {
        'task': 'app.task.restore_ratings',
        'schedule': timedelta(days=1),
    },
    'check-inventory': {
        'task': 'app.task.check_inventory',
        'schedule': timedelta(hours=6),
    },
}

@contextmanager
def get_db_session():
    """Контекстный менеджер для работы с сессией БД"""
    try:
        db = next(get_admin_db())
        yield db
    finally:
        db.close()

@celery.task(
    name="app.task.check_inventory",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=5,
    retry_kwargs={'max_retries': 3}
)
def check_inventory(self):
    """Фоновая задача для проверки запасов лекарств"""
    with get_db_session() as db:
        try:
            logger.info("===> Начало проверки запасов")

            # Проверка SMTP-настроек
            smtp_user = os.getenv("EMAIL_USER")
            smtp_pass = os.getenv("EMAIL_PASSWORD")
            if not all([smtp_user, smtp_pass]):
                raise ValueError("SMTP credentials not configured")

            # Запрос к БД
            medications = db.query(Medication).all()
            logger.info(f"Найдено лекарств: {len(medications)}")

            if not medications:
                logger.warning("Нет данных для проверки")
                return

            # Проверка каждого препарата
            for med in medications:
                logger.debug(f"Проверка: {med.name} ({med.quantity}/{med.threshold})")
                if med.quantity < med.threshold:
                    process_low_stock(med, smtp_user, db)

            logger.info("===> Проверка завершена")

        except Exception as e:
            logger.error(f"Ошибка: {str(e)}", exc_info=True)
            raise

def process_low_stock(med: Medication, smtp_user: str, db: Session):
    """Обработка низкого запаса лекарства"""
    try:
        logger.info(f"Низкий запас: {med.name}")

        # Отправка email
        msg = MIMEText(
            f"Требуется пополнение {med.name}!\n"
            f"Текущий остаток: {med.quantity}\n"
            f"Минимальный порог: {med.threshold}"
        )
        msg['Subject'] = f'Срочный заказ: {med.name}'
        msg['From'] = smtp_user
        msg['To'] = os.getenv("ADMIN_EMAIL", "admin@example.com")

        with smtplib.SMTP(
                host=os.getenv("SMTP_SERVER", "smtp.gmail.com"),
                port=int(os.getenv("SMTP_PORT", 587))
        ) as server:
            server.starttls()
            server.login(smtp_user, os.getenv("EMAIL_PASSWORD"))
            server.send_message(msg)
            logger.info(f"Письмо отправлено для {med.name}")

        # Обновление порога
        med.threshold = med.quantity + 20
        db.commit()
        logger.info(f"Порог для {med.name} обновлен")

    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка обработки: {str(e)}", exc_info=True)
        raise

@celery.task(
    name="app.task.restore_ratings",
    autoretry_for=(Exception,),
    retry_backoff=5,
    retry_kwargs={'max_retries': 3}
)
def restore_ratings():
    """Автоматическое восстановление рейтинга пользователей"""
    with get_db_session() as db:
        try:
            users = db.query(User).filter(
                User.rating < 100,
                User.banned_until < datetime.utcnow()
            ).all()

            for user in users:
                new_rating = min(user.rating + 5, 100)
                delta = new_rating - user.rating

                user.rating = new_rating
                if not user.rating_history:
                    user.rating_history = []
                user.rating_history.append({
                    "date": datetime.utcnow().isoformat(),
                    "change": delta,
                    "reason": "auto_restore"
                })

            db.commit()
            logger.info(f"Обновлен рейтинг для {len(users)} пользователей")

        except Exception as e:
            db.rollback()
            logger.error(f"Ошибка восстановления рейтинга: {str(e)}", exc_info=True)
            raise