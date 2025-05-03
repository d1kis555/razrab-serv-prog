from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Boolean, CheckConstraint, func
from sqlalchemy.orm import relationship
from app.database import Base


class Clinic(Base):
    __tablename__ = "clinics"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, comment="Название клиники")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    doctors = relationship("Doctor", back_populates="clinic", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="clinic", cascade="all, delete-orphan")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, comment="ФИО врача")
    clinic_id = Column(Integer, ForeignKey("clinics.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    clinic = relationship("Clinic", back_populates="doctors")
    schedules = relationship("DoctorSchedule", back_populates="doctor", cascade="all, delete-orphan")
    exceptions = relationship("ScheduleException", back_populates="doctor", cascade="all, delete-orphan")


class DoctorSchedule(Base):
    __tablename__ = "doctor_schedules"

    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"))
    start_day = Column(Integer, nullable=False)
    end_day = Column(Integer, nullable=False)
    start_time = Column(String(5), nullable=False)
    end_time = Column(String(5), nullable=False)
    valid_from = Column(Date, nullable=False)
    valid_to = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)  # Добавлено nullable=False

    doctor = relationship("Doctor", back_populates="schedules")
class ScheduleException(Base):
    __tablename__ = "schedule_exceptions"

    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"))
    date = Column(Date, nullable=False, comment="Дата исключения")
    is_working = Column(Boolean, default=False, comment="Рабочий ли это день?")
    start_time = Column(String(5), comment="Формат HH:MM, обязателен если is_working=True")
    end_time = Column(String(5))
    reason = Column(String(100))


    __table_args__ = (
        CheckConstraint(
            "(is_working = FALSE AND start_time IS NULL AND end_time IS NULL) OR "
            "(is_working = TRUE AND start_time IS NOT NULL AND end_time IS NOT NULL)",
            name="check_exception_constraints"
        ),
    )

    doctor = relationship("Doctor", back_populates="exceptions")


class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    threshold = Column(Integer, nullable=False)  # Порог для заказа
    clinic_id = Column(Integer, ForeignKey("clinics.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    clinic = relationship("Clinic", back_populates="medications")


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)