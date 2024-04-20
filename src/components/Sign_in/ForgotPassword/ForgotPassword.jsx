import React, { useState } from 'react';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    };

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', requestOptions);
      if (response.ok) {
        setMessage('If an account with that email exists, we have sent a link to reset your password.');
      } else {
        setMessage('There was a problem. Please try again later.');
      }
    } catch (error) {
      setMessage('There was a problem. Please try again later.');
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2 className="text-center mb-4">Forgot Password</h2>
        <div className="mb-3 position-relative">
          <div className="input-group">
          <span className="input-icon">
            <i className="bi bi-envelope-fill"></i>
          </span>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            {formErrors.email && <div className="error-text">{formErrors.email}</div>}
          </div>
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Send Reset Link
          </button>
        </div>
        {message && <div className="text-center mt-3">{message}</div>}
      </form>
    </div>
  );
}

export default ForgotPassword;