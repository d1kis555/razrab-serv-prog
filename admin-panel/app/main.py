from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from pydantic import BaseModel

# Импорты для работы с базами данных
from app.database import (
    get_admin_db,
    get_forum_db,
    engine_admin,
    engine_forum,
    SessionAdmin  # Добавляем импорт SessionAdmin
)
from app.models_admin import BaseAdmin, User, Admin, Clinic, Doctor, Medication, Review, Report
from app.models_forum import BaseForum, Post, Comment

# Импорт роутеров
from app.routers import (
    clinics,
    doctors,
    medications,
    schedules,
    forum,
    search,
    auth,
    reviews  # Импорт роутера отзывов
)
from app.routers.admin import moderation

app = FastAPI(title="Pharmacy Management System")


# Создание таблиц и администратора по умолчанию при старте
@app.on_event("startup")
async def startup():
    # Создаем таблицы
    BaseAdmin.metadata.create_all(bind=engine_admin)
    BaseForum.metadata.create_all(bind=engine_forum)

    # Создаем администратора по умолчанию
    db = SessionAdmin()
    try:
        admin = db.query(Admin).filter(Admin.username == "admin").first()
        if not admin:
            hashed_password = pwd_context.hash("admin")
            new_admin = Admin(
                username="admin",
                hashed_password=hashed_password
            )
            db.add(new_admin)
            db.commit()
            print("Default admin created: admin/admin")
    except Exception as e:
        print(f"Error creating admin: {str(e)}")
    finally:
        db.close()


# Подключение роутеров
app.include_router(auth.router)
app.include_router(clinics.router)
app.include_router(doctors.router)
app.include_router(medications.router)
app.include_router(schedules.router)
app.include_router(forum.router)
app.include_router(search.router)
app.include_router(moderation.router)
app.include_router(reviews.router)

# Конфигурация аутентификации
SECRET_KEY = "6Lf4bisrAAAAADeFcmsr4dTmk60_Ye9OI2ulHXa6"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_user_scheme = OAuth2PasswordBearer(tokenUrl="auth/user/login")
oauth2_admin_scheme = OAuth2PasswordBearer(tokenUrl="auth/admin/login")


class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    email: str
    password: str


class AdminCreate(BaseModel):
    username: str
    password: str


# Вспомогательные функции
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Аутентификация пользователей
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password, user.hashed_password):
        return None
    return user


# Аутентификация администраторов
def authenticate_admin(db: Session, username: str, password: str):
    admin = db.query(Admin).filter(Admin.username == username).first()
    if not admin or not pwd_context.verify(password, admin.hashed_password):
        return None
    return admin


# Эндпоинты аутентификации
@app.post("/auth/user/register", response_model=Token)
async def register_user(
        user_data: UserCreate,
        db: Session = Depends(get_admin_db)
):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(user_data.password)
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        rating=100,
        role="user"
    )

    db.add(db_user)
    db.commit()

    access_token = create_access_token(
        data={"sub": db_user.email, "role": "user"}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/auth/user/login", response_model=Token)
async def login_user(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_admin_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": "user"},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/auth/admin/login", response_model=Token)
async def login_admin(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_admin_db)
):
    admin = authenticate_admin(db, form_data.username, form_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username, "role": "admin"},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Зависимости для получения текущего пользователя
async def get_current_user(
        token: str = Depends(oauth2_user_scheme),
        db: Session = Depends(get_admin_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


async def get_current_admin(
        token: str = Depends(oauth2_admin_scheme),
        db: Session = Depends(get_admin_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials"
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    admin = db.query(Admin).filter(Admin.username == username).first()
    if admin is None:
        raise credentials_exception
    return admin


# Тестовые эндпоинты
@app.get("/protected/user")
async def user_protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello user {current_user.email}"}


@app.get("/protected/admin")
async def admin_protected_route(current_admin: Admin = Depends(get_current_admin)):
    return {"message": f"Hello admin {current_admin.username}"}