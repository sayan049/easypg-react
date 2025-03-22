import React from "react";

function DashboardContent() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Welcome back, Sandip!</h1>
          <p className="text-sm text-gray-500">Last Login: 1st Jan 2025, 10:00 AM</p>
        </header>

        {/* Responsive Box Container */}
        <div className="flex flex-wrap gap-4 ">
          
        <div className="flex flex-wrap gap-4 justify-between">
  <div className="bg-white shadow-md rounded-lg px-6 pt-6 w-full sm:w-72 border border-blue-200">
    <h2 className="text-lg font-bold mb-4">Upcoming Stay</h2>
    
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600">Check-in:</p>
      <p className="text-base font-medium">2025-01-20</p>
    </div>
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600">Check-out:</p>
      <p className="text-base font-medium">2025-01-25</p>
    </div>
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600">Accommodation Name:</p>
      <p className="text-base font-medium">Satyam PG</p>
    </div>
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600">Total Amount Due:</p>
      <p className="text-base font-medium text-red-500">₹5,000</p>
    </div>
    <div className="mb-4 flex justify-between ">
      <p className="text-sm text-gray-600 w-4">Payment Reminder:</p>
      <p className="text-base font-medium">Due by 2025-01-15</p>
    </div>
    <div className="flex flex-wrap gap-2 justify-between">
  <button className="bg-blue-500 text-white text-sm  py-1.5 px-3 font-semibold rounded hover:bg-blue-600">
    Renew Stay
  </button>
  <button className="bg-gray-200 text-gray-800 text-sm  py-1.5 px-3 rounded font-semibold hover:bg-gray-300 ">
    Cancel Stay
  </button>
  
</div>
{/* <button className="rounded-full bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 mt-4 font-semibold text-xs transition-transform duration-300 ease-in-out hover:scale-x-110 hover:scale-y-110">
  See More <span className="ml-2 text-black">→</span>
</button> */}
<button className="bg-teal-500 text-white text-sm  py-1.5 px-3 rounded hover:bg-teal-600 w-full my-4">
    View Details
  </button>

  </div>
  
</div>



<div className="flex flex-wrap gap-4 justify-between">
  <div className="bg-white shadow-md rounded-lg px-6 pt-6 w-full sm:w-72 border border-blue-200">
    <h2 className="text-lg font-bold mb-4">Total payment made</h2>
    
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600 whitespace-normal break-words">Total payment</p>
      <p className="text-base font-medium text-green-500 whitespace-normal break-words">₹15,000</p>
    </div>
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600 whitespace-normal break-words">Total Transactions:</p>
      <p className="text-base font-medium whitespace-normal break-words">5</p>
    </div>
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600 whitespace-normal break-words">Last Payment Made:</p>
      <p className="text-base font-medium whitespace-normal break-words">₹3,000 for Satyam PG</p>
    </div>
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600 whitespace-normal break-words">Payment Status:</p>
      <p className="text-base font-medium text-red-500 whitespace-normal break-words">Due</p>
    </div>
    {/* <div className="mb-4 flex justify-between ">
      <p className="text-sm text-gray-600 w-4">Payment Reminder:</p>
      <p className="text-base font-medium">Due by 2025-01-15</p>
    </div> */}
    <div className="flex flex-wrap gap-2 justify-between py-[3rem]">
  <button className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-600 w-full ">
  View Payment History
  </button>
  <button className="bg-gray-200 text-gray-800 text-sm font-semibold py-2 px-4 rounded hover:bg-gray-300 w-full ">
  Download  Receipt
  </button>
  
</div>
{/* <button className="rounded-full bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 mt-4 font-semibold text-xs transition-transform duration-300 ease-in-out hover:scale-x-110 hover:scale-y-110">
  See More <span className="ml-2 text-black">→</span>
</button> */}
{/* <button className="bg-teal-500 text-white text-xs  py-1.5 px-3 rounded hover:bg-teal-600 w-full my-4">
    View Details
  </button> */}

  </div>
  
</div>

<div className="flex flex-wrap gap-4 justify-between">
  <div className="bg-white shadow-md rounded-lg px-6 pt-6 w-full sm:w-72 border border-blue-200">
    <h2 className="text-lg font-bold mb-4">Upcoming Stay</h2>
    
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600">Check-in:</p>
      <p className="text-base font-medium">2025-01-20</p>
    </div>
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600">Check-out:</p>
      <p className="text-base font-medium">2025-01-25</p>
    </div>
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600">Accommodation Name:</p>
      <p className="text-base font-medium">Satyam PG</p>
    </div>
    <div className="mb-2 flex justify-between">
      <p className="text-sm text-gray-600">Total Amount Due:</p>
      <p className="text-base font-medium text-red-500">₹5,000</p>
    </div>
    <div className="mb-4 flex justify-between ">
      <p className="text-sm text-gray-600 w-4">Payment Reminder:</p>
      <p className="text-base font-medium">Due by 2025-01-15</p>
    </div>
    <div className="flex flex-wrap gap-2 justify-between">
  <button className="bg-blue-500 text-white text-xs  py-1.5 px-3 font-semibold rounded hover:bg-blue-600">
    Renew Stay
  </button>
  <button className="bg-gray-200 text-gray-800 text-xs  py-1.5 px-3 rounded font-semibold hover:bg-gray-300 ">
    Cancel Stay
  </button>
  
</div>
{/* <button className="rounded-full bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 mt-4 font-semibold text-xs transition-transform duration-300 ease-in-out hover:scale-x-110 hover:scale-y-110">
  See More <span className="ml-2 text-black">→</span>
</button> */}
<button className="bg-teal-500 text-white text-xs  py-1.5 px-3 rounded hover:bg-teal-600 w-full my-4">
    View Details
  </button>

  </div>
  
</div>


        
        </div>

        {/* Grid Layout for Notifications, Accommodation Info, and Maintenance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          <div className="lg:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-600 mb-3">Notifications</h2>
            <ul>
              <li className="mb-2">
                <p className="text-sm">
                  <strong>16 Jan:</strong> Upcoming Stay Reminder: Your stay at Room A-102 begins on 25th Jan 2024.
                </p>
              </li>
              <li>
                <p className="text-sm">
                  <strong>18 Jan:</strong> Check-out Reminder: Your stay at Room B-205 ends on 30th July 2024.
                </p>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Accommodation Info</h2>
            <p className="text-sm">
              <strong>Location:</strong> 123 College Road, Bankura
            </p>
            <p className="text-sm">
              <strong>Room Type:</strong> Single Room
            </p>
            <p className="text-sm">
              <strong>Next Payment Due:</strong> ₹5,000 on 15 Jan 2025
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Maintenance Request</h2>
          <form className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="issue">
                Issue
              </label>
              <select
                id="issue"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option>Plumbing</option>
                <option>Electricity</option>
                <option>Wi-Fi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe the issue briefly..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
