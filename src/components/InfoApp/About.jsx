import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import './About.css';

const About = () => {
  const [weather, setWeather] = useState(null);
  const [showContact, setShowContact] = useState(false); 
  const { isLoggedIn, userDetails } = useAuth();

  const fetchWeather = async () => {
    try {
      const response = await fetch(`https://wttr.in/Cluj-Napoca?format=%C+%t`);
      const data = await response.text();
      setWeather(data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  };

  useEffect(() => {
    document.title = "BikeBliss - Home";
    fetchWeather();
  }, []);

  return (
    <div className="about-container">
      <header className="header">
        <div className="title-and-filters">
          <Link to="/home" className="page-link">
            <h1 className="page-title">Home</h1>
          </Link>
          {isLoggedIn && userDetails?.userRole === 'ADMIN' && (
            <Link to="/admin/dashboard" className="page-link">
              <h1 className='page-title'>Owner Page</h1>
            </Link>
          )}
          <Link to="/bikes-page" className="page-link">
            <h1 className="page-title">Bike Models</h1>
          </Link>
        </div>
      </header>
      <div className="home-content">
        <div className="home-image">
          <img src="https://t4.ftcdn.net/jpg/08/21/27/13/360_F_821271356_MPOMplDDyGLnqsu0PRvthY60476IfRcK.jpg" alt="Login" />
          {weather && (
            <div className="weather-container">
              <p>Weather in Cluj-Napoca: {weather}</p>
            </div>
          )}
        </div>
        <div className="welcome-content">
        <div className="bike-gif"></div>
          <h1 className="welcome-title">Welcome to BikeBliss</h1>
          <p className="welcome-subtitle">
            We offer high-quality bikes and equipment rentals in Cluj-Napoca.
          </p>
          <p className="welcome-description">
            Bicycles can be reserved at least 6 hours prior to the rental time, ensuring convenience and flexibility. Pick-up service is available from our locations in Cluj-Napoca.
          </p>
          <p className="welcome-description">
            Discounts are offered for renting more than 3 bicycles.
          </p>
          <button className="contact-button" onClick={() => setShowContact(!showContact)}><i className="bi bi-person-rolodex"></i>  Contact Us</button>
          {showContact && (
            <div className="about-content">
              <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
              <p><i className="bi bi-envelope"></i> : <a href="mailto:bikebliss10@gmail.com">bikebliss10@gmail.com</a></p>
              <p><i className="bi bi-telephone"></i> : +40 747 890 810</p>
            </div>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>© 2023 BikeBliss. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
