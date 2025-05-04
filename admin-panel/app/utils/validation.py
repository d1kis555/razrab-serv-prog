from fastapi import HTTPException

def validate_clinic_hours(start: str, end: str):
    """Проверка рабочего времени клиник (8:00-23:00)"""
    try:
        start_h = int(start.split(':')[0])
        end_h = int(end.split(':')[0])
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Некорректный формат времени. Используйте ЧЧ:ММ"
        )

    if start_h < 8 or end_h > 23:
        raise HTTPException(
            status_code=400,
            detail="Клиника может работать только с 08:00 до 23:00"
        )

def validate_doctor_hours(start: str, end: str):
    """Базовая проверка временного интервала для врачей"""
    try:
        start_h = int(start.split(':')[0])
        end_h = int(end.split(':')[0])
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Некорректный формат времени. Используйте ЧЧ:ММ"
        )

    if start_h < 8 or end_h > 23:
        raise HTTPException(
            status_code=400,
            detail="Клиника может работать только с 08:00 до 23:00"
        )