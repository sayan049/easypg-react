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

  // Extract data with proper fallbacks
  const timeframeData = chartData?.[timeFrame] || {};
  const bookingsData = timeframeData.bookings || [];
  const metrics = timeframeData.metrics || {};
  const {
    totalBookings = 0,
    totalStudents = 0,
    totalRevenue = 0
  } = metrics;

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header: Tabs + TimeFrame */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {["bookings", "revenue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white shadow-sm text-[#2CA4B5]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {["weekly", "monthly", "yearly"].map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-4 py-2 rounded-lg text-xs font-medium ${
                timeFrame === frame
                  ? "bg-[#2CA4B5] text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Bookings</div>
              <div className="text-2xl font-bold text-gray-800">{totalBookings}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Students</div>
              <div className="text-2xl font-bold text-gray-800">{totalStudents}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Revenue</div>
              <div className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Health Progress */}
      <div className="space-y-4 p-5 bg-gray-50 rounded-2xl">
        <div className="text-md font-semibold text-gray-700">Booking Health</div>
        {["pending", "confirmed", "rejected"].map((key) => {
          const total = bookingsData.reduce((acc, cur) => acc + (cur[key] || 0), 0);
          const percentage = totalBookings > 0 ? (total / totalBookings) * 100 : 0;
          const colors = {
            pending: { bg: "bg-amber-100", fill: "bg-amber-400" },
            confirmed: { bg: "bg-emerald-100", fill: "bg-emerald-400" },
            rejected: { bg: "bg-rose-100", fill: "bg-rose-400" }
          };

          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="capitalize">{key}</span>
                <span>
                  {total} 
                  <span className="text-gray-400 ml-2">
                    ({Math.round(percentage)}%)
                  </span>
                </span>
              </div>
              <div className={`h-3 w-full ${colors[key].bg} rounded-full overflow-hidden`}>
                <div 
                  className={`${colors[key].fill} h-full rounded-full transition-all duration-500`} 
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      {activeTab === "bookings" && (
        <div className="bg-gray-50 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-[#2CA4B5] rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">PG Booking Trends</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={bookingsData} barCategoryGap={12} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="label" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                cursor={false}
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  name === 'revenue' ? `₹${value}` : value,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="capitalize text-sm text-gray-600">{value}</span>
                )}
              />

              <Bar 
                dataKey="pending" 
                stackId="a" 
                fill="url(#colorPending)" 
                radius={[6, 6, 0, 0]}
                animationDuration={400}
              />
              <Bar 
                dataKey="confirmed" 
                stackId="a" 
                fill="url(#colorConfirmed)" 
                radius={[6, 6, 0, 0]}
                animationDuration={400}
              />
              <Bar 
                dataKey="rejected" 
                stackId="a" 
                fill="url(#colorRejected)" 
                radius={[6, 6, 0, 0]}
                animationDuration={400}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "revenue" && (
        <div className="h-60 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-white rounded-full shadow-lg">
            <svg className="w-8 h-8 text-[#2CA4B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-gray-500 font-medium">Revenue Analytics Coming Soon</div>
          <p className="text-sm text-gray-400 text-center px-8">We're working on bringing you detailed revenue insights with beautiful visualizations.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;