from datetime import datetime, date
from pydantic import BaseModel, EmailStr, ConfigDict, Field, conint
from typing import Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    captcha_token: str

class UserOut(UserBase):
    id: int
    rating: int
    is_banned: bool
    banned_until: Optional[datetime]
    role: str
    model_config = ConfigDict(from_attributes=True)

class AdminBase(BaseModel):
    username: str

class AdminCreate(AdminBase):
    password: str

# Схемы для отчетов
class ReportBase(BaseModel):
    post_id: Optional[int] = None
    comment_id: Optional[int] = None
    reason: str
    status: str

class ReportCreate(ReportBase):
    pass

class ReportOut(ReportBase):
    id: int
    reporter_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Схемы для расписания клиник
class ClinicScheduleBase(BaseModel):
    day_of_week: int
    start_time: str
    end_time: str

class ClinicScheduleCreate(ClinicScheduleBase):
    pass

class ClinicScheduleOut(ClinicScheduleBase):
    id: int
    clinic_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Схемы для клиник
class ClinicBase(BaseModel):
    name: str

class ClinicCreate(ClinicBase):
    pass

class ClinicOut(ClinicBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Схемы для врачей
class DoctorBase(BaseModel):
    name: str
    clinic_id: int

class DoctorCreate(DoctorBase):
    pass

class DoctorOut(DoctorBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Схемы для лекарств
class MedicationBase(BaseModel):
    name: str
    quantity: int
    threshold: int
    clinic_id: int

class MedicationCreate(MedicationBase):
    pass

class MedicationUpdate(BaseModel):
    quantity: Optional[int] = None
    threshold: Optional[int] = None

class MedicationOut(MedicationBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Схемы для форума
class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    pass

class PostOut(PostBase):
    id: int
    author_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentOut(CommentBase):
    id: int
    post_id: int
    author_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Схемы для расписания врачей
class RegularScheduleBase(BaseModel):
    start_day: int
    end_day: int
    start_time: str
    end_time: str
    valid_from: date
    valid_to: date

class RegularScheduleCreate(RegularScheduleBase):
    pass

class RegularScheduleOut(RegularScheduleBase):
    id: int
    doctor_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ScheduleExceptionBase(BaseModel):
    date: date
    is_working: bool
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    reason: Optional[str] = None

class ScheduleExceptionCreate(ScheduleExceptionBase):
    pass

class ScheduleExceptionOut(ScheduleExceptionBase):
    id: int
    doctor_id: int
    model_config = ConfigDict(from_attributes=True)

class DailyScheduleOut(BaseModel):
    date: date
    working: bool
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    reason: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# Схемы для отзывов
class ReviewCreate(BaseModel):
    doctor_id: int
    content: str
    rating: conint(ge=1, le=5) = Field(..., description="Rating from 1 to 5 stars")

class ReviewOut(ReviewCreate):
    id: int
    author_id: int
    created_at: datetime
    author_email: str
    model_config = ConfigDict(from_attributes=True)