import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProviderSeeker from './pages/ProviderSeeker';
import SignUpForm from './pages/signupUser';
import LoginUser from './pages/loginUser'
import LandingPage from "./pages/landingPage";
import LoginOwner from "./pages/LoginOwner";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path:"/ProviderSeeker",
    element:<ProviderSeeker/>
  },
  {
    path: "/signupforuser",
    element:<SignUpForm/>
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
