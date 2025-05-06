import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";
import { baseurl } from "../constant/urls";

const DashboardCharts = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return setError("Access token not found.");

        const response = await axios.get(`${baseurl}/auth/owner/chart-stats?timeFrame=${timeFrame}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setChartData(response.data);
      } catch (error) {
        setError("Error loading chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [timeFrame]);

  const bookingsData = chartData?.[timeFrame]?.bookings || [];
  const totalStudents = chartData?.[timeFrame]?.totalStudents || 0;
  const revenue = chartData?.[timeFrame]?.revenue || 0;

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6 space-y-6 bg-white rounded-xl shadow">
      {/* Header: Tabs + TimeFrame */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {["bookings", "revenue"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm px-4 py-2 rounded-full ${
                activeTab === tab ? "bg-[#2CA4B5] text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded-xl">
          <div className="text-gray-600 text-sm">Total Bookings</div>
          <div className="text-2xl font-bold text-blue-800">{totalStudents}</div>
        </div>
        <div className="bg-green-100 p-4 rounded-xl">
          <div className="text-gray-600 text-sm">Total Revenue</div>
          <div className="text-2xl font-bold text-green-800">₹{revenue}</div>
        </div>
      </div>

      {/* Booking Health Progress */}
      <div className="space-y-3">
        <div className="text-md font-semibold text-gray-800">Booking Health</div>
        {["pending", "confirmed", "rejected"].map((key, idx) => {
          const total = bookingsData.reduce((acc, cur) => acc + (cur[key] || 0), 0);
          const color =
            key === "pending" ? "bg-yellow-400" :
            key === "confirmed" ? "bg-green-500" : "bg-red-400";

          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key}</span>
                <span>{total}</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min((total / totalStudents) * 100 || 0, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      {activeTab === "bookings" && (
        <div>
          <h3 className="text-md font-semibold mb-2 text-purple-600">PG Booking Trend</h3>
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

      {activeTab === "revenue" && (
        <div className="flex items-center justify-center h-60 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400 text-lg font-semibold">
          💰 Revenue Chart Coming Soon
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;
