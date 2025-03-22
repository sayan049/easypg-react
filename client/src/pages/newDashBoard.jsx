import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar";
import BookingTable from "../components/BookingTable";
import Settings from "../components/settings";
import DashboardContent from "../components/dashboardContent";

function NewDashBoard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white p-4 shadow rounded-md mb-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center flex-1 lg:flex-none">
          <Link to="/">
          <h1 className="text-xl lg:text-2xl font-bold text-blue-500">
            Mess<span className="text-gray-800">Mate.</span>
          </h1>
          </Link>
        </div>

        <div className="flex justify-center w-full lg:w-auto mt-4 lg:mt-0 flex-1">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-inner w-full lg:w-96">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for messes, PGs, or bookings..."
              className="bg-transparent w-full ml-2 focus:outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="hidden lg:flex flex-1"></div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <header className="bg-white p-6 shadow rounded-md mb-6">
          <h1 className="text-2xl font-bold">Welcome back, Sandip!</h1>
          <p className="text-gray-500 mt-2">
            Last login: 8th Jan 2025, 10:00 AM
          </p>
        </header>

        {/* Main Layout */}
        <div className="flex h-[calc(100vh-14rem)] ">
          {/* Sidebar */}
          <Sidebar setActivePage={setActivePage} isOpen={isSidebarOpen} />

          {/* Right-side Content */}
          <div className=" lg:overflow-y-auto " style={{width:'100%'}}>
            {activePage === "My Bookings" && <BookingTable />}
            {activePage === "Dashboard" && <DashboardContent/>}
            {activePage === "Payments" && <div>Payments Content</div>}
            {activePage === "Settings" && <Settings />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewDashBoard;
