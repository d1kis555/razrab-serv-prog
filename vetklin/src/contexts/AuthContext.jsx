// src/contexts/AuthContext.jsx
import React, { createContext, useState } from 'react';
import { login as apiLogin } from '../api/auth';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (username, password) => {
    const { data } = await apiLogin({ username, password });
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
