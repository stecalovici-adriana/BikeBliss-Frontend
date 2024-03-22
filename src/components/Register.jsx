import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState([]);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (name === "password") {
      checkPasswordStrength(value);
    }
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
    if (!formData.age) {
      errors.age = "Age is required";
    } else if (Number(formData.age) < 18) {
      errors.age = "You must be at least 18 years old";
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
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User registered:", data);
        alert("Registration successful!");
        // Redirect user or clear form here
        // ...
      } else {
        // Backend validation errors
        if (data.errors) {
          setFormErrors(data.errors);
        } else {
          // If there's a different kind of error that's not field-specific
          setFormErrors({
            form: data.message || "An unexpected error occurred.",
          });
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("An error occurred. Please try again later.");
    }
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
          {formErrors.fullName && (
            <div className="error-text">{formErrors.fullName}</div>
          )}
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
          {formErrors.email && (
            <div className="error-text">{formErrors.email}</div>
          )}
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
          {formErrors.username && (
            <div className="error-text">{formErrors.username}</div>
          )}
        </div>
        <div className="mb-3 position-relative">
          <div className="input-group">
            <i className="bi bi-calendar3 input-icon"></i>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          {formErrors.age && <div className="error-text">{formErrors.age}</div>}
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
          {formErrors.password && (
            <div className="error-text">{formErrors.password}</div>
          )}
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
          {formErrors.confirmPassword && (
            <div className="error-text">{formErrors.confirmPassword}</div>
          )}
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-signup">
            Sign Up
          </button>
        </div>
        <div className="signin-link text-center">
          Already have an account? <a href="/signin">Sign in</a>
        </div>
      </form>
    </div>
  );
}

export default Register;
