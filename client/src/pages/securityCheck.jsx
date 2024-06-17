import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const SecurityCheck = () => {
  const { isAuthenticated } = useAuth();

  // Conditionally render content based on authentication status
  if (isAuthenticated) {
    return (
      <div>
        ALL SET FOR AUTHENTICATED USERS
      </div>
    );
  } else {
    return (
      <div>
        ALL SET FOR UNAUTHENTICATED USERS
      </div>
    );
  }
};

export default SecurityCheck;
