# test_smtp.py
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
load_dotenv()
def send_test_email():
    smtp_user = os.getenv("EMAIL_USER")
    smtp_pass = os.getenv("EMAIL_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))

    msg = MIMEText("Тестовое сообщение")
    msg['Subject'] = 'Тест SMTP'
    msg['From'] = smtp_user
    msg['To'] = "pharmacyvetlab@gmail.com"  # Замените на реальный email

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            print("✅ Email отправлен успешно!")
    except Exception as e:
        print(f"❌ Ошибка: {str(e)}")

if __name__ == "__main__":
    send_test_email()