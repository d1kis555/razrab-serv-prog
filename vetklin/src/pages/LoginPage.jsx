import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const LoginPage = ({ setIsAuthenticated }) => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Валидация
    if (!formData.username || !formData.password) {
      setErrors({
        ...errors,
        general: 'Имя пользователя и пароль обязательны'
      });
      setLoading(false);
      return;
    }

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

    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
      const response = await axios.post(`http://localhost:3001${endpoint}`, {
        username: formData.username,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', formData.username);
      setIsAuthenticated(true);

  
      navigate('/user');
    } catch (error) {
      console.error('Ошибка авторизации:', error.response?.data || error.message);

      let serverError = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Произошла ошибка при авторизации';

      if (error.response?.status === 401) {
        serverError = 'Неверное имя пользователя или пароль';
      } else if (error.response?.status === 400) {
        if (error.response.data?.message?.includes('username')) {
          serverError = 'Пользователь с таким именем не найден';
        } else if (error.response.data?.message?.includes('password')) {
          serverError = 'Неверный пароль';
        }
      }

      setErrors({
        ...errors,
        general: serverError
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({
      username: '',
      password: '',
      confirmPassword: '',
      general: ''
    });
  };

  return (
    <AuthContainer>
      <AuthWindow>
        <Title>{mode === 'login' ? 'Вход в личный кабинет' : 'Регистрация'}</Title>

        {errors.general && <ErrorText style={{ marginBottom: '20px' }}>{errors.general}</ErrorText>}

        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="username"
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={handleInputChange}
            required
            error={!!errors.username}
          />
          {errors.username && <ErrorText>{errors.username}</ErrorText>}

          <InputField
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleInputChange}
            required
            error={!!errors.password}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          {mode === 'register' && (
            <>
              <InputField
                type="password"
                name="confirmPassword"
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
            </>
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
