// Navbar.js
import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom_nav-container">
      <a className="navbar-brand" href="index.html">
        <img src="images/logo.png" alt="" />
        <span>Energym</span>
      </a>
      <div className="contact_nav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="service.html">
              <img src="images/location.png" alt="" />
              <span>Location</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="service.html">
              <img src="images/call.png" alt="" />
              <span>Call : + 01 1234567890</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="service.html">
              <img src="images/envelope.png" alt="" />
              <span>demo@gmail.com</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
