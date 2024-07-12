import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../designs/userdashboard.css';
import { useAuth } from "../contexts/AuthContext";
import UserProfile from "../components/UserProfile";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const UserDashboard = () => {
  const [currentView, setCurrentView] = useState('profile');
  const { userName, IsAuthenticated,   isOwnerAuthenticated, ownerName } = useAuth();

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Hotels/PGs Booked',
        data: [3, 2, 5, 4, 6, 3, 7, 5, 4, 6, 8, 5],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: 'rgba(75, 192, 192, 1)',
        fill: true
      },
      {
        label: 'Payments Made (in ₹)',
        data: [15000, 10000, 25000, 20000, 30000, 15000, 35000, 25000, 20000, 30000, 40000, 25000],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        pointBackgroundColor: 'rgba(255, 159, 64, 1)',
        pointBorderColor: 'rgba(255, 159, 64, 1)',
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Booking Trends and Payments (Monthly)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count / Amount (₹)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    }
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
  };

  const handleDashboardClick = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="dashboard-container">
      <div className='left-profile'>
        <div className='main-page'>
          <span className="page-left">Easy</span>
          <span className="page-right">Pg</span>
        </div>
        <hr className='hr-left' />
        <div className='profile-dashboard'>
          {(IsAuthenticated || isOwnerAuthenticated) && <UserProfile />}
          <div className='profile-name' onClick={handleProfileClick}>
            {IsAuthenticated ? userName : isOwnerAuthenticated ? ownerName : ' '}
          </div>
          <img className='down-arr' src="assets/Vector 3.png" alt="" />
        </div>
        <hr className='hr-left' />
        <div className='Dashboard-d' onClick={handleDashboardClick}>
          <img className='dashboard-img' src="assets/dashboard.png" alt="" />
          <div className='main-dashboard'>Dashboard</div>
        </div>
      </div>
      <div className='right-content'>
        {currentView === 'dashboard' && (
          <div className="graph-container">
            <Line data={data} options={options} className="line-chart" />
          </div>
        )}
        {currentView === 'profile' && (
          <div className='profile-details'>
            <h2>Personal Details</h2>
            <div className="personal-details">
              <div className="details-row">
                <div className="details-title">Name</div>
                <div className="details-value">Patra Sayan</div>
                <div className="details-edit">Edit</div>
              </div>
              <div className="details-row">
                <div className="details-title">Display name</div>
                <div className="details-value">Choose a display name</div>
                <div className="details-edit">Edit</div>
              </div>
              <div className="details-row">
                <div className="details-title">Email address</div>
                <div className="details-value">sayanpatra017@gmail.com <span className="details-verified">Verified</span></div>
                <div className="details-edit">Edit</div>
              </div>
              <div className="details-row">
                <div className="details-title">Phone number</div>
                <div className="details-value">Add your phone number</div>
                <div className="details-edit">Edit</div>
              </div>
              <div className="details-row">
                <div className="details-title">Date of birth</div>
                <div className="details-value">Enter your date of birth</div>
                <div className="details-edit">Edit</div>
              </div>
              <div className="details-row">
                <div className="details-title">Nationality</div>
                <div className="details-value">Select the country/region you're from</div>
                <div className="details-edit">Edit</div>
              </div>
              <div className="details-row">
                <div className="details-title">Gender</div>
                <div className="details-value">Select your gender</div>
                <div className="details-edit">Edit</div>
              </div>
              <div className="details-row">
                <div className="details-title">Address</div>
                <div className="details-value">Add your address</div>
                <div className="details-edit">Edit</div>
              </div>
              <div className="details-row">
                <div className="details-title">Passport details</div>
                <div className="details-value">Not provided</div>
                <div className="details-edit">Add passport</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
