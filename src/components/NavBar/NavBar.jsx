import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css'; 

function NavBar() {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">BikeBliss</a>
        <div className="d-flex align-items-center">
        <button className="btn btn-link sign-in-icon" onClick={handleSignInClick}>
          <i className="bi bi-person"></i>
        </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
