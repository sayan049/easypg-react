import React from "react";

function BookingTable() {
  const bookings = [
    {
      id: "BK001",
      accommodation: "GreenView PG",
      dates: "2024-10-12 to 2024-11-12",
      amount: "₹3,000",
      status: "Confirmed",
    },
    {
      id: "BK002",
      accommodation: "Sunshine Mess",
      dates: "2024-12-01 to 2024-12-30",
      amount: "₹2,500",
      status: "Pending",
    },
    {
      id: "BK003",
      accommodation: "CozyNest PG",
      dates: "2024-08-01 to 2024-08-31",
      amount: "₹2,200",
      status: "Completed",
    },
  ];

  const stats = [
    { label: "Upcoming Bookings", value: 2, color: "text-green-600" },
    { label: "Active Stay", value: 1, color: "text-yellow-600" },
    { label: "Past Bookings", value: 5, color: "text-blue-600" },
    { label: "Total Spent", value: "₹15,000", color: "text-orange-600" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-md shadow text-center">
            <h2 className="text-lg font-semibold">{stat.label}</h2>
            <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Booking List Section */}
      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Booking List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="py-3 px-4 text-left">Booking ID</th>
                <th className="py-3 px-4 text-left">Accommodation Name</th>
                <th className="py-3 px-4 text-left">Booking Dates</th>
                <th className="py-3 px-4 text-left">Amount Paid</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="py-3 px-4">{booking.id}</td>
                  <td className="py-3 px-4">{booking.accommodation}</td>
                  <td className="py-3 px-4">{booking.dates}</td>
                  <td className="py-3 px-4">{booking.amount}</td>
                  <td className={`py-3 px-4 font-semibold ${booking.status === "Confirmed" ? "text-green-500" : booking.status === "Pending" ? "text-orange-500" : "text-purple-500"}`}>
                    {booking.status}
                  </td>
                  <td className="py-3 px-4">
                    {booking.status === "Completed" ? (
                      <button className="text-blue-500 hover:underline">Download Invoice</button>
                    ) : (
                      <button className="text-blue-500 hover:underline">View Details</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
        <button className="bg-gray-200 text-gray-700 text-sm rounded-md px-4 py-2 hover:bg-gray-300">
          Refresh
        </button>
        <div className="flex gap-2">
          <button className="bg-gray-200 text-gray-700 text-sm rounded-md px-4 py-2 hover:bg-gray-300">
            Export
          </button>
          <button className="bg-blue-500 text-white text-sm rounded-md px-4 py-2 hover:bg-blue-600">
            + New Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingTable;
