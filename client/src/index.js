import React from "react";
import { createRoot } from 'react-dom/client'; // Corrected import for createRoot
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProviderSeeker from "./pages/ProviderSeeker";
import SignUpUser from "./pages/signupUser";
import LoginUser from "./pages/loginUser";
import LandingPage from "./pages/landingPage";
import LoginOwner from "./pages/LoginOwner";
import SignupOwner from "./pages/signupOwner";
import MessFind from "./pages/messFind";
import MailVerify from "./pages/mailVerify";
import ProtectedRoute from "./pages/protectedRoute";
import SecurityCheck from "./pages/securityCheck";
import MailVerifyOwner from "./pages/mailVerifyOwner";
import UserDashboard from "./pages/Dashboard";
import IsAuth from "./pages/isAuth";

// Create the root once and specify the container
const root = createRoot(document.getElementById("root")); // Using createRoot directly

// Render your application inside the root
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/ProviderSeeker" element={<ProviderSeeker />} />
          <Route
            path="/signupforuser"
            element={
              <ProtectedRoute>
                <SignUpUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Secure"
            element={<SecurityCheck />}
          />
          <Route
            path="/LoginUser"
            element={
              <ProtectedRoute>
                <LoginUser />
              </ProtectedRoute>
            }
          />
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route
            path="/LoginOwner"
            element={
              <ProtectedRoute>
                <LoginOwner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signupowner"
            element={
              <ProtectedRoute>
                <SignupOwner />
              </ProtectedRoute>
            }
          />
          <Route path="/MessFind" element={<MessFind />} />
          <Route path="/MailVerify" element={<MailVerify />} />
          <Route path="/MailVerifyOwner" element={<MailVerifyOwner />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <SecurityCheck />
              </ProtectedRoute>
            }
          />
          <Route path="/UserDashboard" element={
            <IsAuth>
            <UserDashboard/>
            </IsAuth>
            }/>
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
