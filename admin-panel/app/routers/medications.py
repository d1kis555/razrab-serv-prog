from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas
from app.models_admin import Medication, Clinic, Admin
from app.routers.auth import get_current_admin
from app.task import check_inventory

router = APIRouter(prefix="/medications", tags=["Medications"])

@router.post("/", response_model=schemas.MedicationOut, status_code=status.HTTP_201_CREATED)
def create_medication(
    medication: schemas.MedicationCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    clinic = db.query(Clinic).get(medication.clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")

    db_medication = Medication(**medication.dict())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    check_inventory.delay()
    return schemas.MedicationOut.model_validate(db_medication)

@router.get("/{medication_id}", response_model=schemas.MedicationOut)
def get_medication(medication_id: int, db: Session = Depends(get_db)):
    medication = db.query(Medication).get(medication_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    return schemas.MedicationOut.model_validate(medication)

@router.patch("/{medication_id}", response_model=schemas.MedicationOut)
def update_medication(
    medication_id: int,
    medication_update: schemas.MedicationUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    medication = db.query(Medication).get(medication_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    update_data = medication_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(medication, key, value)

    db.commit()
    db.refresh(medication)
    check_inventory.delay()
    return schemas.MedicationOut.model_validate(medication)

@router.delete("/{medication_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(
    medication_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    medication = db.query(Medication).get(medication_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    db.delete(medication)
    db.commit()
    check_inventory.delay()
    return {"detail": "Medication deleted"}