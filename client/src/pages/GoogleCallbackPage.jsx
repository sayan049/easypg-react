import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Redirect to the homepage or user dashboard
      navigate('/');
    }
  }, [navigate]); // Ensure that this effect only runs once when the component mounts

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}

export default GoogleCallbackPage;
