// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token'); // Check if token exists
  };

  return isAuthenticated() ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
