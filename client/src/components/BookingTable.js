import React from "react";
import { FaDownload } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaBed, FaRupeeSign } from "react-icons/fa";
import { MdOutlineWifi, MdOutlineKitchen, MdOutlinePower, MdTv, MdOutlineAcUnit } from "react-icons/md";
import { MdOutlineAccessTime, MdOutlineHome, MdOutlineHistory } from "react-icons/md";
import { FaCalendarAlt, FaEye } from "react-icons/fa";

const BookingTable = () => {
  const bookings = [
    {
      id: "#MB01234",
      name: "Sunshine PG",
      date: "Apr 15, 2025",
      amount: "₹15,000",
      status: "Confirmed",
      action: "Download",
    },
    {
      id: "#MB01235",
      name: "Green View PG",
      date: "Apr 10, 2025",
      amount: "₹12,000",
      status: "Pending",
      action: "View",
    },
    {
      id: "#MB01236",
      name: "College Hub PG",
      date: "Apr 5, 2025",
      amount: "₹13,500",
      status: "Rejected",
      action: "View",
    },
  ];

  const statusColors = {
    Confirmed: "text-green-700 bg-green-100",
    Pending: "text-yellow-700 bg-yellow-100",
    Rejected: "text-red-700 bg-red-100",
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-6 xl:px-4 py-4  mx-auto">

      {/* Booking Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
        <div className="flex items-center justify-between sm:justify-center bg-white shadow-md p-4 rounded-xl">
          <div className="text-left">
            <p className="text-sm text-gray-500">Upcoming Bookings</p>
            <h2 className="text-2xl font-bold text-blue-600">2</h2>
          </div>
          <MdOutlineAccessTime className="text-3xl text-blue-500" />
        </div>
        <div className="flex items-center justify-between sm:justify-center bg-white shadow-md p-4 rounded-xl">
          <div className="text-left">
            <p className="text-sm text-gray-500">Active Stay</p>
            <h2 className="text-2xl font-bold text-green-600">1</h2>
          </div>
          <MdOutlineHome className="text-3xl text-green-500" />
        </div>
        <div className="flex items-center justify-between sm:justify-center bg-white shadow-md p-4 rounded-xl">
          <div className="text-left">
            <p className="text-sm text-gray-500">Past Bookings</p>
            <h2 className="text-2xl font-bold text-purple-600">5</h2>
          </div>
          <MdOutlineHistory className="text-3xl text-purple-500" />
        </div>
      </div>

      {/* Current Accommodation */}
      <div className="bg-white shadow-md p-4 rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Accommodation</h3>
        <h2 className="text-xl font-bold">Sunshine PG</h2>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <HiOutlineLocationMarker className="mr-1" />
          123 College Street, Tech Park
        </div>
        <p className="text-sm text-gray-600">Girls PG</p>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <FaBed className="mr-1" />
          Room 204
        </div>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <FaRupeeSign className="mr-1" />
          15,000/month
        </div>
        <div className="mt-4">
          <p className="font-semibold mb-2">Amenities</p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-700">
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdOutlineAcUnit /> AC</span>
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdTv /> TV</span>
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdOutlinePower /> Power Backup</span>
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdOutlineWifi /> WiFi</span>
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdOutlineKitchen /> Kitchen</span>
          </div>
        </div>
      </div>

      {/* Booking History Table (desktop) */}
      <div className="hidden md:block bg-white shadow-md p-4 rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-4">Booking History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="py-2">Booking ID</th>
                <th className="py-2">Accommodation</th>
                <th className="py-2">Date</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {bookings.map((booking, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-2">{booking.id}</td>
                  <td className="py-2">{booking.name}</td>
                  <td className="py-2">{booking.date}</td>
                  <td className="py-2">{booking.amount}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[booking.status]}`}>{booking.status}</span>
                  </td>
                  <td className="py-2">
                    {booking.action === "Download" ? (
                      <button className="text-blue-600 flex items-center gap-1"><FaDownload /> Download</button>
                    ) : (
                      <button className="text-blue-600 flex items-center gap-1"><FaEye /> View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking History Cards (mobile-friendly) */}
      <div className="md:hidden bg-white shadow-md p-4 rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-4">Booking History</h3>
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">Booking ID: {booking.id.slice(-4)}</p>
                  <h4 className="text-md font-semibold">{booking.name}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[booking.status]}`}>{booking.status}</span>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  {booking.date}
                </div>
                <div className="mt-1">{booking.amount}</div>
              </div>
              {booking.action === "Download" ? (
                <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                  <FaDownload /> Download Invoice
                </button>
              ) : (
                <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
                  <FaEye /> View Details
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingTable;
//       </span>
//       {status} 