// UserPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserPage.css';
import AddPetModal from '../components/AddPetModal';
import AddReminderModal from '../components/AddReminderModal';
import AddProcedureModal from '../components/AddProcedureModal'; 
function UserPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [activeModal, setActiveModal] = useState(null);
  const [pets, setPets] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [procedures, setProcedures] = useState([]); 
  const [activeTab, setActiveTab] = useState('pets');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleAddPet = (newPet) => {
    setPets([...pets, newPet]);
    setActiveModal(null);
  };

  const handleAddReminder = (newReminder) => {
    setReminders([...reminders, newReminder]);
    setActiveModal(null);
  };

  const handleAddProcedure = (newProcedure) => {
    setProcedures([...procedures, newProcedure]);
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
              
              <button 
                className="sidebar-button primary"
                onClick={() => openModal('addPet')}
              >
                Добавить питомца
              </button>
              <button 
                className="sidebar-button"
                onClick={() => setActiveTab('pets')}
              >
                Ваши питомцы
              </button>
              <button 
                className="sidebar-button"
                onClick={() => setActiveTab('reminders')}
              >
                Напоминания для питомца
              </button>
              <button 
                className="sidebar-button"
                onClick={() => setActiveTab('procedures')}
              >
                Процедуры питомца
              </button>
              <button className="sidebar-button">Каталог продукции</button>
            </div>
          </div>

          <div className="user-content">
            {activeTab === 'pets' ? (
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
            ) : activeTab === 'reminders' ? (
              <div className="reminders-section">
                <div className="section-header">
                  <h3 className="section-title">Напоминания</h3>
                  <button 
                    className="action-button primary"
                    onClick={() => openModal('addReminder')}
                  >
                    Добавить напоминание
                  </button>
                </div>
                {reminders.length === 0 ? (
                  <p className="no-reminders-message">У вас пока нет напоминаний</p>
                ) : (
                  <div className="reminders-list">
                    {reminders.map((reminder, index) => (
                      <div key={index} className="reminder-card">
                        <div className="reminder-info">
                          <h4 className="reminder-pet-name">{reminder.petName}</h4>
                          <p><strong>Тип процедуры:</strong> {reminder.procedureType}</p>
                          <p><strong>Название:</strong> {reminder.procedureName}</p>
                          <p><strong>Дата:</strong> {reminder.date}</p>
                          <p><strong>Повторение:</strong> каждые {reminder.repeatDays} дней</p>
                          <p><strong>Заметки:</strong> {reminder.notes || 'нет'}</p>
                        </div>
                        <div className="reminder-actions">
                          <button className="action-button danger">Удалить</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="procedures-section">
                <div className="section-header">
                  <h3 className="section-title">Процедуры</h3>
                  <button 
                    className="action-button primary"
                    onClick={() => openModal('addProcedure')}
                  >
                    Добавить процедуру
                  </button>
                </div>
                {procedures.length === 0 ? (
                  <p className="no-procedures-message">У вас пока нет процедур</p>
                ) : (
                  <div className="procedures-list">
                    {procedures.map((procedure, index) => (
                      <div key={index} className="procedure-card">
                        <div className="procedure-info">
                          <h4 className="procedure-pet-name">{procedure.petName}</h4>
                          <p><strong>Тип процедуры:</strong> {procedure.procedureType}</p>
                          <p><strong>Название:</strong> {procedure.procedureName}</p>
                          <p><strong>Дата процедуры:</strong> {procedure.date}</p>
                        </div>
                        <div className="procedure-actions">
                          <button className="action-button danger">Удалить</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddPetModal 
        isActive={activeModal === 'addPet'} 
        onClose={closeModal} 
        onAddPet={handleAddPet} 
        pets={pets}
      />

      <AddReminderModal 
        isActive={activeModal === 'addReminder'} 
        onClose={closeModal} 
        onAddReminder={handleAddReminder}
        pets={pets}
      />

      <AddProcedureModal 
        isActive={activeModal === 'addProcedure'} 
        onClose={closeModal} 
        onAddProcedure={handleAddProcedure}
        pets={pets}
      />
    </div>
  );
}

export default UserPage;