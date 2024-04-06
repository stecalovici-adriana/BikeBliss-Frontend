import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState([]);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(true);
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split('T')[0];

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      username: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
    });
    // Poți de asemenea să resetezi și alte stări dacă este necesar
    setFormErrors({});
    setPasswordStrength([]);
    setShowPasswordRequirements(true);
  };

  useEffect(() => {
    // Această funcție este apelată când valoarea JWT din localStorage se schimbă
    const handleStorageChange = (e) => {
      if (e.key === 'jwtToken' && e.newValue) {
        resetForm();
        navigate('/my-account');
      }
    };

    // Adăugați event listener pentru schimbările de localStorage
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function pentru a elimina event listener-ul
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (name === "password") {
      checkPasswordStrength(value);
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const checkPasswordStrength = (password) => {
    const requirements = [
      { regex: /[a-z]/, message: "One lowercase character", valid: false },
      { regex: /[A-Z]/, message: "One uppercase character", valid: false },
      { regex: /\d/, message: "One number", valid: false },
      { regex: /[@$!%*?&]/, message: "One special character", valid: false },
      { regex: /.{8,}/, message: "8 characters minimum", valid: false },
    ];

    const updatedRequirements = requirements.map((req) => ({
      ...req,
      valid: req.regex.test(password),
    }));

    setPasswordStrength(updatedRequirements);

    const allValid = updatedRequirements.every((req) => req.valid);
    setShowPasswordRequirements(!allValid);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!formData.birthDate) { 
      errors.birthDate = "Birth date is required"; 
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else {
      if (!/[a-z]/.test(formData.password)) {
        errors.password =
          "Password must contain at least one lowercase character";
      }
      if (!/[A-Z]/.test(formData.password)) {
        errors.password =
          "Password must contain at least one uppercase character";
      }
      if (!/\d/.test(formData.password)) {
        errors.password = "Password must contain at least one number";
      }
      if (!/[@$!%*?&]/.test(formData.password)) {
        errors.password =
          "Password must contain at least one special character";
      }
      if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      }
    }
    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log('Răspuns de la server:', data);
      
      if (response.ok) {
        alert(data.message || 'Registration successful! Please check your email to verify your account.');
        navigate('/my-account');
      } else {
        setFormErrors({ ...formErrors, ...data.errors });
      }
    } catch (error) {
      console.error("Error during registration: ", error);
      setFormErrors({ ...formErrors, form: "Network error, please try again later." });
    }
  };

  const handleSignInClick = () => {
    navigate('/login'); 
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="text-center mb-4">Sign Up</h2>
        <div className="mb-3 position-relative">
          <div className="input-group">
            <i className="bi bi-person-fill input-icon"></i>
            <input
              type="text"
              className="form-control"
              id="fullName"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            {formErrors.fullName && ( <div className="error-text">{formErrors.fullName}</div>)}
          </div>
        </div>
        <div className="mb-3 position-relative">
          <div className="input-group">
              <i className="bi bi-envelope-fill input-icon"></i>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
          </div>
          <div>
            {formErrors.email && <div className="error-text">{formErrors.email}</div>}
          </div>
        </div>
        <div className="mb-3 position-relative">
          <div className="input-group">
            <i className="bi bi-person-badge-fill input-icon"></i>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
          {formErrors.username && (
            <div className="error-text">{formErrors.username}</div>
          )}
          </div>
        </div>
        <div className="mb-3 position-relative">
          <div className="input-group">
            <i className="bi bi-calendar3 input-icon"></i>
            <input
              type="date" 
              className="form-control"
              id="birthDate" 
              name="birthDate" 
              placeholder="Birth Date"
              value={formData.birthDate} 
              onChange={handleChange}
              max={currentDate}
              required
            />
          </div>
          <div>
          {formErrors.birthDate && <div className="error-text">{formErrors.birthDate}</div>}
          </div>
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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
          {formErrors.password && (
            <div className="error-text">{formErrors.password}</div>
          )}
          </div>
          {showPasswordRequirements && (
            <div className="password-requirements">
              {passwordStrength.map((req, index) => (
                <div
                  key={index}
                  className={`requirement ${req.valid ? "valid" : "invalid"}`}
                >
                  {req.valid ? (
                    <span className="valid-mark">✔</span>
                  ) : (
                    <span className="invalid-mark">✖</span>
                  )}
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
          <div>
            {formErrors.confirmPassword && (<div className="error-text">{formErrors.confirmPassword}</div>)}
          </div>
        </div>
        {formErrors.form && (
          <div className="error-text">{formErrors.form}</div>
        )}

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-signup">
            Sign Up
          </button>
        </div>
        <div className="signin-link text-center">
          Already have an account? <button onClick={handleSignInClick} className="btn-link">Sign in</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
