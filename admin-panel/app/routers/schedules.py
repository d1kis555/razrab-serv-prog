from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import List
from app.database import get_db
from app.models_admin import Doctor, DoctorSchedule, ScheduleException
from app import schemas
from app.routers.auth import get_current_admin
from dateutil.relativedelta import relativedelta
from sqlalchemy.exc import IntegrityError
from app.utils.validation import validate_doctor_hours

router = APIRouter(prefix="/doctors/{doctor_id}/schedule", tags=["Schedule"])

def validate_time_range(start: str, end: str):
    try:
        start_h, start_m = map(int, start.split(':'))
        end_h, end_m = map(int, end.split(':'))
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Некорректный формат времени. Используйте ЧЧ:ММ"
        )
    validate_doctor_hours(start, end)

async def get_doctor_or_404(doctor_id: int, db: Session = Depends(get_db)) -> Doctor:
    doctor = db.query(Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Доктор не найден")
    return doctor

@router.post(
    "/regular",
    response_model=schemas.RegularScheduleOut,
    status_code=status.HTTP_201_CREATED,
    summary="Добавить регулярное расписание"
)
def add_regular_schedule(
        schedule: schemas.RegularScheduleCreate,
        doctor: Doctor = Depends(get_doctor_or_404),
        db: Session = Depends(get_db)
):
    if schedule.start_day > schedule.end_day:
        raise HTTPException(400, "Конечный день должен быть >= начального")
    if schedule.valid_to < schedule.valid_from:
        raise HTTPException(400, "Конечная дата должна быть >= начальной")

    validate_time_range(schedule.start_time, schedule.end_time)

    overlapping = db.query(DoctorSchedule).filter(
        DoctorSchedule.doctor_id == doctor.id,
        DoctorSchedule.valid_from <= schedule.valid_to,
        DoctorSchedule.valid_to >= schedule.valid_from
    ).first()
    if overlapping:
        raise HTTPException(409, "Пересечение с существующим расписанием")

    db_schedule = DoctorSchedule(**schedule.model_dump(), doctor_id=doctor.id)
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return schemas.RegularScheduleOut.model_validate(db_schedule)

@router.post(
    "/bulk-exceptions",
    response_model=List[schemas.ScheduleExceptionOut],
    summary="Добавить исключения",
    status_code=status.HTTP_201_CREATED
)
def add_bulk_exceptions(
        exceptions: List[schemas.ScheduleExceptionCreate],
        doctor: Doctor = Depends(get_doctor_or_404),
        db: Session = Depends(get_db)
):
    existing_dates = {
        ex.date for ex in db.query(ScheduleException)
        .filter(
            ScheduleException.doctor_id == doctor.id,
            ScheduleException.date.in_([e.date for e in exceptions])
        ).all()
    }

    new_exceptions = []
    for exc in exceptions:
        if exc.date in existing_dates:
            continue
        if exc.is_working:
            validate_time_range(exc.start_time, exc.end_time)

        db_exc = ScheduleException(**exc.model_dump(), doctor_id=doctor.id)
        db.add(db_exc)
        new_exceptions.append(db_exc)

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(400, f"Ошибка БД: {str(e)}")

    return [schemas.ScheduleExceptionOut.model_validate(ex) for ex in new_exceptions]

@router.get(
    "/{year}/{month}",
    response_model=List[schemas.DailyScheduleOut],
    summary="Расписание на месяц"
)
def get_monthly_schedule(
        doctor_id: int,
        year: int,
        month: int,
        db: Session = Depends(get_db),
        doctor: Doctor = Depends(get_doctor_or_404)
):
    def last_day_of_month(d: date) -> date:
        return (d.replace(day=28) + relativedelta(days=4)).replace(day=1) - timedelta(days=1)

    start_date = date(year, month, 1)
    end_date = last_day_of_month(start_date)

    schedules = db.query(DoctorSchedule).filter(
        DoctorSchedule.doctor_id == doctor.id,
        DoctorSchedule.valid_from <= end_date,
        DoctorSchedule.valid_to >= start_date
    ).order_by(DoctorSchedule.valid_from).all()

    exceptions = db.query(ScheduleException).filter(
        ScheduleException.doctor_id == doctor.id,
        ScheduleException.date.between(start_date, end_date)
    ).all()

    result = []
    current_date = start_date
    exceptions_map = {ex.date: ex for ex in exceptions}

    while current_date <= end_date:
        entry = schemas.DailyScheduleOut(
            date=current_date,
            working=False,
            start_time=None,
            end_time=None,
            reason=None
        )

        if current_date in exceptions_map:
            ex = exceptions_map[current_date]
            entry.reason = ex.reason
            if ex.is_working:
                entry.working = True
                entry.start_time = ex.start_time
                entry.end_time = ex.end_time
        else:
            for sched in schedules:
                if (sched.valid_from <= current_date <= sched.valid_to and
                        sched.start_day <= current_date.weekday() <= sched.end_day):
                    entry.working = True
                    entry.start_time = sched.start_time
                    entry.end_time = sched.end_time
                    break

        result.append(entry)
        current_date += timedelta(days=1)

    return result

@router.delete(
    "/regular/{schedule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить расписание"
)
def delete_regular_schedule(schedule_id: int, db: Session = Depends(get_db)):
    schedule = db.query(DoctorSchedule).get(schedule_id)
    if not schedule:
        raise HTTPException(404, "Расписание не найдено")
    db.delete(schedule)
    db.commit()

@router.delete(
    "/exception/{exception_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить исключение"
)
def delete_exception(exception_id: int, db: Session = Depends(get_db)):
    exception = db.query(ScheduleException).get(exception_id)
    if not exception:
        raise HTTPException(404, "Исключение не найдено")
    db.delete(exception)
    db.commit()