// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function GoogleCallbackPage() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [tokensSet, setTokensSet] = useState(false);

//   useEffect(() => {
//     const handleAuthCallback = () => {
//       try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const accessToken = urlParams.get("accessToken");
//         const refreshToken = urlParams.get("refreshToken");

//         if (!accessToken || !refreshToken) {
//           throw new Error("Authentication failed: Missing tokens.");
//         }
//         setTokensSet(true);
//         // Safely store tokens in localStorage
//         // localStorage.setItem("accessToken", accessToken);
//         // localStorage.setItem("refreshToken", refreshToken);

//         // Confirm tokens are stored before triggering re-render
//         if (
//           localStorage.getItem("accessToken") === accessToken &&
//           localStorage.getItem("refreshToken") === refreshToken
//         ) {
//           // setTokensSet(true); // Set state to signal that tokens are set
//         } else {
//           throw new Error("Failed to store authentication tokens.");
//         }
//       } catch (err) {
//         console.error("Error during authentication callback:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     handleAuthCallback();
//   }, []);

//   useEffect(() => {
//     if (tokensSet) {
//       // Once tokens are set, navigate to home
//       navigate("/");
//       window.location.reload();
//     }
//   }, [tokensSet, navigate]); // Trigger navigation when tokens are confirmed to be set

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       {loading ? (
//         <h1>Redirecting...</h1>
//       ) : error ? (
//         <div>
//           <h1>Authentication Error</h1>
//           <p>{error}</p>
//           <button onClick={() => navigate("/login")}>Go to Login</button>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// export default GoogleCallbackPage;
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
        const authSuccess = urlParams.get("authSuccess");
        const device = urlParams.get("device");

        if (authSuccess !== "true") {
          throw new Error("Authentication failed during OAuth.");
        }

        // Optional: you can use `device` to redirect accordingly
        console.log("Authenticated from device:", device);

        // Redirect to homepage (or dashboard, etc.)
        navigate("/");
        window.location.reload(); // to reload and fetch fresh user state if needed
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
          <button onClick={() => navigate("/signup/choose-role")}>Go to Sign Up</button>
        </div>
      ) : null}
    </div>
  );
}

export default GoogleCallbackPage;
