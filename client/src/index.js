import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Adjust the import path as necessary
import ProviderSeeker from './pages/ProviderSeeker';
import SignUpUser from './pages/signupUser';
import LoginUser from './pages/loginUser';
import LandingPage from "./pages/landingPage";
import LoginOwner from "./pages/LoginOwner";
import SignupOwner from './pages/signupOwner';
import MessFind from './pages/messFind';
import MailVerify from './pages/mailVerify';
import ProtectedRoute from './pages/protectedRoute';
import SecurityCheck from './pages/securityCheck';
import MailVerifyOwner from './pages/mailVerifyOwner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap your application with AuthProvider here */}
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/ProviderSeeker" element={<ProviderSeeker />} />
          <Route path="/signupforuser" element={
            <ProtectedRoute>
              <SignUpUser />
            </ProtectedRoute>
          } />
          <Route path="/Secure" element={
            // <ProtectedRoute>
            <SecurityCheck/>
            // </ProtectedRoute>
            }/>
          <Route path="/LoginUser" element={
              <ProtectedRoute>
              <LoginUser />
              </ProtectedRoute>
          } />
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/LoginOwner" element={
             
             <LoginOwner />
           
          } />
          <Route path="/signupowner" element={<SignupOwner />} />
          <Route path="/MessFind" element={<MessFind />} />
          <Route path="/MailVerify" element={<MailVerify />} />
          <Route path="/MailVerifyOwner" element={<MailVerifyOwner/>}/>
          {/* Example of using ProtectedRoute for another route */}
          {/* <Route path="/protected" element={
             <ProtectedRoute>
              <SecurityCheck/>
             </ProtectedRoute>
            
          } /> */}
        </Routes>
      </Router>
    </AuthProvider> {/* End of AuthProvider */}
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
