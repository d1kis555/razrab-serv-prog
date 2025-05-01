import React from 'react';
import Banner from '../components/banner';
import ServicesBlock from '../components/services-block';
import SpecialistsSection from '../components/specialists-section'; 
import ServicesSectionmain from '../components/services-section-2';
import Contacts from '../components/contacts';


const HomePage = () => {
  return (
    <div className="home-page">
      <Banner />
      <ServicesBlock />
      <SpecialistsSection /> 
      <ServicesSectionmain />
      <Contacts />
    </div>
  );
};

export default HomePage;