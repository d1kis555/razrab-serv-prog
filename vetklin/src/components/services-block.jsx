import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/services-block.css';


import onlineIcon from '../assets/image/online-consultation.png';
import checkupIcon from '../assets/image/checkup.png';
import procedureIcon from '../assets/image/procedure.png';
import vaccineIcon from '../assets/image/vaccine.png';

const ServicesBlock = () => {
  const navigate = useNavigate();

  const services = [
    { 
      title: 'Онлайн консультация', 
      path: '/online-consultation',
      icon: onlineIcon
    },
    { 
      title: 'Плановое обследование', 
      path: '/routine-checkup',
      icon: checkupIcon
    },
    { 
      title: 'Подготовка к процедурам', 
      path: '/procedure-preparation',
      icon: procedureIcon
    },
    { 
      title: 'Прививки', 
      path: '/vaccination',
      icon: vaccineIcon
    }
  ];


  const ArrowIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.1" d="M20 39.5C9.23045 39.5 0.500001 30.7695 0.500002 20C0.500004 9.23045 9.23045 0.499997 20 0.499998C30.7696 0.5 39.5 9.23045 39.5 20C39.5 30.7696 30.7696 39.5 20 39.5Z" stroke="#363E3E"/>
      <path d="M17 27L24 20L17 13" stroke="#363E3E"/>
    </svg>
  );

  return (
    <div className="services-container">
      {services.map((service, index) => (
        <div 
          key={index}
          className="service-card"
          onClick={() => navigate(service.path)}
        >
          
          <div className="service-icon">
            <img src={service.icon} alt="" />
          </div>
          
         
          <div className="service-title">
            {service.title}
          </div>
          
       
          <div className="service-arrow">
            <ArrowIcon />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesBlock;