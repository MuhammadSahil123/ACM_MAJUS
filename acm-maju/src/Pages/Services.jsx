// ServiceSection.js
import React from 'react';

const services = [
  { img: "src/assets/images/s-1.jpg", title: "CROSSFIT TRAINING" },
  { img: "src/assets/images/s-2.jpg", title: "FITNESS" },
  { img: "src/assets/images/s-3.jpg", title: "DYNAMIC STRENGTH TRAINING" },
  { img: "src/assets/images/s-4.jpg", title: "HEALTH" },
  { img: "src/assets/images/s-5.jpg", title: "WORKOUT" },
  { img: "src/assets/images/s-6.jpg", title: "STRATEGIES" }
];

const ServiceSection = () => {
  return (
    <section className="service_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Our Services</h2>
        </div>
        <div className="service_container">
          {services.map((service, index) => (
            <div key={index} className="box">
              <img src={service.img} alt={service.title} />
              <h6 className="visible_heading">{service.title}</h6>
              <div className="link_box">
                <a href="">
                  <img src="src/assets/images/link.png" alt="Link" />
                </a>
                <h6>{service.title}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
