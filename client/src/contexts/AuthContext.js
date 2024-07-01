import React, { createContext, useState, useEffect, useContext } from 'react';
import { baseurl } from '../constant/urls';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null); 
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
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
          setUserName(data.user.name);
          if (data.loginMethod === 'google') {
            setUserImage(data.user.image); 
          } else if (data.loginMethod === 'local') {
            setUserImage(null); 
          }
        } else {
          setUserName(null);
          setUserImage(null); 
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setIsAuthenticated(false);
        setUserImage(null);
      } finally {
        setLoading(false); 
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true); 
      const response = await fetch(`${baseurl}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error('Failed to log out');

      setIsAuthenticated(false);
      setUserName(null);
      setUserImage(null); 
      setLogoutSuccess(true);
      setTimeout(() => setLogoutSuccess(false), 3000);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, userImage, setIsAuthenticated, handleLogout, logoutSuccess }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
