import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProviderSeeker from './pages/ProviderSeeker';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path:"/ProviderSeeker",
    element:<ProviderSeeker/>
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
