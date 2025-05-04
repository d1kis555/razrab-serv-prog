import requests
import pytest

BASE_URL = "http://localhost:8000"


# Вспомогательные функции
def register_user(email: str, password: str):
    url = f"{BASE_URL}/auth/user/register"
    data = {"email": email, "password": password}
    return requests.post(url, json=data)


def login_user(email: str, password: str):
    url = f"{BASE_URL}/auth/user/login"
    data = {"username": email, "password": password}
    return requests.post(url, data=data)


def create_post(token: str, title: str, content: str):
    url = f"{BASE_URL}/forum/posts"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"title": title, "content": content}
    return requests.post(url, headers=headers, json=data)


def create_comment(token: str, post_id: int, content: str):
    url = f"{BASE_URL}/forum/posts/{post_id}/comments"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"content": content}
    return requests.post(url, headers=headers, json=data)


def create_doctor(token: str, name: str, clinic_id: int):
    url = f"{BASE_URL}/doctors/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"name": name, "clinic_id": clinic_id}
    return requests.post(url, headers=headers, json=data)


def create_review(token: str, doctor_id: int, content: str, rating: int):
    url = f"{BASE_URL}/reviews/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "doctor_id": doctor_id,
        "content": content,
        "rating": rating
    }
    return requests.post(url, headers=headers, json=data)


def test_full_flow():
    # 1. Создаем администратора и клинику
    admin_data = {"email": "admin@example.com", "password": "admin"}
    register_user(**admin_data)
    admin_login = login_user(**admin_data)
    admin_token = admin_login.json()["access_token"]

    # Создаем клинику
    clinic_data = {"name": "Test Clinic"}
    clinic_res = requests.post(
        f"{BASE_URL}/clinics/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json=clinic_data
    )
    clinic_id = clinic_res.json()["id"]

    # 2. Создаем доктора и расписание
    doctor_data = {"name": "Dr. Smith", "clinic_id": clinic_id}
    doctor_res = create_doctor(admin_token, **doctor_data)
    doctor_id = doctor_res.json()["id"]

    # 3. Регистрируем обычного пользователя
    user_data = {"email": "user@example.com", "password": "password"}
    register_res = register_user(**user_data)
    assert register_res.status_code == 200

    # 4. Логинимся пользователем
    login_res = login_user(**user_data)
    assert login_res.status_code == 200
    user_token = login_res.json()["access_token"]

    # 5. Создаем пост
    post_data = {"title": "First Post", "content": "Hello World!"}
    post_res = create_post(user_token, **post_data)
    assert post_res.status_code == 201
    post_id = post_res.json()["id"]

    # 6. Создаем комментарий
    comment_data = {"content": "Nice post!"}
    comment_res = create_comment(user_token, post_id, **comment_data)
    assert comment_res.status_code == 201

    # 7. Оставляем отзыв доктору
    review_data = {
        "doctor_id": doctor_id,
        "content": "Great doctor!",
        "rating": 5
    }
    review_res = create_review(user_token, **review_data)
    assert review_res.status_code == 201

    # 8. Проверяем созданные данные
    reviews_res = requests.get(f"{BASE_URL}/reviews/doctor/{doctor_id}")
    assert len(reviews_res.json()) == 1


if __name__ == "__main__":
    pytest.main([__file__])