
import React, { useState } from 'react';

const AddReminderModal = ({ isActive, onClose, onAddReminder, pets }) => {
  const [formData, setFormData] = useState({
    petName: '',
    procedureType: '',
    procedureName: '',
    date: '',
    repeatDays: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddReminder(formData);
    setFormData({
      petName: '',
      procedureType: '',
      procedureName: '',
      date: '',
      repeatDays: '',
      notes: ''
    });
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Добавить напоминание</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Выберите питомца</label>
              <div className="control">
                <div className="select">
                  <select
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите питомца</option>
                    {pets.map((pet, index) => (
                      <option key={index} value={pet.name}>{pet.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Тип процедуры</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="procedureType"
                  value={formData.procedureType}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Название процедуры</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="procedureName"
                  value={formData.procedureName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Дата</label>
              <div className="control">
                <input
                  className="input"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Повторять каждые (дней)</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="repeatDays"
                  value={formData.repeatDays}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Заметки</label>
              <div className="control">
                <textarea
                  className="textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={handleSubmit}>Добавить напоминание</button>
          <button className="button" onClick={onClose}>Отмена</button>
        </footer>
      </div>
    </div>
  );
};

export default AddReminderModal;