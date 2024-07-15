// src/components/ProtectedRoute.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { IsAuthenticated,isOwnerAuthenticated} = useAuth();
  console.log(IsAuthenticated)
  const navigate = useNavigate();

  useEffect(() => {
    if (IsAuthenticated || isOwnerAuthenticated ) {
      navigate('/'); // Redirect to another page, e.g., home page
    }
   
  }, [IsAuthenticated,isOwnerAuthenticated, navigate]);
 
  return <div>{children}</div>;
};

export default ProtectedRoute;
 