import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios directly
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { baseurl } from "../constant/urls";

const DashboardCharts = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [chartData, setChartData] = useState(null); // To store the fetched chart data
  const [loading, setLoading] = useState(true); // To handle the loading state
  const [error, setError] = useState(null); // To handle errors

  // Fetch chart data whenever the component mounts or timeFrame changes
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset any previous errors
  
        const accessToken = localStorage.getItem("accessToken"); // Get the access token from local storage
        if (!accessToken) {
          setError("Access token not found.");
          return; // Exit early if no token is found
        }
  
        const response = await axios.get(`${baseurl}/auth/owner/chart-stats?timeFrame=${timeFrame}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the accessToken in the Authorization header
          },
        });
        console.log("Chart data response:", response.data); // Log the response data for debugging
        // Assuming data is available if response status is 200
        setChartData(response.data); // The data returned is assumed to be in the correct format
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
  
        // Handle specific error messages depending on the type of error
        if (error.response) {
          // The server responded with an error status code
          setError(`Failed to load data. Server responded with status: ${error.response.status}`);
        } else if (error.request) {
          // No response was received
          setError("Failed to load data. Network error occurred.");
        } else {
          // Some other error occurred
          setError("Failed to load data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchChartData();
  }, [timeFrame]); // Run the effect when the timeFrame changes
  
  
// Run the effect when the timeFrame changes
  

  const bookingsData = chartData?.[timeFrame]?.bookings || []; // Extract bookings data
  const totalStudents = chartData?.[timeFrame]?.totalStudents || 0; // Extract total students

  // Render loading state, error state, or chart
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="text-lg font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      {/* Tabs */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            className={`text-sm px-4 py-2 rounded-full ${activeTab === "bookings" ? "bg-[#2CA4B5] text-white" : "bg-gray-100 text-gray-600"}`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
          <button
            className={`text-sm px-4 py-2 rounded-full ${activeTab === "revenue" ? "bg-[#2CA4B5] text-white" : "bg-gray-100 text-gray-600"}`}
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
          <div className="text-sm text-gray-600 mb-4">
            <strong>Total Students Booked:</strong> {totalStudents}
          </div>
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
