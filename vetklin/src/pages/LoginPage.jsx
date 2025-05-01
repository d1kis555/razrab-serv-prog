import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [qrCode, setQrCode] = useState(null);
  const navigate = useNavigate();

  const handleTelegramAuth = async () => {
    try {
      const { data } = await axios.get('/api/auth/telegram/qr');
      setQrCode(data.qrImage); // Сохраняем QR-код в состоянии
    } catch (error) {
      console.error('Ошибка при получении QR-кода:', error);
    }
  };

    
  
  return (
    <div className="auth-container">
      {qrCode ? (
        <div className="telegram-auth">
          <h3>Авторизация через Telegram</h3>
          <img src={qrCode} alt="Telegram QR Code" style={{ width: '200px' }} />
          <p>Отсканируйте QR-код в приложении Telegram</p>
          <button onClick={() => setQrCode(null)}>Назад</button>
        </div>
      ) : (
        <>
          <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
          <form>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button type="submit">
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
          <div className="auth-options">
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
            <button onClick={handleTelegramAuth}>Войти через Telegram</button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;