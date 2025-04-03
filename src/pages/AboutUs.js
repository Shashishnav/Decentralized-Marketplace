import React from 'react';
import Header from './common/Header'; // Updated import path
import './AboutUs.css';

const AboutUs = () => {
  return (
    <>
      <Header /> 
      <div className="about">
        <div className="about-text">
          <h1>About Us</h1>
          <p>Meet the team behind this project:</p>
          <div className="about-category">
            <span>Backend Developer</span>
            <p>
              <strong>Karthik Kuppili</strong> {' '}
              <a href="mailto:karthikkuppili.offl@gmail.com">karthikkuppili.offl@gmail.com</a>
              <br />
              Phone: 9100388576
            </p>
          </div>
          <div className="about-category">
            <span>Web3 Developer</span>
            <p>
              <strong>Puneeth Narra</strong> {' '}
              <a href="mailto:narrapuneeth44@gmail.com">narrapuneeth44@gmail.com</a>
              <br />
              Phone: 9652585354
            </p>
          </div>
          <div className="about-category">
            <span>Frontend Developer</span>
            <p>
              <strong>Thirush Reddy Chada</strong> {' '}
              <a href="mailto:thirushreddychada@gmail.com">thirushreddychada@gmail.com</a>
              <br />
              Phone: 7815962448
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
