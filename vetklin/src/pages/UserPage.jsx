import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserPage.css';
import AddPetModal from '../components/AddPetModal';

function UserPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [activeModal, setActiveModal] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleAddPet = (newPet) => {
    setPets([...pets, newPet]);
    setActiveModal(null);
  };

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="user-page-container">
      <div className="user-page-content">
        <header className="user-header">
          <h1 className="user-title">Добро пожаловать, {username}!</h1>
          <h2 className="user-subtitle">Ваш личный кабинет</h2>
        </header>

        <div className="user-main">
          <div className="user-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Меню</h3>
              <button 
                className="sidebar-button primary"
                onClick={() => openModal('addPet')}
              >
                Добавить питомца
              </button>
              <button className="sidebar-button">Рекомендации по уходу</button>
              <button className="sidebar-button">Напоминания для питомца</button>
              <button className="sidebar-button">Процедуры питомца</button>
              <button className="sidebar-button">Каталог продукции</button>
            </div>
          </div>

          <div className="user-content">
            <div className="pets-section">
              <h3 className="section-title">Ваши питомцы</h3>
              {pets.length === 0 ? (
                <p className="no-pets-message">У вас пока нет добавленных питомцев</p>
              ) : (
                <div className="pets-list">
                  {pets.map((pet, index) => (
                    <div key={index} className="pet-card">
                      <div className="pet-info">
                        <h4 className="pet-name">{pet.name}</h4>
                        <p>Тип: {pet.type}</p>
                        <p>Порода: {pet.breed}</p>
                        <p>Возраст: {pet.years} лет {pet.months} месяцев</p>
                        <p>Аллергии: {pet.allergies || 'нет'}</p>
                      </div>
                      <div className="pet-actions">
                        <button className="action-button warning">Рекомендации по корму</button>
                        <button className="action-button danger">Рекомендации по аллергиям</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddPetModal 
        isActive={activeModal === 'addPet'} 
        onClose={closeModal} 
        onAddPet={handleAddPet} 
      />
    </div>
  );
}

export default UserPage;