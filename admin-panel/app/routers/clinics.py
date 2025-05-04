from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_admin_db as get_db
from ..models_admin import Clinic, ClinicSchedule as ClinicScheduleModel, Admin
from ..schemas import (
    ClinicCreate as ClinicCreateSchema,
    ClinicOut as ClinicSchema,
    ClinicScheduleCreate,
    ClinicScheduleOut  # Изменено зде
)
from ..routers.auth import get_current_admin
from ..utils.validation import validate_clinic_hours

router = APIRouter(prefix="/clinics", tags=["Clinics"])

@router.post("/{clinic_id}/schedule", response_model=ClinicScheduleOut)
def add_clinic_schedule(
    clinic_id: int,
    schedule: ClinicScheduleCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    clinic = db.query(Clinic).get(clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")

    validate_clinic_hours(schedule.start_time, schedule.end_time)

    db_schedule = ClinicScheduleModel(
        clinic_id=clinic_id,
        day_of_week=schedule.day_of_week,
        start_time=schedule.start_time,
        end_time=schedule.end_time
    )

    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return ClinicScheduleOut.model_validate(db_schedule)

@router.post("/", response_model=ClinicSchema, status_code=status.HTTP_201_CREATED)
def create_clinic(
    clinic: ClinicCreateSchema,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    db_clinic = Clinic(**clinic.dict())
    db.add(db_clinic)
    db.commit()
    db.refresh(db_clinic)
    return ClinicSchema.model_validate(db_clinic)

@router.get("/{clinic_id}", response_model=ClinicSchema)
def get_clinic(clinic_id: int, db: Session = Depends(get_db)):
    clinic = db.query(Clinic).get(clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return ClinicSchema.model_validate(clinic)

@router.get("/", response_model=list[ClinicSchema])
def get_all_clinics(db: Session = Depends(get_db)):
    clinics = db.query(Clinic).all()
    return [ClinicSchema.model_validate(c) for c in clinics]

@router.delete("/{clinic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clinic(
    clinic_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    clinic = db.query(Clinic).get(clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    db.delete(clinic)
    db.commit()
    return