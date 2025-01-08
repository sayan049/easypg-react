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

<header className="bg-white p-4 shadow rounded-md mb-6 flex flex-wrap items-center justify-between">
  {/* Logo Section */}
  <div className="flex items-center flex-1 lg:flex-none">
    <h1 className="text-xl lg:text-2xl font-bold text-blue-500">
      Mess<span className="text-gray-800">Mate.</span>
    </h1>
  </div>

  {/* Search Bar in the Center */}
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

  {/* Empty Right Section for Alignment */}
  <div className="hidden lg:flex flex-1"></div>
</header>





      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="bg-white p-6 shadow rounded-md mb-6">
          <h1 className="text-2xl font-bold">Welcome back, Sandip!</h1>
          
          <p className="text-gray-500 mt-2">
            Last login: 8th Jan 2025, 10:00 AM
          </p>
        </header>

        {/* <button
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
          </button> */}
{/* ham */}

        {/* Sidebar with page selection */}
        <div className="flex">
        <Sidebar setActivePage={setActivePage} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

{/* Conditional rendering based on activePage */}
<div style={{width: {isSidebarOpen}? '100%':'80%'}}>
{activePage === "My Bookings" && <BookingTable />}
{activePage === "Dashboard" && <div>Dashboard Content</div>}
{activePage === "Payments" && <div>Payments Content</div>}
{activePage === "Settings" && <div>Settings Content</div>}
</div>
        </div>
       
        

       
      </div>
    </div>
  );
}

export default NewDashBoard;
