import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ResetPassword.css';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState([]);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(null);
  const [message, setMessage] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 60000); // 60000 ms = 1 minute

      return () => clearTimeout(timer); // Curăță timer-ul dacă componenta este demontată
    }
  }, [redirect, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));

    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
    if (name === 'confirmPassword') {
      setPasswordMismatch(value !== formData.newPassword);
    }
  };

  const checkPasswordStrength = (password) => {
    const requirements = [
      { regex: /[a-z]/, message: 'One lowercase character', valid: false },
      { regex: /[A-Z]/, message: 'One uppercase character', valid: false },
      { regex: /\d/, message: 'One number', valid: false },
      { regex: /[@$!%*?&]/, message: 'One special character', valid: false },
      { regex: /.{8,}/, message: '8 characters minimum', valid: false },
    ];

    const newStrength = requirements.map(req => ({
      ...req,
      valid: req.regex.test(password),
    }));

    setPasswordStrength(newStrength);
    setIsPasswordValid(newStrength.every(req => req.valid));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isPasswordValid || passwordMismatch) {
      setMessage('Please ensure the password meets all requirements and both passwords match.');
      return;
    }
  
    setMessage('');
    try {
      const requestBody = {
        newPassword: formData.newPassword,
      };
      const response = await fetch(`http://localhost:8080/api/auth/reset-password?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const responseData = await response.json().catch(() => {
          return {}; 
        });
        if (responseData.token) {
          localStorage.setItem('jwtToken', responseData.token);
          setMessage('Your password has been reset successfully. Please login with your new password.');
          setRedirect(true);
        } else {
          setMessage('Password has been reset successfully. Please login with your new password.');
          setRedirect(true);
        }
      } else {
        const errorResponse = await response.json().catch(() => {
          return { message: 'Failed to reset password. Please try again later.' }; 
        });
        setMessage(errorResponse.message || 'Failed to reset password. Please try again later.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('Network error, please try again later.');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-content">
      <div className="login-image">
        <img src="https://t4.ftcdn.net/jpg/08/21/27/13/360_F_821271356_MPOMplDDyGLnqsu0PRvthY60476IfRcK.jpg" alt="Login" />
      </div>
      <form onSubmit={handleSubmit} className="reset-password-form">
      <div className="fixed-gif"></div>
      <h2 className="text-center mb-4">Reset Password</h2>
        <div className="mb-3 position-relative">
          <div className="input-group">
            <i className="bi bi-lock-fill input-icon"></i>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          {isPasswordValid ? null : (
            <div className="password-requirements">
              {passwordStrength.map((req, index) => (
                <div key={index} className={`requirement ${req.valid ? 'valid' : 'invalid'}`}>
                  {req.valid ? <span className="valid-mark">✔</span> : <span className="invalid-mark">✖</span>}
                  {req.message}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-3 position-relative">
          <div className="input-group">
            <i className="bi bi-lock-fill input-icon"></i>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {passwordMismatch && (
            <div className="invalid-feedback" style={{ display: 'block' }}>
              Passwords do not match.
            </div>
          )}
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </div>
        {!passwordMismatch && message && (
        <div className="alert-message">{message}</div>
      )}
      </form>
      
    </div>
    </div>
  );
}

export default ResetPassword;
