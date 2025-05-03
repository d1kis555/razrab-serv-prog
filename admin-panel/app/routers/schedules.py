from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.database import get_db
from app import models, schemas
from typing import List
from dateutil.relativedelta import relativedelta
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/doctors/{doctor_id}/schedule", tags=["Schedule"])


def validate_time_range(start: str, end: str):
    """Проверка временного интервала с учетом ночных смен"""
    if start >= end and end != "00:00":
        raise HTTPException(
            status_code=400,
            detail="Start time must be before end time (use 00:00 for night shifts)"
        )


async def get_doctor_or_404(
        doctor_id: int,
        db: Session = Depends(get_db)
) -> models.Doctor:
    doctor = db.query(models.Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@router.post(
    "/regular",
    response_model=schemas.RegularSchedule,
    status_code=status.HTTP_201_CREATED,
    summary="Добавить регулярное расписание"
)
def add_regular_schedule(
        schedule: schemas.RegularScheduleCreate,
        doctor: models.Doctor = Depends(get_doctor_or_404),
        db: Session = Depends(get_db)
):
    # Валидация дней недели
    if schedule.start_day > schedule.end_day:
        raise HTTPException(
            status_code=400,
            detail="End day must be >= start day"
        )

    # Валидация дат
    if schedule.valid_to < schedule.valid_from:
        raise HTTPException(
            status_code=400,
            detail="End date must be >= start date"
        )

    validate_time_range(schedule.start_time, schedule.end_time)

    # Проверка пересечений
    overlapping = db.query(models.DoctorSchedule).filter(
        models.DoctorSchedule.doctor_id == doctor.id,
        models.DoctorSchedule.valid_from <= schedule.valid_to,
        models.DoctorSchedule.valid_to >= schedule.valid_from
    ).first()

    if overlapping:
        raise HTTPException(
            status_code=409,
            detail="Schedule overlaps with existing"
        )

    db_schedule = models.DoctorSchedule(
        **schedule.dict(),
        doctor_id=doctor.id
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


@router.post(
    "/bulk-exceptions",
    response_model=List[schemas.ScheduleException],
    summary="Добавить несколько исключений",
    status_code=status.HTTP_201_CREATED
)
def add_bulk_exceptions(
        exceptions: List[schemas.ScheduleExceptionCreate],
        doctor: models.Doctor = Depends(get_doctor_or_404),
        db: Session = Depends(get_db)
):
    new_exceptions = []
    existing_dates = {
        ex.date for ex in db.query(models.ScheduleException)
        .filter(
            models.ScheduleException.doctor_id == doctor.id,
            models.ScheduleException.date.in_([e.date for e in exceptions])
        ).all()
    }

    for exc in exceptions:
        if exc.date in existing_dates:
            continue

        if exc.is_working:
            validate_time_range(exc.start_time, exc.end_time)

        db_exc = models.ScheduleException(
            **exc.dict(exclude_unset=True),
            doctor_id=doctor.id
        )
        db.add(db_exc)
        new_exceptions.append(db_exc)

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Database error: {str(e)}"
        )

    for exc in new_exceptions:
        db.refresh(exc)

    return new_exceptions


@router.get(
    "/{year}/{month}",
    response_model=List[schemas.DailySchedule],
    summary="Получить расписание на месяц"
)
def get_monthly_schedule(
        doctor_id: int,
        year: int,
        month: int,
        db: Session = Depends(get_db),
        doctor: models.Doctor = Depends(get_doctor_or_404)
):
    def last_day_of_month(d: date) -> date:
        return (d.replace(day=28) + relativedelta(days=4)).replace(day=1) - timedelta(days=1)

    start_date = date(year, month, 1)
    end_date = last_day_of_month(start_date)

    schedules = db.query(models.DoctorSchedule).filter(
        models.DoctorSchedule.doctor_id == doctor.id,
        models.DoctorSchedule.valid_from <= end_date,
        models.DoctorSchedule.valid_to >= start_date
    ).order_by(models.DoctorSchedule.valid_from).all()

    exceptions = db.query(models.ScheduleException).filter(
        models.ScheduleException.doctor_id == doctor.id,
        models.ScheduleException.date.between(start_date, end_date)
    ).all()

    result = []
    current_date = start_date
    exceptions_map = {ex.date: ex for ex in exceptions}

    while current_date <= end_date:
        entry = schemas.DailySchedule(
            date=current_date,
            working=False,
            start_time=None,
            end_time=None,
            reason=None
        )

        # Обработка исключений
        if current_date in exceptions_map:
            ex = exceptions_map[current_date]
            entry.reason = ex.reason
            if ex.is_working:
                entry.working = True
                entry.start_time = ex.start_time
                entry.end_time = ex.end_time

        # Поиск регулярного расписания
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
def delete_regular_schedule(
        schedule_id: int,
        db: Session = Depends(get_db)
):
    schedule = db.query(models.DoctorSchedule).get(schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()


@router.delete(
    "/exception/{exception_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить исключение"
)
def delete_exception(
        exception_id: int,
        db: Session = Depends(get_db)
):
    exception = db.query(models.ScheduleException).get(exception_id)
    if not exception:
        raise HTTPException(status_code=404, detail="Exception not found")
    db.delete(exception)
    db.commit()