import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProviderSeeker from './pages/ProviderSeeker';
import SignUpUser from './pages/signupUser';
import LoginUser from './pages/loginUser'
import LandingPage from "./pages/landingPage";
import LoginOwner from "./pages/LoginOwner";
import SignupOwner from './pages/signupOwner';
import MessFind from './pages/messFind';
import MailVerify from './pages/mailVerify'
import ProtectedRoute from './pages/protectedRoute';
// import HomePage from './pages/homePage';
// import FlashMessage from './components/flashMessage';


const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
  // {
    
  //   path: "/home",
  //   element: <HomePage/>
  // },
  {
    path:"/ProviderSeeker",
    element:<ProviderSeeker/>
  },
  {
    path: "/signupforuser",
    element:<SignUpUser/>
  },
  {
    path:"/LoginUser",
    element:<LoginUser/>
  },
  {
    path:"/LandingPage",
    element:<LandingPage/>
  },
  {
    path:"/LoginOwner",
    element:<LoginOwner/>
  },
  {
    path:"/signupowner",
    element:<SignupOwner/>
  },
  {
    path:"/MessFind",
    element:<MessFind/>
  },
  // {
  //   path:"/Flashmessage",
  //   element:<FlashMessage/>
  // }
  {
    path:"/MailVerify",
    element:<MailVerify/>
  },
  {
    path:"/protected",
    element:<ProtectedRoute/>
  }
  

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
