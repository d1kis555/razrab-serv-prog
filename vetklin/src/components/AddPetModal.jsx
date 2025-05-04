import React, { useState } from 'react';

const AddPetModal = ({ isActive, onClose, onAddPet }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    months: '',
    years: '',
    allergies: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPet(formData);
    setFormData({
      name: '',
      type: '',
      breed: '',
      months: '',
      years: '',
      allergies: ''
    });
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Добавить питомца</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Имя питомца</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Тип питомца</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Порода</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Возраст (Месяцы)</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      name="months"
                      value={formData.months}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Возраст (Лет)</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      name="years"
                      value={formData.years}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Аллергия</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={handleSubmit}>Добавить питомца</button>
          <button className="button" onClick={onClose}>Отмена</button>
        </footer>
      </div>
    </div>
  );
};

export default AddPetModal;