# app/__init__.py
from .tasks import celery  # Регистрируем Celery app

__all__ = ["celery"]