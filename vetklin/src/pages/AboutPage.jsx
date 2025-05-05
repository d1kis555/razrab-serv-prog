import React from 'react';
import Contacts from '../components/contacts';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-wrapper">
        <section className="about-hero">
          <h1>О нашей экосистеме</h1>
          <p>
            Мы создаём единое пространство для заботы о животных — от консультаций и рекомендаций по уходу до вызова врача и анализа данных с умных устройств.
          </p>
        </section>

        <section className="about-content">
          <div className="about-text-block">
            <h2>Зачем мы это делаем</h2>
            <p>
              Мы верим, что технологии могут изменить ветеринарную помощь — сделать её более доступной, быстрой и удобной. Наша цель — сделать жизнь питомца и его хозяина спокойнее, увереннее и счастливее.
            </p>
          </div>

          <div className="about-text-block">
            <h2>Что входит в экосистему</h2>
            <ul>
              <li>• Онлайн-консультации с ветеринарами</li>
              <li>• Рекомендации по кормлению и уходу</li>
              <li>• Запись в клинику и к специалисту</li>
              <li>• Вызов врача на дом</li>
              <li>• Интеграция с умными ошейниками</li>
              <li>• Форум для общения с экспертами</li>
            </ul>
          </div>
        </section>

        <section className="about-contacts-section">
          <h2>Наши контакты</h2>
          <Contacts />
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
