import React from "react";
import { FaRupeeSign, FaBookmark, FaCalendarAlt } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";

 function DashboardContent() {
  return (
    <div className="p-4 md:p-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, Alex!
        </h1>
        <p className="text-gray-500 mt-2">
          Your comfort is our priority. Manage your stays efficiently.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<FaRupeeSign className="text-2xl text-blue-500" />}
          label="Total Spent"
          value="₹45,000"
        />
        <StatCard
          icon={<FaBookmark className="text-2xl text-green-500" />}
          label="Active Bookings"
          value="2"
        />
        <StatCard
          icon={<FaCalendarAlt className="text-2xl text-purple-500" />}
          label="Days Remaining"
          value="45"
        />
      </div>

      {/* Notifications */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Stay Notifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NotificationCard
            icon={<FiAlertCircle className="text-blue-500 text-xl" />}
            title="Upcoming Check-in"
            description="Sunshine PG – Room 203"
            date="March 1, 2025"
          />
          <NotificationCard
            icon={<FiAlertCircle className="text-yellow-500 text-xl" />}
            title="Rent Due Soon"
            description="Monthly Payment"
            date="Due: Feb 28, 2025"
          />
        </div>
      </div>

      {/* Upcoming PG */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Upcoming PGs</h2>
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="text-gray-800 font-semibold">Sunshine PG</h3>
            <p className="text-gray-500 text-sm">Room 203, Single Occupancy</p>
            <p className="text-gray-400 text-xs mt-1">Mar 1, 2025 – Aug 31, 2025</p>
          </div>
          <div className="flex flex-col md:items-end mt-4 md:mt-0">
            <p className="font-bold text-gray-800 mb-2">₹12,000/month</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50">
                Cancel
              </button>
              <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Extend Stay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Maintenance Request */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Create Maintenance Request
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
              Submit Request
            </button>
          </div>
        </div>

        {/* Maintenance History */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Maintenance History
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <MaintenanceItem
              title="Plumbing Issue"
              date="Reported on Feb 15, 2025"
              status="In Progress"
              statusColor="bg-yellow-400"
            />
            <MaintenanceItem
              title="Electrical Repair"
              date="Reported on Feb 10, 2025"
              status="Resolved"
              statusColor="bg-green-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-bold text-xl">{value}</p>
      </div>
    </div>
  );
}

function NotificationCard({ icon, title, description, date }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex gap-4 items-center">
      <div>{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </div>
  );
}

function MaintenanceItem({ title, date, status, statusColor }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
      <span
        className={`text-xs text-white px-2 py-1 rounded-full ${statusColor}`}
      >
        {status}
      </span>
    </div>
  );
}

export default DashboardContent;