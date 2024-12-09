// src/components/DashboardRoute.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const IsAuth = ({ children }) => {
  const { IsAuthenticated, isOwnerAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!IsAuthenticated && !isOwnerAuthenticated) {
      navigate('/ProviderSeeker'); // Redirect to login if not authenticated
    }
  }, [IsAuthenticated, isOwnerAuthenticated, navigate]);

  if (!IsAuthenticated && !isOwnerAuthenticated) {
    return null; // Don't render children if not authenticated
  }

  return <div>{children}</div>;
};

export default IsAuth;
