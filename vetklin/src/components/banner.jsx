import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/banner.css';


import banner1 from '../assets/image/banner-bg.jpg';
import banner2 from '../assets/image/banner-bg2.jpg';



const NextArrow = ({ onClick }) => (
  <div className="slick-arrow next-arrow" onClick={onClick}>
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="29.5" fill="white" stroke="#363E3E" strokeOpacity="0.1"/>
      <path d="M25 40L35 30L25 20" stroke="#363E3E" strokeWidth="2"/>
    </svg>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="slick-arrow prev-arrow" onClick={onClick}>
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="29.5" fill="white" stroke="#363E3E" strokeOpacity="0.1"/>
      <path d="M35 40L25 30L35 20" stroke="#363E3E" strokeWidth="2"/>
    </svg>
  </div>
);

const Banner = () => {
  const banners = [
    {
      id: 1,
      image: banner1,
      tag: "Акция",
      title: "На первое знакомство",
      discount: "скидка 30%",
      buttonText: "Записаться на приём"
    },
    {
      id: 2,
      image: banner2,
      tag: "Новинка",
      title: "Комплексное обследование",
      discount: "со скидкой 25%",
      buttonText: "Узнать подробности"
    },

  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div className="banner-dots-container">
        <ul>{dots}</ul>
      </div>
    )
  };

  return (
    <section className="promo-banner">
      <Slider {...settings}>
        {banners.map(banner => (
          <div key={banner.id} className="banner-slide">
            <div 
              className="banner-container" 
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="banner-content">
                <div className="promo-tag">{banner.tag}</div>
                <h1 className="promo-title">{banner.title}</h1>
                <p className="promo-discount">{banner.discount}</p>
                <button className="promo-button">{banner.buttonText}</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Banner;