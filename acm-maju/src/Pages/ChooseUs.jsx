// WhyChooseUsSection.js
import React from 'react';

const reasons = [
  {
    img: "src/assets/images/u-1.png",
    title: "QUALITY EQUIPMENT",
    description: "ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
  },
  {
    img: "src/assets/images/u-2.png",
    title: "HEALTHY NUTRITION PLAN",
    description: "ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
  },
  {
    img: "src/assets/images/u-3.png",
    title: "SHOWER SERVICE",
    description: "ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
  },
  {
    img: "src/assets/images/u-4.png",
    title: "UNIQUE TO YOUR NEEDS",
    description: "ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="us_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Why Choose Us</h2>
        </div>
        <div className="us_container">
          {reasons.map((reason, index) => (
            <div key={index} className="box">
              <div className="img-box">
                <img src={reason.img} alt={reason.title} />
              </div>
              <div className="detail-box">
                <h5>{reason.title}</h5>
                <p>{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
