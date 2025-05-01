from fastapi import FastAPI
from app.routers import clinics, doctors, medications, auth, schedules
from app.database import create_tables, get_db
from app.models import Admin
from app.routers.auth import get_password_hash

app = FastAPI(title="Vet Platform API")

create_tables()

# Создаем администратора по умолчанию
with next(get_db()) as db:
    if not db.query(Admin).filter(Admin.username == "admin").first():
        hashed_password = get_password_hash("admin")
        admin = Admin(username="admin", hashed_password=hashed_password)
        db.add(admin)
        db.commit()

app.include_router(auth.router)
app.include_router(clinics.router)
app.include_router(doctors.router)
app.include_router(medications.router)
app.include_router(schedules.router)

@app.get("/", summary="Home")
def home():
    return {"message": "Vet Platform API"}