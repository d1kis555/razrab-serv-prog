import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import HomePage from './pages/HomePage';
import OnlineConsultationPage from './pages/OnlineConsultationPage';
import RoutineCheckupPage from './pages/RoutineCheckupPage';
import ProcedurePreparationPage from './pages/ProcedurePreparationPage';
import VaccinationPage from './pages/VaccinationPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Хедер на всех страницах */}
        <Header />
        
        <main className="main-content">
          <Routes>
            {/* Главная страница */}
            <Route path="/" element={<HomePage />} />
            
            {/* Страницы услуг */}
            <Route path="/online-consultation" element={<OnlineConsultationPage />} />
            <Route path="/routine-checkup" element={<RoutineCheckupPage />} />
            <Route path="/procedure-preparation" element={<ProcedurePreparationPage />} />
            <Route path="/vaccination" element={<VaccinationPage />} />
            
            {/* Можно добавить другие маршруты позже */}
            {/* <Route path="/about" element={<AboutPage />} /> */}
            {/* <Route path="/contacts" element={<ContactsPage />} /> */}
          </Routes>
        </main>
        
        {/* Футер можно добавить позже */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;