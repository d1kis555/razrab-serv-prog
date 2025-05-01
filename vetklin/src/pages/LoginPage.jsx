import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // Измененный импорт

const LoginPage = () => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [authData, setAuthData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authData) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get('/api/telegram/check-status', {
            headers: {
              Authorization: `Bearer ${authData.token}`
            }
          });
          if (response.data.isAuthenticated) {
            clearInterval(interval);
            localStorage.setItem('token', authData.token);
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [authData, navigate]);

  const handleTelegramAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/telegram/generate-token');
      setAuthData({
        token: response.data.token,
        authUrl: response.data.authUrl,
        expiresAt: new Date(response.data.expiresAt)
      });
    } catch (error) {
      setError('Ошибка при получении QR-кода');
      console.error('Telegram auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? 'http://localhost:3001/api/login' : 'http://localhost:3001/api/register';
      const response = await axios.post(endpoint, formData);
      
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Произошла ошибка');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {authData ? (
        <div className="telegram-auth">
          <h3>Авторизация через Telegram</h3>
          <QRCodeSVG 
            value={authData.authUrl} 
            size={200} 
            level="H"
            includeMargin={true}
          />
          <p>Или перейдите по ссылке: <a href={authData.authUrl}>{authData.authUrl}</a></p>
          <p>Токен действителен до: {authData.expiresAt.toLocaleTimeString()}</p>
          <button 
            onClick={() => setAuthData(null)}
            disabled={loading}
          >
            Назад
          </button>
        </div>
      ) : (
        <>
          <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Имя пользователя"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
          <div className="auth-options">
            <button 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              disabled={loading}
            >
              {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
            <button 
              onClick={handleTelegramAuth}
              disabled={loading}
            >
              Войти через Telegram
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;