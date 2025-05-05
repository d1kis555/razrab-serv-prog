import React from 'react';
import '../styles/clients.css';
import { Link } from 'react-router-dom';

const ClientsPage = () => {
  return (
    <div className="clients-container">
      <section className="clients-hero">
        <div className="clients-wrapper clients-hero-content">
          <h1>Забота о вашем питомце — наш приоритет</h1>
          <p>Получайте профессиональную помощь и рекомендации, не выходя из дома.</p>
        </div>
      </section>

      <section className="clients-services">
        <div className="clients-wrapper">
          <h2 className="section-title">Наши возможности</h2>
          <div className="clients-cards-grid">
            <ServiceCard title="Онлайн-консультация" description="Свяжитесь с ветеринаром в удобное время." icon="🩺" />
            <ServiceCard title="Рекомендации по питанию" description="Подбор рациона по породе, возрасту и здоровью." icon="🥗" />
            <ServiceCard title="Запись в клинику" description="Удобное бронирование без звонков." icon="📅" />
            <ServiceCard title="Вызов врача на дом" description="Профессиональная помощь у вас дома." icon="🚑" />
            <ServiceCard title="Интеграция с ошейником" description="Следите за активностью и здоровьем." icon="📡" />
          </div>
        </div>
      </section>

      <section className="clients-cta">
        <div className="clients-wrapper">
          <h2>Готовы начать?</h2>
          <p>Зарегистрируйтесь и получите первую консультацию бесплатно.</p>
          <Link to="/login" className="clients-button">
                Войти в личный кабинет
                </Link>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ title, description, icon }) => (
  <div className="clients-card">
    <div className="clients-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default ClientsPage;
