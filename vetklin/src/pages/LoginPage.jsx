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

  const LoginPage = () => {
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({
      username: '',  // Changed from email to username
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
  
      // Validate required fields
      if (!formData.username || !formData.password) {
        setErrors({
          ...errors,
          general: 'Username and password are required'
        });
        setLoading(false);
        return;
      }
  
      if (mode === 'register' && formData.password !== formData.confirmPassword) {
        setErrors({
          ...errors,
          password: 'Passwords do not match',
          confirmPassword: 'Passwords do not match',
          general: 'Passwords do not match'
        });
        setLoading(false);
        return;
      }
  
      try {
        const endpoint = mode === 'login' ? '/api/login' : '/api/register';
        const dataToSend = {
          username: formData.username,  // Using username instead of email
          password: formData.password
        };
  
        const response = await axios.post(`http://localhost:3001${endpoint}`, dataToSend);
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          throw new Error('No token received from server');
        }
      } catch (error) {
        console.error('Auth error:', error.response?.data || error.message);
        
        const serverError = error.response?.data?.error || 
                           error.response?.data?.message || 
                           'Authentication failed';
        
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
          <Title>{mode === 'login' ? 'Login' : 'Register'}</Title>
          
          {errors.general && <ErrorText style={{ marginBottom: '20px' }}>{errors.general}</ErrorText>}
          
          <form onSubmit={handleSubmit}>
            <InputField
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              error={!!errors.username}
            />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
            
            <InputField
              type="password"
              name="password"
              placeholder="Password"
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
                  placeholder="Confirm Password"
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
                {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
              </PrimaryButton>
              <SecondaryButton 
                type="button" 
                onClick={toggleMode}
                disabled={loading}
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </SecondaryButton>
            </ButtonGroup>
          </form>
          
          <ToggleText onClick={toggleMode}>
            {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
          </ToggleText>
        </AuthWindow>
      </AuthContainer>
    );
  };
  
  export default LoginPage;