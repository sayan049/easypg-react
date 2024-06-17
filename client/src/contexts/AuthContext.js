import React, { createContext, useState, useEffect, useContext } from 'react';
import { baseurl } from '../constant/urls';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`${baseurl}/auth/check-session`, {
          method: 'GET',
          credentials: 'include',
          withCredentials:true
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log(data)
        setIsAuthenticated(data.isAuthenticated );
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setIsAuthenticated(false);
      } finally {
        // if(data.isAuthenticated === false)
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {!loading? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
