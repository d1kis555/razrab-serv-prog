from flask import Flask, request, render_template, redirect, url_for
import psycopg2
from datetime import datetime

app = Flask(__name__)

# Конфигурация БД
DB_CONFIG = {
    "host": "localhost",
    "database": "reviews_db",
    "user": "postgres",
    "password": "Kunts123!"
}


@app.route('/')
def index():
    return render_template('form.html')


@app.route('/submit_review', methods=['POST'])
def submit_review():
    if request.method == 'POST':
        doctor = request.form.get('doctor')
        feedback = request.form.get('feedback')
        rating = request.form.get('rating')

        if not all([doctor, feedback, rating]):
            return "Не все поля заполнены", 400

        try:
            conn = psycopg2.connect(**DB_CONFIG)
            cursor = conn.cursor()

            cursor.execute(
                "INSERT INTO reviews (doctor_name, feedback, rating) VALUES (%s, %s, %s)",
                (doctor, feedback, rating)
            )

            conn.commit()
            return redirect(url_for('success'))

        except Exception as e:
            print(f"Ошибка: {e}")
            return "Ошибка при сохранении", 500

        finally:
            if 'conn' in locals():
                conn.close()

    return redirect(url_for('index'))


@app.route('/success')
def success():
    return "Спасибо за ваш отзыв! Он успешно сохранён."


if __name__ == '__main__':
    app.run(debug=True)