import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setVerificationStatus('No token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/verify?token=${token}`);
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token); 
          setVerificationStatus('Email verified successfully. You will be redirected shortly.');
          setTimeout(() => navigate('/dashboard'), 3000); 
        } else {
          setVerificationStatus('Email verification failed. Please try again or contact support.');
        }
      } catch (error) {
        setVerificationStatus(`An error occurred: ${error.message}`);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div>
      {verificationStatus ? <p>{verificationStatus}</p> : <p>Verifying email...</p>}
    </div>
  );
};

export default VerifyEmail;
