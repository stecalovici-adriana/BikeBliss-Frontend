import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const { login } = useAuth(); 
  const [loginErrors, setLoginErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!credentials.username.trim()) {
      errors.username = "Username is required";
    }
    if (!credentials.password) {
      errors.password = "Password is required";
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('jwtToken', data.token); 
        login(data.token);
        navigate('/bikes-page'); 
      } else {
        setLoginErrors({ form: data.message || "Login failed, please try again." });
      }
    } catch (error) {
      setLoginErrors({ form: error.message || "Network error, please try again later." });
    }
  };
  
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="text-center mb-4">Sign in</h2>
                <div className="mb-3 position-relative">
          <div className="input-group">
            <i className="bi bi-person-badge-fill input-icon"></i>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          {loginErrors.username && (
            <div className="error-text">{loginErrors.username}</div>
          )}
        </div>
        <div className="mb-3 position-relative">
          <div className="input-group">
            <i className="bi bi-lock-fill input-icon"></i>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            </div>
          {loginErrors.password && (
            <div className="error-text">{loginErrors.password}</div>
          )}
        </div>
        {loginErrors.form && (
          <div className="error-text">{loginErrors.form}</div>
        )}
        <div className="forgot-password-link text-center">
          <Link to="/forgot-password" className="link-forgot-password">Forgot password?</Link>
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </div>
        <div className="login-footer">
        <div className="signup-link text-center">
          Don't have an account? <Link to="/signup" className="link-signup">Sign up</Link>
        </div>
      </div>
      </form>
    </div>
  );
}

export default Login;
