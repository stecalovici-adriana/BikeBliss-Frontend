import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './NavBar.css';

function NavBar() {
  const { isLoggedIn, userDetails, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleAccountClick = () => {
    navigate('/my-account');
  };

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return '';
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">BikeBliss</a>
        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <div className="account-icon-container">
              <button className="btn btn-link account-icon" onClick={handleAccountClick}>
                <div className="user-avatar">
                  {getInitials(userDetails.firstName, userDetails.lastName)}
                </div>
              </button>
              <div className="dropdown-menu">
                <button onClick={handleAccountClick}>My Account</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-link sign-in-icon" onClick={handleSignInClick}>
              <i className="bi bi-person"></i> Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
