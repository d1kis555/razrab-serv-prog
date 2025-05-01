import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/services-section.css';

const ServicesSectionmain = () => {
  const navigate = useNavigate();


  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.7556 18.5775L14.0687 12.8906C15.1705 11.5293 15.8334 9.79975 15.8334 7.91667C15.8334 3.55145 12.2819 0 7.91669 0C3.55148 0 0 3.55145 0 7.91667C0 12.2819 3.55148 15.8333 7.91669 15.8333C9.79977 15.8333 11.5293 15.1704 12.8906 14.0686L18.5775 19.7555C18.7398 19.9179 18.9532 20 19.1666 20C19.38 20 19.5934 19.9179 19.7557 19.7555C20.0814 19.4298 20.0814 18.9032 19.7556 18.5775ZM7.91669 14.1667C4.47024 14.1667 1.66669 11.3631 1.66669 7.91667C1.66669 4.47021 4.47024 1.66667 7.91669 1.66667C11.3631 1.66667 14.1667 4.47021 14.1667 7.91667C14.1667 11.3631 11.3631 14.1667 7.91669 14.1667Z" fill="#99A6AC"/>
    </svg>
  );


  const services = [
    { title: 'Поликлиника', path: '/polyclinic' },
    { title: 'Лаборатория', path: '/laboratory' },
    { title: 'Хирургия', path: '/surgery' },
    { title: 'Диагностика', path: '/diagnostics' },
    { title: 'Госпитализация', path: '/dentistry' },
    { title: 'Вакцинация', path: '/dermatology' },
    { title: 'Гистология', path: '/ophthalmology' },
    { title: 'Рентген', path: '/cardiology' }
  ];

  return (
    <section className="services-clinic-section1">
      <div className="section-container1">
        <h2 className="section-title">Услуги клиники</h2>
        
  
        <div className="search-container1">
          <div className="search-input1">
            <div className="search-icon1">
              <SearchIcon />
            </div>
            <input 
              type="text" 
              placeholder="Поиск по услугам" 
              className="search-field1"
            />
          </div>
          <button className="search-button1">Найти</button>
        </div>
        

        <div className="services-grid1">
          {services.map((service, index) => (
            <div 
              key={index}
              className="service-card1"
              onClick={() => navigate(service.path)}
            >
              <div className="service-content1">
                <h3>{service.title}</h3>
              </div>
              <div className="service-arrow1">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.1" d="M20 39.5C9.23045 39.5 0.500001 30.7695 0.500002 20C0.500004 9.23045 9.23045 0.499997 20 0.499998C30.7696 0.5 39.5 9.23045 39.5 20C39.5 30.7696 30.7696 39.5 20 39.5Z" stroke="#363E3E"/>
                  <path d="M17 27L24 20L17 13" stroke="#363E3E"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSectionmain;