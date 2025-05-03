from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from typing import Optional, List

class MedicationCreate(BaseModel):
    name: str = Field(..., max_length=100)
    quantity: int = Field(..., ge=0)
    threshold: int = Field(..., ge=0)
    clinic_id: int

class Medication(MedicationCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=0)
    threshold: Optional[int] = Field(None, ge=0)

class ClinicCreate(BaseModel):
    name: str = Field(..., max_length=100)

class Clinic(ClinicCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DoctorCreate(BaseModel):
    name: str = Field(..., max_length=100)
    clinic_id: int

class Doctor(DoctorCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class RegularScheduleCreate(BaseModel):
    start_day: int = Field(..., ge=0, le=6)
    end_day: int = Field(..., ge=0, le=6)
    start_time: str = Field(..., pattern=r"^([01]\d|2[0-3]):([0-5]\d)$")
    end_time: str = Field(..., pattern=r"^([01]\d|2[0-3]):([0-5]\d)$")
    valid_from: date
    valid_to: date

    @validator('end_day')
    def validate_days(cls, v, values):
        if 'start_day' in values and v < values['start_day']:
            raise ValueError('End day must be >= start day')
        return v

    @validator('valid_to')
    def validate_dates(cls, v, values):
        if 'valid_from' in values and v < values['valid_from']:
            raise ValueError('End date must be >= start date')
        return v

class RegularSchedule(RegularScheduleCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ScheduleExceptionCreate(BaseModel):
    date: date
    is_working: bool
    start_time: Optional[str] = Field(None, pattern=r"^([01]\d|2[0-3]):([0-5]\d)$")
    end_time: Optional[str] = Field(None, pattern=r"^([01]\d|2[0-3]):([0-5]\d)$")
    reason: Optional[str] = Field(None, max_length=100)

    @validator('start_time', 'end_time')
    def validate_working_hours(cls, v, values):
        if values.get('is_working') and not v:
            raise ValueError('Working hours required for working days')
        return v

class ScheduleException(ScheduleExceptionCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DailySchedule(BaseModel):
    date: date
    working: bool
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    reason: Optional[str] = None

    class Config:
        from_attributes = True