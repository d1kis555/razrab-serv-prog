
import React, { useState } from 'react';

const AddProcedureModal = ({ isActive, onClose, onAddProcedure, pets }) => {
  const [formData, setFormData] = useState({
    petName: '',
    procedureType: '',
    procedureName: '',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProcedure(formData);
    setFormData({
      petName: '',
      procedureType: '',
      procedureName: '',
      date: ''
    });
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Добавить процедуру</p>
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
              <label className="label">Дата процедуры</label>
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
          </form>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={handleSubmit}>Добавить процедуру</button>
          <button className="button" onClick={onClose}>Отмена</button>
        </footer>
      </div>
    </div>
  );
};

export default AddProcedureModal;