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
        if (!accessToken || !refreshToken) {
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
          setLoading(false);
          return;
        }
        const response = await fetch(`${baseurl}/auth/check-session`, {
          method: 'GET',
          credentials: 'include',
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Attach access token in the Authorization header
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log(data)
        if(data.isAuthenticated && data.loginMethod === 'google'){
          setIsAuthenticated(data.isAuthenticated && data.user.type === 'student');
        setIsOwnerAuthenticated(data.isAuthenticated && data.user.type === 'owner');
       
       

        if (data.isAuthenticated && data.user.type === 'student') {
          setUserName(data.user.userSession.name);
          setUserImage(data.user.userSession.image);
          setUser(data.user.userSession)
          setLoginMethod(data.loginMethod)
          setType(data.user.type)
        } else if (data.isAuthenticated && data.user.type === 'owner' ) {
          setOwnerName(data.user.ownerSession.name);
         
          setOwnerImage(data.user.ownerSession.image);
          setOwner(data.user.ownerSession)
          setLoginMethod(data.loginMethod)
          setType(data.user.type)
        }}else if(data.isAuthenticated && data.loginMethod === 'local'){
          setIsAuthenticated(data.isAuthenticated && data.user.type === 'student');
          setIsOwnerAuthenticated(data.isAuthenticated && data.user.type === 'owner');
         
         
  
          if (data.isAuthenticated && data.user.type === 'student') {
            setUserName(data.user.name);
            setUser(data.user)
            setLoginMethod(data.loginMethod)
            setType(data.user.type)
          } else if (data.isAuthenticated && data.user.type === 'owner' ) {
            setOwnerName(data.user.name);
            setOwner(data.user)
            setLoginMethod(data.loginMethod)
            setType(data.user.type)
           
          }
        }
         else {
          setUserName(null);
          setUserImage(null);
          setOwnerName(null);
          setOwnerImage(null);
          setUser(null);
          setOwner(null);
          setLoginMethod(null);
          setType(null)
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setIsAuthenticated(false);
        setUserImage(null);
        setIsOwnerAuthenticated(false);
        setOwnerImage(null);
        setUser(null);
        setOwner(null);
        setLoginMethod(null);
        setType(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

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
