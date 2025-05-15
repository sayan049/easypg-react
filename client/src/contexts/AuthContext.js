import React, { createContext, useState, useEffect, useContext } from "react";
import { baseurl } from "../constant/urls";
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <div className="spinner"></div>
    <style>{`
      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(0, 0, 0, 0.1);
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

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
  const [loginMethod, setLoginMethod] = useState(null);
  const [type, setType] = useState(null);
  const [currentaccessToken, setCurrentAccessToken] = useState(null);

  useEffect(()=>{
      console.log("axy",currentaccessToken);
  },[currentaccessToken]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);

        // const accessToken = localStorage.getItem("accessToken");
        // const refreshToken = localStorage.getItem("refreshToken");
        // No access token in memory initially
        const accessToken =currentaccessToken ;
        const refreshToken = getCookie("refreshToken");
        console.log(accessToken,refreshToken);

        const deviceInfo = navigator.userAgent || "Unknown Device";

        // If tokens are not available, reset the state and return
        if (!accessToken || !refreshToken) {
          resetState();
          setLoading(false);
          return;
        }

        // Call the check-session endpoint with the access token
        let response = await fetch(`${baseurl}/auth/check-session`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        // If the access token is expired, try refreshing it
        if (response.status === 401) {
          const refreshResponse = await fetch(`${baseurl}/auth/refresh-token`, {
            method: "POST",
            // headers: { "Content-Type": "application/json", "X-Device-Info": deviceInfo, },
            headers: { "X-Device-Info": deviceInfo },
            credentials: "include", // ✅ Important for cookies
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { accessToken: newAccessToken } =
              await refreshResponse.json();
            localStorage.setItem("accessToken", newAccessToken);

            // Retry the check-session call with the new access token
            response = await fetch(`${baseurl}/auth/check-session`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
                "Content-Type": "application/json",
              },
            });
          } else {
            // If refresh token is invalid, reset the state and return
            resetState();
            setLoading(false);
            return;
          }
        }

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        // Update state based on authentication status and login method
        handleAuthState(data);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
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
    setCurrentAccessToken(null);
  };

  const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

  // Helper function to update state based on authentication data
  const handleAuthState = (data) => {
    if (data.isAuthenticated && data.loginMethod === "google") {
      setIsAuthenticated(data.isAuthenticated && data.user.type === "student");
      setIsOwnerAuthenticated(
        data.isAuthenticated && data.user.type === "owner"
      );

      if (data.isAuthenticated && data.user.type === "student") {
        setUserName(data.user.name);
        setUserImage(data.user.image);
        setUser(data.user);
        setLoginMethod(data.loginMethod);
        setType(data.user.type);
      } else if (data.isAuthenticated && data.user.type === "owner") {
        setOwnerName(data.user.name);
        setOwnerImage(data.user.image);
        setOwner(data.user);
        setLoginMethod(data.loginMethod);
        setType(data.user.type);
      }
    } else if (data.isAuthenticated && data.loginMethod === "local") {
      setIsAuthenticated(data.isAuthenticated && data.user.type === "student");
      setIsOwnerAuthenticated(
        data.isAuthenticated && data.user.type === "owner"
      );

      if (data.isAuthenticated && data.user.type === "student") {
        setUserName(data.user.name);
        setUser(data.user);
        setLoginMethod(data.loginMethod);
        setType(data.user.type);
      } else if (data.isAuthenticated && data.user.type === "owner") {
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
    setLoading(true); // Start the loading indicator

    try {
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const deviceInfo = navigator.userAgent || "Unknown Device";

      if (!refreshToken) {
        alert("No refresh token found. Please log in again.");
        setLoading(false);
        return;
      }

      if (!accessToken) {
        console.log("Access token not found. Trying to refresh...");
      }

      // Check session using the access token
      const sessionResponse = await fetch(`${baseurl}/auth/check-session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (sessionResponse.status === 401 || !accessToken) {
        console.log("Access token expired. Refreshing...");
        // Refresh the access token if it's expired
        const refreshResponse = await fetch(`${baseurl}/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Device-Info": deviceInfo,
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const { accessToken: newAccessToken } = await refreshResponse.json();
          localStorage.setItem("accessToken", newAccessToken);
          accessToken = newAccessToken; // Use the new access token for logout
          console.log("Access token refreshed successfully.");
        } else {
          console.error("Failed to refresh access token.");
          alert("Session expired. Please log in again.");
          setLoading(false);
          return;
        }
      }

      // Perform logout
      const logoutResponse = await fetch(`${baseurl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the updated or refreshed token
          "Content-Type": "application/json",
          "X-Device-Info": deviceInfo,
        },
        body: JSON.stringify({ refreshToken }),
      });

      const logoutData = await logoutResponse.json();

      if (logoutResponse.ok) {
        // Clear tokens and reset state on successful logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

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

        console.log(logoutData.message); // Optional: Log the server response
      } else {
        console.error("Logout error:", logoutData.message);
        alert("Your session has expired or is invalid. Please log in again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out. Please try again.");
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <AuthContext.Provider
      value={{
        IsAuthenticated,
        userName,
        userImage,
        user,
        owner,
        loginMethod,
        type,
        isOwnerAuthenticated,
        ownerName,
        ownerImage,
        setIsOwnerAuthenticated,
        setIsAuthenticated,
        handleLogout,
        setCurrentAccessToken,
        currentaccessToken
      }}
    >
      {!loading ? children : <LoadingSpinner />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
