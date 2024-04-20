import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyEmail = async (token) => {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/verify?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        const data = await response.json();
        console.log('Response from verification:', data);

        if (response.ok && data.verified) {
          localStorage.setItem('jwtToken', data.token);
          navigate('/my-account');
        } else {
          alert(data.message || 'Verification failed. Please try again.');
          navigate('/signup');
        }
      } catch (error) {
        console.error('Error during email verification:', error);
        alert(error.message || 'Network error, please try again later.');
        navigate('/signup');
      }
    };

    const tokenFromURL = searchParams.get('token');
    console.log('Token from URL:', tokenFromURL);

    if (tokenFromURL) {
      verifyEmail(tokenFromURL);
    } else {
      alert('Token not provided or invalid.');
      navigate('/signup');
    }
  }, [navigate, searchParams]);

  return (
    <div className="verify-email-page">
      <h2>Verifying your email...</h2>
      {/* You can add a spinner or any loading indicator here */}
    </div>
  );
}

export default VerifyEmailPage;