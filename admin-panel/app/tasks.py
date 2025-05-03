from celery import Celery
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Medication
import smtplib
from email.mime.text import MIMEText
import os
import logging
from dotenv import load_dotenv

# Загрузка переменных окружения
load_dotenv()

# Настройка логгера
logger = logging.getLogger(__name__)

# Инициализация Celery
celery = Celery(
    "tasks",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    include=["app.tasks"],
    task_track_started=True,
)


@celery.task(
    name="app.tasks.check_inventory",
    bind=True,
)
def check_inventory(self):
    """Фоновая задача для проверки запасов лекарств."""
    db: Session = SessionLocal()
    try:
        logger.info("===> Начало проверки запасов")

        # Проверка SMTP-настроек
        smtp_user = os.getenv("EMAIL_USER")
        smtp_pass = os.getenv("EMAIL_PASSWORD")
        if not all([smtp_user, smtp_pass]):
            raise ValueError("SMTP credentials not configured")
        logger.debug("SMTP-настройки корректны")

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
                logger.info(f"Низкий запас: {med.name}")

                # Отправка email
                msg = MIMEText(
                    f"Требуется пополнение {med.name}!\n"
                    f"Текущий остаток: {med.quantity}\n"
                    f"Минимальный порог: {med.threshold}"
                )
                msg['Subject'] = f'Срочный заказ: {med.name}'
                msg['From'] = smtp_user
                msg['To'] = os.getenv("ADMIN_EMAIL", "admin@example.com")  # Получатель из .env

                try:
                    with smtplib.SMTP(
                            host=os.getenv("SMTP_SERVER", "smtp.gmail.com"),
                            port=int(os.getenv("SMTP_PORT", 587))
                    ) as server:
                        server.starttls()
                        server.login(smtp_user, smtp_pass)
                        server.send_message(msg)
                        logger.info(f"Письмо отправлено для {med.name}")
                except Exception as e:
                    logger.error(f"Ошибка отправки письма: {str(e)}", exc_info=True)

                # Обновление порога
                med.threshold = med.quantity + 20
                try:
                    db.commit()
                    logger.info(f"Порог для {med.name} обновлен")
                except Exception as e:
                    db.rollback()
                    logger.error(f"Ошибка обновления порога: {str(e)}", exc_info=True)

        logger.info("===> Проверка завершена")

    except Exception as e:
        logger.error(f"КРИТИЧЕСКАЯ ОШИБКА: {str(e)}", exc_info=True)
        self.retry(exc=e, countdown=60)  # Повтор через 60 секунд
    finally:
        db.close()
        logger.info("Сессия БД закрыта")