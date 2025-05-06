import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";

const DashboardCharts = ({ chartData }) => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [timeFrame, setTimeFrame] = useState("weekly");

  const bookingsData = chartData[timeFrame]?.bookings || [];

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      {/* Tabs */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            className={`text-sm px-4 py-2 rounded-full ${
              activeTab === "bookings" ? "bg-[#2CA4B5] text-white" : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
          <button
            className={`text-sm px-4 py-2 rounded-full ${
              activeTab === "revenue" ? "bg-[#2CA4B5] text-white" : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveTab("revenue")}
          >
            Revenue
          </button>
        </div>

        {/* Time filter */}
        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Chart Area */}
      {activeTab === "revenue" ? (
        <div className="flex items-center justify-center h-60 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400 text-lg font-semibold">
          💰 Revenue Chart Coming Soon
        </div>
      ) : (
        <div>
          <h3 className="text-md font-semibold mb-2 text-purple-600">PG Booking Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bookingsData} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" stackId="a" fill="#facc15" radius={[4, 4, 0, 0]} />
              <Bar dataKey="confirmed" stackId="a" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;
