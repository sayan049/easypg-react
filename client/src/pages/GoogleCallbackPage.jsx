import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTokenReady, setIsTokenReady] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");

        if (!accessToken || !refreshToken) {
          throw new Error("Authentication failed: Missing tokens.");
        }

        // Store tokens in sessionStorage and localStorage
        // sessionStorage.setItem("accessToken", accessToken);
        // sessionStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Set a flag indicating tokens are ready
        setIsTokenReady(true);
      } catch (err) {
        console.error("Error during authentication callback:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  useEffect(() => {
    // Perform redirection only after the tokens are ready
    if (isTokenReady) {
      setTimeout(() => {
        navigate("/");
      }, 100); // Short delay to ensure state updates
    }
  }, [isTokenReady, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <h1>Redirecting...</h1>
      ) : error ? (
        <div>
          <h1>Authentication Error</h1>
          <p>{error}</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      ) : null}
    </div>
  );
}

export default GoogleCallbackPage;
