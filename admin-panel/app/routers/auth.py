from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.database import get_admin_db
from app.models_admin import User, Admin
from app.schemas import Token, UserCreate, UserOut

SECRET_KEY = "6Lf4bisrAAAAADeFcmsr4dTmk60_Ye9OI2ulHXa6"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Separate OAuth2 schemes for users and admins
oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="auth/user/login")
oauth2_scheme_admin = OAuth2PasswordBearer(tokenUrl="auth/admin/login")

router = APIRouter()
user_auth_router = APIRouter(tags=["User Authentication"])
admin_auth_router = APIRouter(tags=["Admin Authentication"])


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# User authentication functions
def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user or not pwd_context.verify(password, user.hashed_password):
        return None
    return user


@user_auth_router.post("/register", response_model=UserOut)
def register_user(user: UserCreate, db: Session = Depends(get_admin_db)):
    existing_user = get_user(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        rating=100,
        role="user"
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@user_auth_router.post("/login", response_model=Token)
def login_user(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_admin_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.is_banned and user.banned_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is banned"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": "user"},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


# Admin authentication functions
def get_admin(db: Session, username: str):
    return db.query(Admin).filter(Admin.username == username).first()


def authenticate_admin(db: Session, username: str, password: str):
    admin = get_admin(db, username)
    if not admin or not pwd_context.verify(password, admin.hashed_password):
        return None
    return admin


@admin_auth_router.post("/login", response_model=Token)
def login_admin(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_admin_db)
):
    admin = authenticate_admin(db, form_data.username, form_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username, "role": "admin"},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


# Dependency functions
async def get_current_user(
        token: str = Depends(oauth2_scheme_user),
        db: Session = Depends(get_admin_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate user credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")

        if email is None or role != "user":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user(db, email=email)
    if user is None:
        raise credentials_exception

    return user


async def get_current_admin(
        token: str = Depends(oauth2_scheme_admin),
        db: Session = Depends(get_admin_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")

        if username is None or role != "admin":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    admin = get_admin(db, username=username)
    if admin is None:
        raise credentials_exception

    return admin


# Include routers
router.include_router(user_auth_router, prefix="/auth/user")
router.include_router(admin_auth_router, prefix="/auth/admin")