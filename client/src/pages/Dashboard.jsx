import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userName, IsAuthenticated, isOwnerAuthenticated, ownerName, user, owner, loginMethod, type } = useAuth();
  
  const [profilePhoto, setProfilePhoto] = useState(null);  // To handle profile photo upload
  const [messPhoto, setMessPhoto] = useState(null);  // To handle mess photo upload

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

  const handleProfileClick = () => setCurrentView('profile');
  const handleDashboardClick = () => setCurrentView('dashboard');

  // Handle file change for profile and mess photo uploads
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(URL.createObjectURL(file));
  };

  const handleMessPhotoChange = (e) => {
    const file = e.target.files[0];
    setMessPhoto(URL.createObjectURL(file));
  };

  return (
    <div className="flex h-screen">
      {/* Hamburger Menu Icon for Small Devices */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-teal-500 p-2 rounded-full"
      >
        <img src="/assets/hamburger.svg" alt="Menu" className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full bg-teal-300 w-2/3 md:w-1/6 transition-transform transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        <div className="flex flex-col items-center py-6">
          <div className="text-teal-700 text-3xl font-bold">Easy<span className="text-blue-900">Pg</span></div>
          <hr className="border-white w-full my-4" />
          <div onClick={handleProfileClick} className="flex items-center cursor-pointer space-x-2">
            {IsAuthenticated || isOwnerAuthenticated ? <UserProfile /> : null}
            <span className="text-white font-medium">{IsAuthenticated ? userName : ownerName}</span>
          </div>
          <hr className="border-white w-full my-4" />
          <div onClick={handleDashboardClick} className="flex items-center cursor-pointer space-x-2">
            <img src="assets/dashboard.png" alt="Dashboard Icon" className="h-7" />
            <span className="text-white font-medium">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {currentView === 'dashboard' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <Line data={data} options={options} />
          </div>
        )}
        {currentView === 'profile' && (
          <div className="bg-white p-6 rounded-lg shadow">
            {type === 'student' ? (
              <div>
                <h2 className="text-center text-teal-500 font-bold text-xl mb-4">Personal Details</h2>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                {loginMethod === 'local' ? (
                  <>
                    <p><strong>Address:</strong> {user?.address}</p>
                    <p><strong>Pin:</strong> {user?.pin}</p>
                  </>
                ) : loginMethod === 'google' ? (
                  <>
                    <div><strong>Address:</strong><input className="w-full mt-1 p-2 border border-gray-300 rounded" placeholder="Add your address" /></div>
                    <div><strong>Pin:</strong><input className="w-full mt-1 p-2 border border-gray-300 rounded" placeholder="Add your PIN" /></div>
                  </>
                ) : null}
                <p><strong>Login Method:</strong> {loginMethod}</p>
              </div>
            ) : (
              <div>
                <h2 className="text-center text-teal-500 font-bold text-xl mb-4">Owner Details</h2>
                
                <div className="flex justify-center mb-4">
                  {/* Profile Photo */}
                  {loginMethod === 'local' ? (
                    <img 
                      src={owner?.profilePhoto || '/assets/default-profile.png'} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProfilePhotoChange} 
                        className="mb-2" 
                      />
                      {profilePhoto && (
                        <img 
                          src={profilePhoto} 
                          alt="Profile Preview" 
                          className="w-24 h-24 rounded-full"
                        />
                      )}
                    </div>
                  )}
                </div>
                
                <p><strong>Name:</strong> {owner?.name}</p>
                <p><strong>Email:</strong> {owner?.email}</p>
                {loginMethod === 'local' ? (
                  <>
                    <p><strong>Address:</strong> {owner?.address}</p>
                    <p><strong>Pin:</strong> {owner?.pin}</p>
                    <p><strong>Mobile No:</strong> {owner?.mobileNo}</p>
                    <p><strong>Facility:</strong> {owner?.facility}</p>
                    <p><strong>Mess Name:</strong> {owner?.messName}</p>
                    <p><strong>About Mess:</strong> {owner?.aboutMess}</p>
                    <p><strong>Location:</strong> {owner?.location}</p>
                    <img 
                      src={owner?.messPhoto || '/assets/default-mess-photo.jpg'} 
                      alt="Mess Photo" 
                      className="w-32 h-32 object-cover mt-2"
                    />
                  </>
                ) : loginMethod === 'google' ? (
                  <>
                    <div><strong>Address:</strong><input className="w-full mt-1 p-2 border border-gray-300 rounded" placeholder="Add your address" /></div>
                    <div><strong>Pin:</strong><input className="w-full mt-1 p-2 border border-gray-300 rounded" placeholder="Add your PIN" /></div>
                    <div><strong>Mobile No:</strong><input className="w-full mt-1 p-2 border border-gray-300 rounded" placeholder="Add your mobile number" /></div>
                    <div><strong>Facility:</strong><input className="w-full mt-1 p-2 border border-gray-300 rounded" placeholder="Add facility details" /></div>
                    <div><strong>Mess Name:</strong><input className="w-full mt-1 p-2 border border-gray-300 rounded" placeholder="Add mess name" /></div>
                    <div><strong>About Mess:</strong><textarea className="w-full mt-1 p-2 border border-gray-300 rounded" placeholder="About your mess" /></div>
                    <div><strong>Location:</strong><input className="w-full mt-1 p-2 border border-gray-300 rounded" placeholder="Add your location" /></div>
                    <div>
                      <strong>Mess Photo:</strong>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMessPhotoChange} 
                        className="mt-1 mb-2"
                      />
                      {messPhoto && (
                        <img 
                          src={messPhoto} 
                          alt="Mess Photo Preview" 
                          className="w-32 h-32 object-cover mt-2"
                        />
                      )}
                    </div>
                  </>
                ) : null}
                <p><strong>Login Method:</strong> {loginMethod}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
