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
  const { userName, IsAuthenticated, isOwnerAuthenticated, ownerName, user, owner, loginMethod, type } = useAuth();
  console.log(loginMethod)
  console.log(type)

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

  const renderStudentProfile = () => (
    <>
      <div className="details-row">
        <div className="details-title">Name</div>
        <div className="details-value">{user?.name}</div>
        <div className="details-edit">Edit</div>
      </div>
      <div className="details-row">
        <div className="details-title">Email address</div>
        <div className="details-value">{user?.email} <span className="details-verified">{user?.is_verified ? 'Verified' : 'Not Verified'}</span></div>
        <div className="details-edit">Edit</div>
      </div>
      {loginMethod === 'local' && (
        <>
          <div className="details-row">
            <div className="details-title">Address</div>
            <div className="details-value">{user?.address}</div>
            <div className="details-edit">Edit</div>
          </div>
          <div className="details-row">
            <div className="details-title">PIN</div>
            <div className="details-value">{user?.pin}</div>
            <div className="details-edit">Edit</div>
          </div>
        </>
      )}
      {loginMethod === 'google' && (
        <>
          <div className="details-row">
            <div className="details-title">Address</div>
            <input className="details-value" placeholder="Add your address" />
          </div>
          <div className="details-row">
            <div className="details-title">PIN</div>
            <input className="details-value" placeholder="Add your PIN" />
          </div>
        </>
      )}
    </>
  );

  const renderOwnerProfile = () => (
    <>
      <div className="details-row">
        <div className="details-title">Name</div>
        <div className="details-value">{owner?.name}</div>
        <div className="details-edit">Edit</div>
      </div>
      <div className="details-row">
        <div className="details-title">Email address</div>
        <div className="details-value">{owner?.email} <span className="details-verified">{owner?.is_verified_Owner ? 'Verified' : 'Not Verified'}</span></div>
        <div className="details-edit">Edit</div>
      </div>
      {loginMethod === 'local' && (
        <>
          <div className="details-row">
            <div className="details-title">Address</div>
            <div className="details-value">{owner?.address}</div>
            <div className="details-edit">Edit</div>
          </div>
          <div className="details-row">
            <div className="details-title">Mobile No</div>
            <div className="details-value">{owner?.mobile}</div>
            <div className="details-edit">Edit</div>
          </div>
          <div className="details-row">
            <div className="details-title">PIN</div>
            <div className="details-value">{owner?.pin}</div>
            <div className="details-edit">Edit</div>
          </div>
          <div className="details-row">
            <div className="details-title">Mess Name</div>
            <div className="details-value">{owner?.messName}</div>
            <div className="details-edit">Edit</div>
          </div>
          <div className="details-row">
            <div className="details-title">Bio Mess</div>
            <div className="details-value">{owner?.bioMess}</div>
            <div className="details-edit">Edit</div>
          </div>
          <div className="details-row">
            <div className="details-title">Location</div>
            <div className="details-value">{owner?.location}</div>
            <div className="details-edit">Edit</div>
          </div>
          <div className="details-row">
            <div className="details-title">Profile Photo</div>
            <div className="details-value">{owner?.profilePhoto}</div>
            <div className="details-edit">Edit</div>
          </div>
          <div className="details-row">
            <div className="details-title">Mess Photo</div>
            <div className="details-value">{owner?.messPhoto}</div>
            <div className="details-edit">Edit</div>
          </div>
          <div className="details-row">
            <div className="details-title">Facility</div>
            <div className="details-value">{owner?.facility}</div>
            <div className="details-edit">Edit</div>
          </div>
        </>
      )}
      {loginMethod === 'google' && (
        <>
          <div className="details-row">
            <div className="details-title">Address</div>
            <input className="details-value" defaultValue={owner?.address || ''} />
          </div>
          <div className="details-row">
            <div className="details-title">Mobile No</div>
            <input className="details-value" defaultValue={owner?.mobile || ''} />
          </div>
          <div className="details-row">
            <div className="details-title">PIN</div>
            <input className="details-value" defaultValue={owner?.pin || ''} />
          </div>
          <div className="details-row">
            <div className="details-title">Mess Name</div>
            <input className="details-value" defaultValue={owner?.messName || ''} />
          </div>
          <div className="details-row">
            <div className="details-title">Bio Mess</div>
            <input className="details-value" defaultValue={owner?.bioMess || ''} />
          </div>
          <div className="details-row">
            <div className="details-title">Location</div>
            <input className="details-value" defaultValue={owner?.location || ''} />
          </div>
          <div className="details-row">
            <div className="details-title">Profile Photo</div>
            <input className="details-value" defaultValue={owner?.profilePhoto || ''} />
          </div>
          <div className="details-row">
            <div className="details-title">Mess Photo</div>
            <input className="details-value" defaultValue={owner?.messPhoto || ''} />
          </div>
          <div className="details-row">
            <div className="details-title">Facility</div>
            <input className="details-value" defaultValue={owner?.facility || ''} />
          </div>
        </>
      )}
    </>
  );

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
            <h2 className='h2-profile'>Personal Details</h2>
            <div className="personal-details">
              {type === 'student' && renderStudentProfile()}
              {type === 'owner' && renderOwnerProfile()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
