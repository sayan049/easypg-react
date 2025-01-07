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
  // const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loginMethod,setLoginMethod] =useState(null);
  const [type,setType] = useState(null);
  

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
  
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
  
        // If tokens are not available, reset the state and return
        if (!accessToken || !refreshToken) {
          resetState();
          setLoading(false);
          return;
        }
  
        // Call the check-session endpoint with the access token
        let response = await fetch(`${baseurl}/auth/check-session`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
  console.log(accessToken,refreshToken)
        // If the access token is expired, try refreshing it
        if (response.status === 401) {
          const refreshResponse = await fetch(`${baseurl}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
  
          if (refreshResponse.ok) {
            const { accessToken: newAccessToken } = await refreshResponse.json();
            localStorage.setItem('accessToken', newAccessToken);
  
            // Retry the check-session call with the new access token
            response = await fetch(`${baseurl}/auth/check-session`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json',
              },
            });
          } else {
            // If refresh token is invalid, reset the state and return
            resetState();
            setLoading(false);
            return;
          }
        }
  
        if (!response.ok) throw new Error('Network response was not ok');
  
        const data = await response.json();
  
        // Update state based on authentication status and login method
        handleAuthState(data);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        resetState();
      } finally {
        setLoading(false);
      }
    };
  
    checkSession();
  }, []);
  
  // Helper function to reset the state
  const resetState = () => {
    setIsAuthenticated(false);
    setIsOwnerAuthenticated(false);
    setUserName(null);
    setUserImage(null);
    setOwnerName(null);
    setOwnerImage(null);
    setUser(null);
    setOwner(null);
    setLoginMethod(null);
    setType(null);
  };
  
  // Helper function to update state based on authentication data
  const handleAuthState = (data) => {
    if (data.isAuthenticated && data.loginMethod === 'google') {
      setIsAuthenticated(data.isAuthenticated && data.user.type === 'student');
      setIsOwnerAuthenticated(data.isAuthenticated && data.user.type === 'owner');
  
      if (data.isAuthenticated && data.user.type === 'student') {
        setUserName(data.user.name);
        setUserImage(data.user.image);
        setUser(data.user);
        setLoginMethod(data.loginMethod);
        setType(data.user.type);
      } else if (data.isAuthenticated && data.user.type === 'owner') {
        setOwnerName(data.user.name);
        setOwnerImage(data.user.image);
        setOwner(data.user);
        setLoginMethod(data.loginMethod);
        setType(data.user.type);
      }
    } else if (data.isAuthenticated && data.loginMethod === 'local') {
      setIsAuthenticated(data.isAuthenticated && data.user.type === 'student');
      setIsOwnerAuthenticated(data.isAuthenticated && data.user.type === 'owner');
  
      if (data.isAuthenticated && data.user.type === 'student') {
        setUserName(data.user.name);
        setUser(data.user);
        setLoginMethod(data.loginMethod);
        setType(data.user.type);
      } else if (data.isAuthenticated && data.user.type === 'owner') {
        setOwnerName(data.user.name);
        setOwner(data.user);
        setLoginMethod(data.loginMethod);
        setType(data.user.type);
      }
    } else {
      resetState();
    }
  };
  

  const handleLogout = async () => {
    try {
      // Check if the user is logged in by verifying the JWT token in localStorage
      const accessToken = localStorage.getItem("accessToken");
  
      if (!accessToken) {
        // If no access token is found, user is not logged in
        alert("You are not logged in.");
       
        return;
      }
  
      setLoading(true);
  
      // Send request to backend to verify if the access token is valid
      const response = await fetch(`${baseurl}/auth/logout`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // If the token is valid, clear the tokens from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
  
        // Reset user-related state
        setIsAuthenticated(false);
        setUser(null);
        setUserName(null);
        setUserImage(null);
        setLoginMethod(null);
        setType(null);
        setOwner(null);
        setOwnerName(null);
        setOwnerImage(null);
        setIsOwnerAuthenticated(false);
  
       
    
      } else {
        // If the token is invalid, show an error message
        alert("Your session has expired or is invalid. Please log in again.");
     
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred while logging out. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AuthContext.Provider value={{ IsAuthenticated, userName, userImage,user,owner,loginMethod,type, isOwnerAuthenticated, ownerName, ownerImage, setIsOwnerAuthenticated, setIsAuthenticated, handleLogout }}>
      {!loading? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
