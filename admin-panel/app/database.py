from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Базовые классы для разных БД
BaseAdmin = declarative_base()
BaseForum = declarative_base()

# Движки для подключения
engine_admin = create_engine(os.getenv("DATABASE_URL_ADMIN"))
engine_forum = create_engine(os.getenv("DATABASE_URL_FORUM"))

# Сессии
SessionAdmin = sessionmaker(bind=engine_admin)
SessionForum = sessionmaker(bind=engine_forum)

def get_admin_db():
    db = SessionAdmin()
    try:
        yield db
    finally:
        db.close()

def get_forum_db():
    db = SessionForum()
    try:
        yield db
    finally:
        db.close()

# Для обратной совместимости (если нужно)
get_db = get_admin_db  # Добавьте эту строку