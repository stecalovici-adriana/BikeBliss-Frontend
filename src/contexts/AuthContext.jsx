// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      fetchUserDetails(token);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/details', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      localStorage.removeItem('jwtToken');
      setIsLoggedIn(false);
      setUserDetails(null);
    }
  };

  const login = (token) => {
    localStorage.setItem('jwtToken', token);
    fetchUserDetails(token);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userDetails, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
