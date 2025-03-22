import React from "react";

function Sidebar({ setActivePage, isOpen }) {
  // Style object for the sidebar
  const styl = {
    zIndex: '20',
    right: '10px',
    left: '1px',
    top: '0px',
  };

  return (
    <>
      {/* Sidebar for larger screens */}
      <div
        className={`w-64 bg-white shadow-md h-[calc(100vh-16rem)] fixed lg:relative ${
          isOpen ? "block" : "hidden"
        } lg:block` }
       // style={isOpen ? styl : {}}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold">MessMate</h1>
        </div>
        <ul className="mt-6">
          <li
            className="p-4 text-gray-700 hover:bg-teal-500 hover:text-white cursor-pointer"
            onClick={() => {
              setActivePage("Dashboard");
              //toggleSidebar();
            }}
          >
            Dashboard
          </li>
          <li
            className="p-4 text-gray-700 hover:bg-teal-500 hover:text-white cursor-pointer "
            onClick={() => {
              setActivePage("My Bookings");
             // toggleSidebar();
            }}
          >
            My Bookings
          </li>
          <li
            className="p-4 text-gray-700 hover:bg-teal-500 hover:text-white cursor-pointer"
            onClick={() => {
              setActivePage("Payments");
              //toggleSidebar();
            }}
          >
            Payments
          </li>
          <li
            className="p-4 text-gray-700 hover:bg-teal-500 hover:text-white cursor-pointer"
            onClick={() => {
              setActivePage("Settings");
             // toggleSidebar();
            }}
          >
            Settings
          </li>
        </ul>
        <div className="mt-6"><button className="p-4  text-red-500 hover:text-white hover:bg-red-500 w-full text-left">Logout</button></div>
        {/* absolute bottom-6 left-6 */}
      </div>

      {/* Bottom Navigation for smaller screens */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-md flex justify-around p-2 right-0 z-10">
        <button
          className="flex flex-col items-center text-gray-700 hover:text-[#2CA4B5]"
          onClick={() => setActivePage("Dashboard")}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg> */}
          <img src="assets/icon.png" className="brightness-0 saturation-100 hover:brightness-100 hover:saturation-0" alt="icon"/>
          
          <span className="text-sm">Home</span>
        </button>

        <button
          className="flex flex-col items-center text-gray-700 hover:text-[#2CA4B5]"
          onClick={() => setActivePage("My Bookings")}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16l-4-4m0 0l4-4m-4 4h16"
            />
          </svg> */}
          <img src="assets/bookmark_filled.png" alt="bookmark"/>
          <span className="text-sm">Booking</span>
        </button>

        <button
          className="flex flex-col items-center text-gray-700 hover:text-[#2CA4B5]"
          onClick={() => setActivePage("Payments")}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a4 4 0 00-8 0v2m-2 0a6 6 0 0112 0v2a2 2 0 002 2H5a2 2 0 01-2-2V9a6 6 0 012-4m0 4h14"
            />
          </svg> */}
          <img src="assets/Payment.png" alt="payment"/>
          <span className="text-sm">Payments</span>
        </button>

        <button
          className="flex flex-col items-center text-gray-700 hover:text-[#2CA4B5]"
          onClick={() => setActivePage("Settings")}
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg> */}
          <img src="assets/settings.png" alt="settings"/>
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </>
  );
}

export default Sidebar;
