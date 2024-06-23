import React, { createContext, useState, useEffect, useContext } from 'react';
import { baseurl } from '../constant/urls';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null); 
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`${baseurl}/auth/check-session`, {
          method: 'GET',
          credentials: 'include',
          withCredentials: true,
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log(data);
        setIsAuthenticated(data.isAuthenticated);
        if (data.isAuthenticated) {
          setUserName(data.user.name); // Correctly accessing the user ID from the response
        } else {
          setUserName(null); // Clear user ID if not authenticated
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch(`${baseurl}/auth/logout`, {
        method: 'GET', // Assuming your logout endpoint expects a POST request
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error('Failed to log out');

      
      setIsAuthenticated(false);
      setUserName(null);
      setLogoutSuccess(true);
      setTimeout(() => setLogoutSuccess(false), 3000);
     
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, setIsAuthenticated, handleLogout,logoutSuccess }}>
      {!loading? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
