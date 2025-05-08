import React from "react";
import { createRoot } from "react-dom/client"; // Corrected import for createRoot
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
// import { SocketProvider } from "./contexts/socketContext"; // Import the SocketProvider
import ProviderSeeker from "./pages/ProviderSeeker";
import SignUpUser from "./pages/signupUser";
import LoginUser from "./pages/loginUser";
import LandingPage from "./pages/landingPage";
import LoginOwner from "./pages/LoginOwner";
import SignupOwner from "./pages/signupOwner";
import NewDashboard from "./pages/newDashBoard";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import BookingPage from "./pages/BookingPage"; 
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
import BusinessModel from "./pages/Business";
import OurService from "./pages/ourService";
// Create the root once and specify the container
const root = createRoot(document.getElementById("root")); // Using createRoot directly

// Render your application inside the root
root.render(
  <React.StrictMode>
    <AuthProvider>
    {/* <SocketProvider>  */}
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          {/* <Route path="/newHome" element={<NewHomePage />} /> */}
          <Route path="/choose-role" element={<ProviderSeeker />} />
          {/* <Route path="/NewDashBoard" element={<NewDashboard />} /> */}
          <Route path="/business-model" element={<BusinessModel />} />
          <Route path="/our-services" element={<OurService />} />
          <Route
            path="/signup/user"
            element={
              <ProtectedRoute>
                <SignUpUser />
              </ProtectedRoute>
            }
          />
          <Route path="/Secure" element={<SecurityCheck />} />
          <Route
            path="/login/user"
            element={
              <ProtectedRoute>
                <LoginUser />
              </ProtectedRoute>
            }
          />
          <Route path="/owner/partner" element={<LandingPage />} />
          <Route
            path="/login/owner"
            element={
              <ProtectedRoute>
                <LoginOwner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup/owner"
            element={
              <ProtectedRoute>
                <SignupOwner />
              </ProtectedRoute>
            }
          />

          {/* <Route path="/MessFind" element={<MessFind />} /> */}
          <Route path="/find-mess/:initialItem" element={<MessFind />} />


          <Route path="/MailVerify" element={<MailVerify />} />
          <Route path="/MailVerifyOwner" element={<MailVerifyOwner />} />
          <Route path="/booking" element={<BookingPage />} />
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

          <Route path="/ViewDetails/:messId" element={<ViewDetails />} />

          {/* <Route path="/BookingPage" element={<BookingPage />} /> */}

          <Route path="/googleCallback" element={<GoogleCallbackPage />} />

          {/* <Route path="/test" element={
          <Test/>
        }/> */}
        </Routes>
      </Router>
      {/* </SocketProvider> */}
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
// import React from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import reportWebVitals from "./reportWebVitals";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";

// // Pages
// import ProviderSeeker from "./pages/ProviderSeeker";
// import SignUpUser from "./pages/signupUser";
// import LoginUser from "./pages/loginUser";
// import LandingPage from "./pages/landingPage";
// import LoginOwner from "./pages/LoginOwner";
// import SignupOwner from "./pages/signupOwner";
// import NewDashboard from "./pages/newDashBoard";
// import GoogleCallbackPage from "./pages/GoogleCallbackPage";
// import BookingPage from "./pages/BookingPage";
// import MessFind from "./pages/MessFind";
// import MailVerify from "./pages/mailVerify";
// import ProtectedRoute from "./pages/protectedRoute";
// import SecurityCheck from "./pages/securityCheck";
// import MailVerifyOwner from "./pages/mailVerifyOwner";
// import IsAuth from "./pages/isAuth";
// import ViewDetails from "./pages/viewDetails";
// import DashboardOwner from "./pages/DashboardOwner";
// import BusinessModel from "./pages/Business";
// import OurService from "./pages/ourService";

// const root = createRoot(document.getElementById("root"));

// root.render(
//   <React.StrictMode>
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public Pages */}
//           <Route path="/" element={<App />} />
//           <Route path="/choose-role" element={<ProviderSeeker />} />
//           <Route path="/business-model" element={<BusinessModel />} />
//           <Route path="/services" element={<OurService />} />
//           <Route path="/find-mess" element={<MessFind />} />
//           <Route path="/mess/:id" element={<ViewDetails />} /> {/* Dynamic SEO-friendly */}

//           {/* User Auth */}
//           <Route path="/signup-user" element={
//             <ProtectedRoute>
//               <SignUpUser />
//             </ProtectedRoute>
//           }/>
//           <Route path="/login-user" element={
//             <ProtectedRoute>
//               <LoginUser />
//             </ProtectedRoute>
//           }/>

//           {/* Owner Auth */}
//           <Route path="/signup-owner" element={
//             <ProtectedRoute>
//               <SignupOwner />
//             </ProtectedRoute>
//           }/>
//           <Route path="/login-owner" element={
//             <ProtectedRoute>
//               <LoginOwner />
//             </ProtectedRoute>
//           }/>

//           {/* Dashboards */}
//           <Route path="/user/dashboard" element={
//             <IsAuth>
//               <NewDashboard />
//             </IsAuth>
//           }/>
//           <Route path="/owner/dashboard" element={
//             <IsAuth>
//               <DashboardOwner />
//             </IsAuth>
//           }/>
//           <Route path="/owner/home" element={<LandingPage />} />

//           {/* Booking & Callbacks */}
//           <Route path="/booking" element={<BookingPage />} />
//           <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

//           {/* Verification & Security */}
//           <Route path="/verify-user-email" element={<MailVerify />} />
//           <Route path="/verify-owner-email" element={<MailVerifyOwner />} />
//           <Route path="/security-check" element={<SecurityCheck />} />
//           <Route path="/protected" element={
//             <ProtectedRoute>
//               <SecurityCheck />
//             </ProtectedRoute>
//           }/>
//         </Routes>
//       </Router>
//     </AuthProvider>
//   </React.StrictMode>
// );

// reportWebVitals();

