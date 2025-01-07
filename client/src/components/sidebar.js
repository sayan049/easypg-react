import React from "react";

function Sidebar({ setActivePage, isOpen, toggleSidebar }) {
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
        className={`w-64 bg-white shadow-md h-screen fixed lg:relative ${isOpen ? "block" : "hidden"} lg:block`}
        style={isOpen ? styl : {}}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold">MessMate</h1>
        </div>
        <ul className="mt-6">
          <li
            className="p-4 text-gray-700 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setActivePage("Dashboard");
              toggleSidebar();
            }}
          >
            Dashboard
          </li>
          <li
            className="p-4 text-gray-700 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setActivePage("My Bookings");
              toggleSidebar();
            }}
          >
            My Bookings
          </li>
          <li
            className="p-4 text-gray-700 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setActivePage("Payments");
              toggleSidebar();
            }}
          >
            Payments
          </li>
          <li
            className="p-4 text-gray-700 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setActivePage("Settings");
              toggleSidebar();
            }}
          >
            Settings
          </li>
        </ul>
        <button className="absolute bottom-6 left-6 text-red-500">Logout</button>
      </div>

      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={toggleSidebar}
      ></div>
    </>
  );
}

export default Sidebar;
