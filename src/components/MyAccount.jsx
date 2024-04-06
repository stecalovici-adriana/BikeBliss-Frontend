import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyAccount() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetch('http://localhost:8080/api/users/details', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => setUserDetails(data))
    .catch((error) => {
      console.error('Fetching user details failed:', error);
      navigate('/login');
    });
  }, [navigate]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-account-container">
      <h1>My Account</h1>
      <p><strong>Full Name:</strong> {userDetails.fullName}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      <p><strong>Username:</strong> {userDetails.username}</p>
      <p><strong>Birth Date:</strong> {userDetails.birthDate}</p>
      {/* ...alte detalii ale contului... */}
    </div>
  );
}

export default MyAccount;
