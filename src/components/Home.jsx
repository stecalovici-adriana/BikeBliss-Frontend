import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    navigate('/signin');
    return null;
  }

  //delogare
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/signin'); 
  };

  return (
    <div>
      <p>You are now authenticated.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
