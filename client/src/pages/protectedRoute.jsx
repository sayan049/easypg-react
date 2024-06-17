// src/components/ProtectedRoute.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated ) {
      navigate('/'); // Redirect to another page, e.g., home page
    }
  }, [isAuthenticated, navigate]);

  return <div>{children}</div>;
};

export default ProtectedRoute;
