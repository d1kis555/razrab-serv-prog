import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import HomePage from './pages/HomePage';
import OnlineConsultationPage from './pages/OnlineConsultationPage';
import RoutineCheckupPage from './pages/RoutineCheckupPage';
import ProcedurePreparationPage from './pages/ProcedurePreparationPage';
import VaccinationPage from './pages/VaccinationPage';
import SpecialistPage from './pages/SpecialistPage'; 
import './App.css';
import Footer from './components/footer';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/online-consultation" element={<OnlineConsultationPage />} />
            <Route path="/routine-checkup" element={<RoutineCheckupPage />} />
            <Route path="/procedure-preparation" element={<ProcedurePreparationPage />} />
            <Route path="/vaccination" element={<VaccinationPage />} />
            <Route path="/specialist/:id" element={<SpecialistPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;