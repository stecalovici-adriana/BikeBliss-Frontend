import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  const verifyAndAuthenticateUser = useCallback(async (token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/verify-status?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.verified) {
        localStorage.setItem('jwtToken', data.token);
        setIsVerified(true);
        navigate('/home');
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      alert('Failed to verify. Please try again.');
    }
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      verifyAndAuthenticateUser(token);
    }
  }, [verifyAndAuthenticateUser]);

  const handleProceedClick = () => {
    if (isVerified) {
      navigate('/home');
    } else {
      alert('Please verify your email before proceeding.');
    }
  };

  return (
    <div className="verify-email-page">
      <h2>Account Confirmation</h2>
      <p>An email with your account confirmation link has been sent to your email.</p>
      <p>Check your email and click on the link to verify your account, then click 'Proceed'.</p>
      <button onClick={handleProceedClick} disabled={!isVerified}>Proceed</button>
    </div>
  );
};

export default VerifyEmailPage;
