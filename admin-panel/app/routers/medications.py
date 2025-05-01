from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_admin
from app.tasks import check_inventory  # Корректный импорт задачи

router = APIRouter(prefix="/medications", tags=["Medications"])

@router.post("/", response_model=schemas.Medication, status_code=status.HTTP_201_CREATED)
def create_medication(
    medication: schemas.MedicationCreate,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin)
):
    clinic = db.query(models.Clinic).get(medication.clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")

    db_medication = models.Medication(**medication.dict())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)

    # Запуск задачи
    check_inventory.delay()

    return db_medication

@router.get("/{medication_id}", response_model=schemas.Medication)
def get_medication(medication_id: int, db: Session = Depends(get_db)):
    medication = db.query(models.Medication).get(medication_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    return medication

@router.patch("/{medication_id}", response_model=schemas.Medication)
def update_medication(
    medication_id: int,
    medication_update: schemas.MedicationUpdate,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin)
):
    medication = db.query(models.Medication).get(medication_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    update_data = medication_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(medication, key, value)

    db.commit()
    db.refresh(medication)

    check_inventory.delay()

    return medication

@router.delete("/{medication_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(
    medication_id: int,
    db: Session = Depends(get_db),
    admin: models.Admin = Depends(get_current_admin)
):
    medication = db.query(models.Medication).get(medication_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    db.delete(medication)
    db.commit()

    check_inventory.delay()

    return {"detail": "Medication deleted"}