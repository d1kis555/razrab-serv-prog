from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Date, DateTime, ForeignKey,
    Boolean, CheckConstraint, Text, Float, JSON, func
)
from sqlalchemy.orm import relationship
from app.database import BaseAdmin  # Импорт базового класса для админ-базы

class Admin(BaseAdmin):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

class User(BaseAdmin):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(300), nullable=False)
    rating = Column(Integer, default=100)
    rating_history = Column(JSON, default=[])
    is_banned = Column(Boolean, default=False)
    banned_until = Column(DateTime)
    role = Column(String(20), default="user")

    # Отношения внутри админ-базы
    reviews = relationship("Review", back_populates="author")
    reports = relationship("Report", back_populates="reporter")

class Clinic(BaseAdmin):
    __tablename__ = "clinics"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Отношения внутри админ-базы
    schedules = relationship("ClinicSchedule", back_populates="clinic", cascade="all, delete-orphan")
    doctors = relationship("Doctor", back_populates="clinic", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="clinic", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="clinic")
class ClinicSchedule(BaseAdmin):
    __tablename__ = "clinic_schedules"
    id = Column(Integer, primary_key=True)
    clinic_id = Column(Integer, ForeignKey("clinics.id", ondelete="CASCADE"))
    day_of_week = Column(Integer, nullable=False)
    start_time = Column(String(5), nullable=False)
    end_time = Column(String(5), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    clinic = relationship("Clinic", back_populates="schedules")

class Doctor(BaseAdmin):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Отношения внутри админ-базы
    clinic = relationship("Clinic", back_populates="doctors")
    schedules = relationship("DoctorSchedule", back_populates="doctor", cascade="all, delete-orphan")
    exceptions = relationship("ScheduleException", back_populates="doctor", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="doctor")

class DoctorSchedule(BaseAdmin):
    __tablename__ = "doctor_schedules"
    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"))
    start_day = Column(Integer, nullable=False)
    end_day = Column(Integer, nullable=False)
    start_time = Column(String(5), nullable=False)
    end_time = Column(String(5), nullable=False)
    valid_from = Column(Date, nullable=False)
    valid_to = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    doctor = relationship("Doctor", back_populates="schedules")

    __table_args__ = (
        CheckConstraint("valid_to >= valid_from", name="check_valid_dates"),
        CheckConstraint("start_day BETWEEN 0 AND 6", name="check_start_day"),
        CheckConstraint("end_day BETWEEN 0 AND 6", name="check_end_day")
    )

class ScheduleException(BaseAdmin):
    __tablename__ = "schedule_exceptions"
    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"))
    date = Column(Date, nullable=False)
    is_working = Column(Boolean, default=False)
    start_time = Column(String(5))
    end_time = Column(String(5))
    reason = Column(String(100))

    doctor = relationship("Doctor", back_populates="exceptions")

    __table_args__ = (
        CheckConstraint(
            "(is_working IS FALSE AND start_time IS NULL AND end_time IS NULL) OR "
            "(is_working IS TRUE AND start_time IS NOT NULL AND end_time IS NOT NULL)",
            name="check_exception_constraints"
        ),
    )

class Medication(BaseAdmin):
    __tablename__ = "medications"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    threshold = Column(Integer, nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    clinic = relationship("Clinic", back_populates="medications")

class Review(BaseAdmin):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)
    is_approved = Column(Boolean, default=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id", ondelete="SET NULL"))
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="SET NULL"))
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    author = relationship("User", back_populates="reviews")
    clinic = relationship("Clinic", back_populates="reviews")
    doctor = relationship("Doctor", back_populates="reviews")

class Report(BaseAdmin):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True)
    reason = Column(String(200))
    status = Column(String(20), default="pending")
    reporter_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("User", back_populates="reports")