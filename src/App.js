import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Sign_up/Register';
import VerifyEmailPage from './components/Sign_up/VerifyEmailPage';
import Login from './components/Sign_in/Login';
import MyAccount from './components/MyAccount';
import NavBar from './components/NavBar/NavBar';
import ForgotPassword from './components/Sign_in/ForgotPassword/ForgotPassword';
import ResetPassword from './components/Sign_in/ResetPassword/ResetPassword';
import BikesPage from './components/Bikes/BikesPage';
import BikeDetails from './components/Bikes/BikeDetails';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate replace to="/bikes-page" />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/bikes-page" element={<BikesPage />} />
        <Route path="/bikes/models/:modelId" element={<BikeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;