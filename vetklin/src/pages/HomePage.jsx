import React from 'react';
import Banner from '../components/banner';
import ServicesBlock from '../components/services-block';

const HomePage = () => {
  return (
    <div className="home-page">
      <Banner />
      <ServicesBlock />
    </div>
  );
};

export default HomePage;