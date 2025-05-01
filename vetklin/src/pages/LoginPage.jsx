// Создайте компонент LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'telegram', 'google'
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [qrCode, setQrCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const { data } = await axios.post(endpoint, formData);
      localStorage.setItem('token', data.token);
      navigate('/account');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = '/api/auth/google';
  };

  const handleTelegramAuth = async () => {
    const { data } = await axios.get('/api/auth/telegram/qr');
    setQrCode(data.qrImage);
    // Здесь нужно реализовать polling для проверки авторизации
  };

  return (
    <div className="login-container">
      {mode === 'telegram' && qrCode ? (
        <div className="telegram-auth">
          <img src={qrCode} alt="Telegram QR Code" />
          <p>Отсканируйте QR-код в Telegram</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit">{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
        </form>
      )}
      
      <div className="auth-options">
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
        <button onClick={handleGoogleAuth}>Войти через Google</button>
        <button onClick={handleTelegramAuth}>Войти через Telegram</button>
      </div>
    </div>
  );
};

export default LoginPage;