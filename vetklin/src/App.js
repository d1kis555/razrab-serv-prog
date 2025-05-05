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
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import ClientsPage from './pages/ClientsPage';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setIsAdminAuthenticated(!!adminToken);
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
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/about" element={<AboutPage />} />
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

            
            <Route 
              path="/admin/login" 
              element={
                isAdminAuthenticated ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />
                )
              } 
            />
            <Route 
              path="/admin" 
              element={
                isAdminAuthenticated ? (
                  <AdminDashboard setIsAdminAuthenticated={setIsAdminAuthenticated} />
                ) : (
                  <Navigate to="/admin/login" replace />
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
