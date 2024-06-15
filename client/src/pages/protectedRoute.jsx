import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'


function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 

  useEffect(() => {
    const token = Cookies.get('user_token'); 
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const decodedToken = JSON.parse(jsonPayload);
        const userId = decodedToken.id;
        const userEmail = decodedToken.email;
        const name =  decodedToken.name;
        console.log(userId + " from protced route");
        console.log(userEmail + " from protced route");
        console.log(name+" from protected route");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        // navigate('/login');
      }
    } else {
      console.error("Token is not present in cookies");
      // navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return <div>{children}</div>;
}

export default ProtectedRoute;
