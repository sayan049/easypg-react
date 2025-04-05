import React, { useState } from "react";
import { BookIcon, ClockIcon, HourglassIcon } from "lucide-react";

const BookingCard = ({ name, id, days, type, avatar }) => (
  <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-4">
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-gray-500">#{id}</p>
          </div>
        </div>
        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
      </div>
      <div className="text-sm">
        <p><strong>Booked For:</strong> {days} Days</p>
        <p><strong>Room Type:</strong> {type}</p>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Confirm</button>
        <button className="flex-1 border border-red-500 text-red-500 py-1 rounded hover:bg-red-50">Reject</button>
      </div>
    </div>
  </div>
);

const PendingRequests = () => (
  <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
    <BookingCard
      name="Sarah Johnson"
      id="MM12345"
      days={90}
      type="Double Sharing"
      avatar="https://i.pravatar.cc/150?img=32"
    />
    <BookingCard
      name="Mike Chen"
      id="MM12346"
      days={180}
      type="Single Room"
      avatar="https://i.pravatar.cc/150?img=33"
    />
  </div>
);

const ConfirmedBookings = () => (
  <div className="text-gray-500 text-sm">No confirmed bookings yet.</div>
);

const BookingStatus = () => {
  const [tab, setTab] = useState("pending");

  return (
    <div className="p-4 space-y-6">
      {/* Top Section */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Booking Status</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <h2 className="text-2xl font-bold">156</h2>
            </div>
            <BookIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Requests</p>
              <h2 className="text-2xl font-bold">28</h2>
            </div>
            <ClockIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <h2 className="text-2xl font-bold">12</h2>
            </div>
            <HourglassIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Custom Tab Switch */}
      <div className="space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 border-b-2 transition font-medium ${tab === "pending" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("pending")}
          >
            Pending Requests
          </button>
          <button
            className={`pb-2 border-b-2 transition font-medium ${tab === "confirmed" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("confirmed")}
          >
            Confirmed Bookings
          </button>
        </div>

        <div>
          {tab === "pending" && <PendingRequests />}
          {tab === "confirmed" && <ConfirmedBookings />}
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;
