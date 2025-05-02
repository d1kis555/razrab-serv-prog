import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/image/logo.png';
import loginIcon from '../assets/image/login-icon.png';
import '../styles/header.css';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/user'); // Перенаправляем в личный кабинет
    } else {
      navigate('/login'); // Перенаправляем на страницу входа
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header>
      <div className="navbar-top">
        <div className="container">
          <div className="navbar-start">
            <div className="navbar-item">
              <img 
                src={logo} 
                alt="Логотип ветеринарной клиники" 
                className="logo" 
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div className="navbar-item" style={{ marginLeft: '30px' }}>
              <p className="header-text">
                <em>Здоровье вашего питомца – наша ценность</em>
              </p>
              <div className="working-hours">
                <p className='header-text'>Режим работы:</p>
                <div className="hours-grid">
                  <span style={{color: '#18AEA5'}}>Пн-Пт:</span>
                  <span style={{color: '#3A65BF'}}>Сб-Вс:</span>
                  <span>8:00-20:00</span>
                  <span>8:00-17:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <button className="button is-light">Заказать звонок</button>
            </div>
            <div className="navbar-item">
              {isAuthenticated ? (
                <div className="auth-buttons">
                  <button 
                    className="button is-light"
                    onClick={() => navigate('/user')}
                    style={{ marginRight: '10px' }}
                  >
                    Личный кабинет
                  </button>
                  <button 
                    className="button is-light"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <button 
                  className="login-button"
                  onClick={handleAuthClick}
                >
                  <img src={loginIcon} alt="Иконка входа в систему" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar-bottom">
        <div className="container">
          <div className="navbar-menu">
            <a href="/services" className="nav-link">Услуги и стоимость</a>
            <a href="/clients" className="nav-link">Клиентам</a>
            <a href="/specialists" className="nav-link">Наши специалисты</a>
            <a href="/about" className="nav-link">О нас</a>
            <a href="/blog" className="nav-link">Блог</a>
            <a href="/contacts" className="nav-link">Контакты</a>
            
            <div className="nav-consultation">
              <button className="button is-primary">Форум</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;