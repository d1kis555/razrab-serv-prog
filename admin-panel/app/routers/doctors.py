from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.database import get_admin_db as get_db
from app.models_admin import Admin, Clinic, Doctor
from app import schemas
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.post("/", response_model=schemas.DoctorOut, status_code=status.HTTP_201_CREATED)
def create_doctor(
        doctor: schemas.DoctorCreate,
        db: Session = Depends(get_db),
        admin: Admin = Depends(get_current_admin)
):
    clinic = db.query(Clinic).get(doctor.clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")

    db_doctor = Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return schemas.DoctorOut.model_validate(db_doctor)

@router.get("/{doctor_id}", response_model=schemas.DoctorOut)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return schemas.DoctorOut.model_validate(doctor)

@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doctor(
        doctor_id: int,
        db: Session = Depends(get_db),
        admin: Admin = Depends(get_current_admin)
):
    doctor = db.query(Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    db.delete(doctor)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)