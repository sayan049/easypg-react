"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts"

import { baseurl } from "../constant/urls"

// Mock data for preview
// const MOCK_DATA = {
//   weekly: {
//     bookings: [
//       { label: "Apr", pending: 75, confirmed: 85, rejected: 65 },
//       { label: "May", pending: 65, confirmed: 90, rejected: 55 },
//       { label: "Jun", pending: 55, confirmed: 75, rejected: 40 },
//       { label: "Jul", pending: 50, confirmed: 80, rejected: 45 },
//       { label: "Aug", pending: 65, confirmed: 75, rejected: 50 },
//       { label: "Sep", pending: 70, confirmed: 70, rejected: 35 },
//       { label: "Oct", pending: 55, confirmed: 45, rejected: 25 },
//       { label: "Nov", pending: 60, confirmed: 70, rejected: 40 },
//       { label: "Dec", pending: 65, confirmed: 55, rejected: 30 },
//       { label: "Jan", pending: 50, confirmed: 75, rejected: 45 },
//       { label: "Feb", pending: 35, confirmed: 65, rejected: 50 },
//     ],
//     metrics: {
//       totalBookings: 720,
//       totalStudents: 450,
//       totalRevenue: 125000,
//     },
//   },
//   monthly: {
//     bookings: [
//       { label: "Apr", pending: 75, confirmed: 85, rejected: 65 },
//       { label: "May", pending: 65, confirmed: 90, rejected: 55 },
//       { label: "Jun", pending: 55, confirmed: 75, rejected: 40 },
//       { label: "Jul", pending: 50, confirmed: 80, rejected: 45 },
//       { label: "Aug", pending: 65, confirmed: 75, rejected: 50 },
//       { label: "Sep", pending: 70, confirmed: 70, rejected: 35 },
//       { label: "Oct", pending: 55, confirmed: 45, rejected: 25 },
//       { label: "Nov", pending: 60, confirmed: 70, rejected: 40 },
//       { label: "Dec", pending: 65, confirmed: 55, rejected: 30 },
//       { label: "Jan", pending: 50, confirmed: 75, rejected: 45 },
//       { label: "Feb", pending: 35, confirmed: 65, rejected: 50 },
//     ],
//     metrics: {
//       totalBookings: 1800,
//       totalStudents: 950,
//       totalRevenue: 320000,
//     },
//   },
//   yearly: {
//     bookings: [
//       { label: "Apr", pending: 75, confirmed: 85, rejected: 65 },
//       { label: "May", pending: 65, confirmed: 90, rejected: 55 },
//       { label: "Jun", pending: 55, confirmed: 75, rejected: 40 },
//       { label: "Jul", pending: 50, confirmed: 80, rejected: 45 },
//       { label: "Aug", pending: 65, confirmed: 75, rejected: 50 },
//       { label: "Sep", pending: 70, confirmed: 70, rejected: 35 },
//       { label: "Oct", pending: 55, confirmed: 45, rejected: 25 },
//       { label: "Nov", pending: 60, confirmed: 70, rejected: 40 },
//       { label: "Dec", pending: 65, confirmed: 55, rejected: 30 },
//       { label: "Jan", pending: 50, confirmed: 75, rejected: 45 },
//       { label: "Feb", pending: 35, confirmed: 65, rejected: 50 },
//     ],
//     metrics: {
//       totalBookings: 8050,
//       totalStudents: 3200,
//       totalRevenue: 1450000,
//     },
//   },
// }

const DashboardCharts = () => {
  const [activeTab, setActiveTab] = useState("bookings")
  const [timeFrame, setTimeFrame] = useState("weekly")
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // In a real implementation, you would fetch data from your API
  // This is commented out to avoid the import error

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        setError(null)
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) return setError("Access token not found.")

        // Replace with your actual API endpoint

        const response = await fetch(`${baseurl}/auth/owner/chart-stats?timeFrame=${timeFrame}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const data = await response.json()
        setChartData(data)
      } catch (error) {
        setError("Error loading chart data.")
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [timeFrame])

  // Extract data with proper fallbacks
  const timeframeData = chartData?.[timeFrame] || {}
  const bookingsData = timeframeData.bookings || []
  const metrics = timeframeData.metrics || {}
  const { totalBookings = 0, totalStudents = 0, totalRevenue = 0 } = metrics

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="text-red-500 p-4">{error}</div>

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
                activeTab === tab ? "bg-white shadow-sm text-[#2CA4B5]" : "text-gray-500 hover:bg-gray-50"
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
                timeFrame === frame ? "bg-[#2CA4B5] text-white" : "text-gray-500 hover:bg-gray-50"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
          const total = bookingsData.reduce((acc, cur) => acc + (cur[key] || 0), 0)
          const percentage = totalBookings > 0 ? (total / totalBookings) * 100 : 0
          const colors = {
            pending: { bg: "bg-amber-100", fill: "bg-amber-400" },
            confirmed: { bg: "bg-emerald-100", fill: "bg-emerald-400" },
            rejected: { bg: "bg-rose-100", fill: "bg-rose-400" },
          }

          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="capitalize">{key}</span>
                <span>
                  {total}
                  <span className="text-gray-400 ml-2">({Math.round(percentage)}%)</span>
                </span>
              </div>
              <div className={`h-3 w-full ${colors[key].bg} rounded-full overflow-hidden`}>
                <div
                  className={`${colors[key].fill} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      {activeTab === "bookings" && (
  <div className="relative p-5 rounded-2xl 
    bg-gradient-to-br from-[#2CA4B5]/10 via-[#ffffff]/5 to-[#4ECDC4]/10 
    border border-[#2CA4B5]/20 
    backdrop-blur-lg 
    shadow-[0_8px_32px_rgba(44,164,181,0.1)]
    transition-all duration-300
    hover:shadow-[0_8px_32px_rgba(44,164,181,0.2)]
    hover:border-[#2CA4B5]/30">
    
    {/* Geometric pattern background */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#2CA4B5]/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#4ECDC4]/10 rounded-full blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
    </div>

    {/* Content */}
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-[#2CA4B5] rounded-lg backdrop-blur-sm border border-white/10">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">PG Booking Trends</h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart 
          data={bookingsData} 
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
              <CartesianGrid horizontal={true} vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                width={40}
                domain={[0, 10]}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value, name) => [`${value}`, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="capitalize text-sm text-gray-600">{value}</span>}
              />
              {/* Background histogram bars */}
              {bookingsData.map((entry, index) => (
                <rect
                  key={`bar-${index}`}
                  x={40 + index * ((100 - 40) / bookingsData.length)}
                  y={50}
                  width={10}
                  height={220}
                  fill="#f3f4f6"
                  fillOpacity={0.5}
                />
              ))}
              <Line
                type="natural"
                dataKey="confirmed"
                stroke="#4ECDC4"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#4ECDC4",
                  stroke: "white",
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
              />
              <Line
                type="natural"
                dataKey="pending"
                stroke="#1A535C"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#1A535C",
                  stroke: "white",
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
              />
              <Line
                type="natural"
                dataKey="rejected"
                stroke="#FFD166"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#FFD166",
                  stroke: "white",
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
              />
           </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
      {/* Revenue Card - Enhanced */}
{activeTab === "revenue" && (
  <div className="relative h-60 rounded-2xl 
    bg-gradient-to-br from-[#2CA4B5]/10 via-[#ffffff]/5 to-[#4ECDC4]/10 
    border border-[#2CA4B5]/20 
    backdrop-blur-lg 
    shadow-[0_8px_32px_rgba(44,164,181,0.1)]
    overflow-hidden">
    
    {/* Animated background elements */}
    <div className="absolute inset-0">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#2CA4B5]/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#4ECDC4]/10 rounded-full blur-2xl animate-pulse"></div>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
      <div className="p-4 bg-white/30 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
        <svg className="w-8 h-8 text-[#2CA4B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="text-gray-600 font-medium backdrop-blur-sm px-4 py-2 rounded-lg bg-white/30">
        Revenue Analytics Coming Soon
      </div>
      <p className="text-sm text-gray-500 text-center px-8 backdrop-blur-sm bg-white/30 py-1 rounded">
        We're working on bringing you detailed revenue insights with beautiful visualizations.
      </p>
    </div>
  </div>
)}
    </div>
  )
}

export default DashboardCharts
