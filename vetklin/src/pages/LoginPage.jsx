import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import styled from 'styled-components';

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const AuthWindow = styled.div`
  width: 1280px;
  height: 700px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 60px;
  color: #333;
`;

const InputField = styled.input`
  width: 693px;
  height: 62px;
  border: 1px solid ${props => props.error ? '#ff4d4f' : '#ddd'};
  border-radius: 10px;
  padding: 0 20px;
  font-size: 18px;
  margin-bottom: 5px;
  outline: none;
  transition: border 0.3s;

  &:focus {
    border-color: ${props => props.error ? '#ff4d4f' : '#3A65BF'};
  }
`;

const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  margin-bottom: 15px;
  width: 693px;
  text-align: left;
`;

const QRContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 40px 0;
`;

const QRCodeWrapper = styled.div`
  margin-right: 40px;
`;

const QRText = styled.div`
  font-size: 18px;
  color: #555;
  max-width: 500px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
`;

const PrimaryButton = styled.button`
  width: 267px !important;
  height: 62px !important;
  background-color: #3A65BF;
  color: white !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 18px !important;
  cursor: pointer !important;
  transition: background-color 0.3s !important;

  &:hover {
    background-color: #2a4d9b;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  width: 267px;
  height: 62px;
  background-color: #E0ECEC;
  color: #333;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c9dada;
  }
`;

const ToggleText = styled.p`
  margin-top: 20px;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #3A65BF;
  }
`;

const LoginPage = () => {
  const [mode, setMode] = useState('login'); 
  const [formData, setFormData] = useState({ 
    login: '', 
    password: '',
    confirmPassword: '' 
  });
  const [authData, setAuthData] = useState(null);
  const [errors, setErrors] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTelegramAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/telegram/generate-token');
      setAuthData({
        authUrl: response.data.authUrl,
        token: response.data.token,
        expiresAt: new Date(response.data.expiresAt)
      });
      setErrors({
        login: '',
        password: '',
        confirmPassword: '',
        general: ''
      });
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Ошибка при генерации QR-кода'
      });
      console.error('Telegram auth error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      setErrors({
        ...errors,
        password: 'Пароли не совпадают',
        confirmPassword: 'Пароли не совпадают',
        general: 'Пароли не совпадают'
      });
      setLoading(false);
      return;
    }


    setErrors({
      login: '',
      password: '',
      confirmPassword: '',
      general: ''
    });

    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
      const dataToSend = mode === 'login' 
        ? { login: formData.login, password: formData.password }
        : { login: formData.login, password: formData.password };

      const response = await axios.post(`http://localhost:3001${endpoint}`, dataToSend);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (mode === 'login' ? 'Ошибка при входе' : 'Ошибка при регистрации');
      
      if (error.response?.data?.errors) {
        setErrors({
          ...error.response.data.errors,
          general: errorMessage
        });
      } else {
        setErrors({
          ...errors,
          general: errorMessage
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({
      login: '',
      password: '',
      confirmPassword: '',
      general: ''
    });
  };

  return (
    <AuthContainer>
      <AuthWindow>
        <Title>{mode === 'login' ? 'Вход в личный кабинет клиента' : 'Регистрация'}</Title>
        
        {errors.general && <ErrorText style={{ marginBottom: '20px' }}>{errors.general}</ErrorText>}
        
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="Ваш номер телефона или почта"
            value={formData.login}
            onChange={(e) => setFormData({...formData, login: e.target.value})}
            required
            error={!!errors.login}
          />
          {errors.login && <ErrorText>{errors.login}</ErrorText>}
          
          <InputField
            type="password"
            placeholder="Ваш пароль"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            error={!!errors.password}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          {mode === 'register' && (
            <>
              <InputField
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
            </>
          )}
          
          {mode === 'login' && (
            <QRContainer>
              <QRCodeWrapper>
                {authData ? (
                  <QRCodeSVG
                    value={authData.authUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                ) : (
                  <div style={{ width: 200, height: 200, backgroundColor: '#f0f0f0' }} />
                )}
              </QRCodeWrapper>
              
              <QRText>
                Привяжите свой аккаунт Telegram<br />
                И получите возможность авторизовываться с помощью qr-кода
                
              </QRText>
            </QRContainer>
          )}
          
          <ButtonGroup>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </PrimaryButton>
            <SecondaryButton 
              type="button" 
              onClick={toggleMode}
              disabled={loading}
            >
              {mode === 'login' ? 'Регистрация' : 'Войти'}
            </SecondaryButton>
          </ButtonGroup>
        </form>
        
        <ToggleText onClick={toggleMode}>
          {mode === 'login' ? 'Нет аккаунта? Пройдите регистрацию' : 'Уже есть аккаунт? Войдите'}
        </ToggleText>
      </AuthWindow>
    </AuthContainer>
  );
};

export default LoginPage;