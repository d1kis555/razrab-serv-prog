from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.post("/", response_model=schemas.Doctor, status_code=status.HTTP_201_CREATED)
def create_doctor(
        doctor: schemas.DoctorCreate,
        db: Session = Depends(get_db),
        admin: models.Admin = Depends(get_current_admin)
):
    clinic = db.query(models.Clinic).get(doctor.clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")

    db_doctor = models.Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor


@router.get("/{doctor_id}", response_model=schemas.Doctor)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(models.Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doctor(
        doctor_id: int,
        db: Session = Depends(get_db),
        admin: models.Admin = Depends(get_current_admin)
):
    doctor = db.query(models.Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    db.delete(doctor)
    db.commit()
    return