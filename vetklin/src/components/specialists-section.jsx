import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/specialists-section.css';


import specialist1 from '../assets/image/specialist/specialist1.png';
import specialist2 from '../assets/image/specialist/specialist2.png';
import specialist3 from '../assets/image/specialist/specialist3.png';
import specialist4 from '../assets/image/specialist/specialist4.png';
import specialist5 from '../assets/image/specialist/specialist5.png';

const specialists = [
  {
    id: 1,
    name: 'Иванова Анна Петровна',
    experience: 8,
    photo: specialist1
  },
  {
    id: 2,
    name: 'Смирнов Дмитрий Игоревич',
    experience: 12,
    photo: specialist2
  },
  {
    id: 3,
    name: 'Кузнецова Елена Владимировна',
    experience: 5,
    photo: specialist3
  },
  {
    id: 4,
    name: 'Петров Алексей Сергеевич',
    experience: 15,
    photo: specialist4
  },
  {
    id: 5,
    name: 'Васильева Ольга Михайловна',
    experience: 10,
    photo: specialist5
  }
];

const ArrowIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.1" d="M20 39.5C9.23045 39.5 0.500001 30.7695 0.500002 20C0.500004 9.23045 9.23045 0.499997 20 0.499998C30.7696 0.5 39.5 9.23045 39.5 20C39.5 30.7696 30.7696 39.5 20 39.5Z" stroke="#363E3E"/>
    <path d="M17 27L24 20L17 13" stroke="#363E3E"/>
  </svg>
);
const NextArrow = ({ onClick }) => (
    <div className="slick-arrow next-arrow" onClick={onClick}>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="29.5" fill="white" stroke="#363E3E" stroke-opacity="0.1"/>
        <path d="M25 40L35 30L25 20" stroke="#363E3E" stroke-width="2"/>
      </svg>
    </div>
  );
  
  const PrevArrow = ({ onClick }) => (
    <div className="slick-arrow prev-arrow" onClick={onClick}>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="29.5" fill="white" stroke="#363E3E" stroke-opacity="0.1"/>
        <path d="M35 40L25 30L35 20" stroke="#363E3E" stroke-width="2"/>
      </svg>
    </div>
  );
const SpecialistsSection = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section className="specialists-section">
      <div className="section-container">
        <h2 className="section-title">Ваши питомцы в надежных руках</h2>
        
        <div className="slider-container">
          <Slider {...settings}>
            {specialists.map(specialist => (
              <div key={specialist.id} className="card-wrapper">
                <div 
                  className="specialist-card"
                  onClick={() => navigate(`/specialist/${specialist.id}`)}
                >
                  <div className="photo-container">
                    <img 
                      src={specialist.photo} 
                      alt={specialist.name}
                      onError={(e) => {
                        e.target.src = '/images/default-photo.jpg'; // Фолбек изображение
                      }}
                    />
                  </div>
                  <div className="info-container">
                    <h3 className="name">{specialist.name}</h3>
                    <p className="experience-label">Стаж</p>
                    <p className="experience-value">{specialist.experience} лет</p>
                  </div>
                  <div className="arrow-icon">
                    <ArrowIcon />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default SpecialistsSection;