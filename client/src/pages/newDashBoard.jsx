import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import BookingTable from "../components/BookingTable";

function NewDashBoard() {
   const [activePage, setActivePage] = useState("Dashboard");
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };


   // Log the activePage to ensure state changes
   console.log("Active Page: ", activePage);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="bg-white p-6 shadow rounded-md mb-6">
          <h1 className="text-2xl font-bold">Welcome back, Sandip!</h1>
          
          <p className="text-gray-500 mt-2">
            Last login: 8th Jan 2025, 10:00 AM
          </p>
        </header>

        <button
            className="lg:hidden text-gray-700"
            onClick={toggleSidebar} // Toggle sidebar on button click
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
{/* ham */}

        {/* Sidebar with page selection */}
        <div className="flex">
        <Sidebar setActivePage={setActivePage} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

{/* Conditional rendering based on activePage */}
<div style={{width: {isSidebarOpen}?'80%':'100%'}}>
{activePage === "My Bookings" && <BookingTable />}
{activePage === "Dashboard" && <div>Dashboard Content</div>}
{activePage === "Payments" && <div>Payments Content</div>}
{activePage === "Settings" && <div>Settings Content</div>}
</div>
        </div>
       
        

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-between">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded">
            Refresh List
          </button>
          <div className="space-x-4">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded">
              Export List
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              + New Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewDashBoard;
