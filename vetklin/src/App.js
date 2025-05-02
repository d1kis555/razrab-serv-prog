import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import HomePage from './pages/HomePage';
import OnlineConsultationPage from './pages/OnlineConsultationPage';
import RoutineCheckupPage from './pages/RoutineCheckupPage';
import ProcedurePreparationPage from './pages/ProcedurePreparationPage';
import VaccinationPage from './pages/VaccinationPage';
import SpecialistPage from './pages/SpecialistPage';
import LoginPage from './pages/LoginPage';
import './App.css';
import Footer from './components/footer';
import UserPage from './pages/UserPage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем аутентификацию при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="app">
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
            <Route path="/online-consultation" element={<OnlineConsultationPage />} />
            <Route path="/routine-checkup" element={<RoutineCheckupPage />} />
            <Route path="/procedure-preparation" element={<ProcedurePreparationPage />} />
            <Route path="/vaccination" element={<VaccinationPage />} />
            <Route path="/specialist/:id" element={<SpecialistPage />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/user" replace />
                ) : (
                  <LoginPage setIsAuthenticated={setIsAuthenticated} />
                )
              } 
            />
            <Route 
              path="/user" 
              element={
                isAuthenticated ? (
                  <UserPage setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;