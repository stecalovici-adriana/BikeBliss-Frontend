import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Sign_up/Register';
import VerifyEmailPage from './components/Sign_up/VerifyEmailPage';
import Home from './components/Home';
import Login from './components/Sign_in/Login';
import MyAccount from './components/MyAccount';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/signup" />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/my-account" element={<MyAccount />} />
      </Routes>
    </Router>
  );
}

export default App;