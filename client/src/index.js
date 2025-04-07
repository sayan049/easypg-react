import React from "react";
import { createRoot } from "react-dom/client"; // Corrected import for createRoot
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
import NewDashboard from "./pages/newDashBoard";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
// import {BookingPage} from "./pages/BookingPage";
// import Test from "./pages/test";

import MessFind from "./pages/MessFind";

import MailVerify from "./pages/mailVerify";
import ProtectedRoute from "./pages/protectedRoute";
import SecurityCheck from "./pages/securityCheck";
import MailVerifyOwner from "./pages/mailVerifyOwner";
// import UserDashboard from "./pages/Dashboard";
import IsAuth from "./pages/isAuth";
import ViewDetails from "./pages/viewDetails";
import DashboardOwner from "./pages/DashboardOwner";

// Create the root once and specify the container
const root = createRoot(document.getElementById("root")); // Using createRoot directly

// Render your application inside the root
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          {/* <Route path="/newHome" element={<NewHomePage />} /> */}
          <Route path="/ProviderSeeker" element={<ProviderSeeker />} />
          {/* <Route path="/NewDashBoard" element={<NewDashboard />} /> */}
          <Route
            path="/signupforuser"
            element={
              <ProtectedRoute>
                <SignUpUser />
              </ProtectedRoute>
            }
          />
          <Route path="/Secure" element={<SecurityCheck />} />
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
          <Route
            path="/newDashboard"
            element={
              <IsAuth>
                <NewDashboard />
              </IsAuth>
            }
          />

          <Route
            path="/DashboardOwner"
            element={
              <IsAuth>
                <DashboardOwner />
              </IsAuth>
            }
          />

          <Route path="/ViewDetails" element={<ViewDetails />} />

          {/* <Route path="/BookingPage" element={<BookingPage />} /> */}

          <Route path="/googleCallback" element={<GoogleCallbackPage />} />

          {/* <Route path="/test" element={
          <Test/>
        }/> */}
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
