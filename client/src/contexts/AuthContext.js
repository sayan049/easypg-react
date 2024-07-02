import React, { createContext, useState, useEffect, useContext } from 'react';
import { baseurl } from '../constant/urls';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);
  const [ownerName, setOwnerName] = useState(null);
  const [ownerImage, setOwnerImage] = useState(null);
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
        console.log(data)
        setIsAuthenticated(data.isAuthenticated && data.user.type === 'student');
        setIsOwnerAuthenticated(data.isAuthenticated && data.user.type === 'owner');
       
       

        if (data.isAuthenticated && data.user.type === 'student') {
          setUserName(data.user.userSession.name);
          setUserImage(data.user.userSession.image);
          
        } else if (data.isAuthenticated && data.user.type === 'owner' ) {
          setOwnerName(data.user.ownerSession.name);
         
          setOwnerImage(data.user.ownerSession.image);
          console.log(data.user.ownerSession.image)
        } else {
          setUserName(null);
          setUserImage(null);
          setOwnerName(null);
          setOwnerImage(null);
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setIsAuthenticated(false);
        setUserImage(null);
        setIsOwnerAuthenticated(false);
        setOwnerImage(null);
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
      setIsOwnerAuthenticated(false);
      setUserName(null);
      setUserImage(null);
      setOwnerName(null);
      setOwnerImage(null);
      setLogoutSuccess(true);
      setTimeout(() => setLogoutSuccess(false), 3000);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ IsAuthenticated, userName, userImage, isOwnerAuthenticated, ownerName, ownerImage, setIsOwnerAuthenticated, setIsAuthenticated, handleLogout, logoutSuccess }}>
      {!loading? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
