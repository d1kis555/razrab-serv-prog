import React from 'react';
import '../styles/banner.css';
import bannerBg from '../assets/image/banner-bg.jpg';
const Banner = () => {
  return (
    <section className="promo-banner">
      <div className="banner-container" style={{ backgroundImage: `url(${bannerBg})` }}>
        <div className="banner-content">
          <div className="promo-tag">Акция</div>
          <h1 className="promo-title">На первое знакомство</h1>
          <p className="promo-discount">скидка 30%</p>
          <button className="promo-button">Записаться на приём</button>
        </div>
      </div>
      
      <div className="banner-nav">
        <button className="nav-arrow nav-prev">
          <span className="arrow-icon">←</span>
        </button>
        <button className="nav-arrow nav-next">
          <span className="arrow-icon">→</span>
        </button>
      </div>
    </section>
  );
};

export default Banner;