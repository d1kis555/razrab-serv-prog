import React from "react";
import "../styles/footer.css";
import logo from '../assets/image/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Логотип */}
          <div className="footer-logo">
            <img src={logo} alt="Ветеринарка логотип" />
          </div>

          {/* Колонки с меню */}
          <div className="footer-columns">
            {[1, 2, 3].map((col) => (
              <div className="footer-menu" key={col}>
                <ul>
                  <li>Личный кабинет</li>
                  <li>Мед.книжка питомца</li>
                  <li>Специалисты</li>
                  <li>Услуги</li>
                  <li>Блог</li>
                  <li>Онлайн бронирование</li>
                  <li>Рекомендации питомцам</li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        
        {/* Копирайт и кнопка */}
        <div className="footer-bottom">
          <div className="copyright">©2025 Ветеринарка</div>
          <button className="appointment-button">Записаться на приём</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;