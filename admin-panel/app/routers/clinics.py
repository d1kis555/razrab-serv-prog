from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/clinics", tags=["Clinics"])

@router.post("/", response_model=schemas.Clinic, status_code=status.HTTP_201_CREATED)
def create_clinic(
    clinic: schemas.ClinicCreate,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin)
):
    db_clinic = models.Clinic(**clinic.dict())
    db.add(db_clinic)
    db.commit()
    db.refresh(db_clinic)
    return db_clinic

@router.get("/{clinic_id}", response_model=schemas.Clinic)
def get_clinic(clinic_id: int, db: Session = Depends(get_db)):
    clinic = db.query(models.Clinic).get(clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return clinic

@router.get("/", response_model=list[schemas.Clinic])
def get_all_clinics(db: Session = Depends(get_db)):
    return db.query(models.Clinic).all()

@router.delete("/{clinic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clinic(
    clinic_id: int,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin)
):
    clinic = db.query(models.Clinic).get(clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    db.delete(clinic)
    db.commit()
    return