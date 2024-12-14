
import React from 'react';

import Slider from './Slider';
import Navbar from './Header';
import AboutSection from '../Pages/About';
import ServiceSection from '../Pages/Services';
import WhyChooseUsSection from '../Pages/ChooseUs';

const HeroSection = () => {
  return (
    <div className="hero_area   ">

      <header className="header_section">
        <div className="container">
          <Navbar />
        </div>
      </header>


      <Slider />
      <AboutSection />
      <ServiceSection/>
      <WhyChooseUsSection/>
    </div>
  );
};

export default HeroSection;
