import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");

        if (!accessToken || !refreshToken) {
          throw new Error("Authentication failed: Missing tokens.");
        }

        // Safely store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Confirm tokens are stored before navigating
        if (
          localStorage.getItem("accessToken") === accessToken &&
          localStorage.getItem("refreshToken") === refreshToken
        ) {
          navigate("/"); // Navigate to the home page
        } else {
          throw new Error("Failed to store authentication tokens.");
        }
      } catch (err) {
        console.error("Error during authentication callback:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <h1>Redirecting...</h1>
      ) : error ? (
        <div>
          <h1>Authentication Error</h1>
          <p>{error}</p>
          <button onClick={() => navigate("/ProviderSeeker")}>Go to Login</button>
        </div>
      ) : null}
    </div>
  );
}

export default GoogleCallbackPage;
