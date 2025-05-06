// import React from "react";
// import { BellIcon, WalletIcon, Building2Icon, WrenchIcon, Loader2Icon } from "lucide-react";

// const DashboardContentOwner = () => {
//   return (
//     <div className="p-4 space-y-6">
//       {/* Top Alert */}
//       <div className="flex items-center bg-yellow-50 border border-yellow-400 text-yellow-800 p-4 rounded-lg">
//         <BellIcon className="w-4 h-4 mr-2" />
//         <span>You have 2 new service requests and 3 pending bookings</span>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div className="bg-white rounded-xl shadow p-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-500">Total Revenue</p>
//               <h2 className="text-xl font-bold">₹1,45,000</h2>
//               <p className="text-green-600 text-sm mt-1">↑ 12% from last month</p>
//             </div>
//             <WalletIcon className="w-6 h-6 text-gray-400" />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-500">Rooms Available</p>
//               <h2 className="text-xl font-bold">8</h2>
//               <p className="text-gray-400 text-sm mt-1">Out of 20 total rooms</p>
//             </div>
//             <Building2Icon className="w-6 h-6 text-gray-400" />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-500">Service Requests</p>
//               <h2 className="text-xl font-bold">5</h2>
//               <div className="mt-2 space-x-2">
//                 <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">3 Pending</span>
//                 <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">2 Completed</span>
//               </div>
//             </div>
//             <WrenchIcon className="w-6 h-6 text-gray-400" />
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-xl shadow p-4">
//         <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-2">
//               <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
//                 <Loader2Icon className="w-4 h-4" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium">New Booking Request</p>
//                 <p className="text-xs text-gray-500">Room 203 – Double Sharing</p>
//               </div>
//             </div>
//             <span className="text-xs text-gray-400">2 hours ago</span>
//           </div>

//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-2">
//               <div className="bg-green-100 text-green-800 p-2 rounded-full">
//                 <WalletIcon className="w-4 h-4" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Payment Received</p>
//                 <p className="text-xs text-gray-500">₹12,000 – Room 105</p>
//               </div>
//             </div>
//             <span className="text-xs text-gray-400">5 hours ago</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardContentOwner;
import React from "react";
import {
  BellIcon,
  WalletIcon,
  Building2Icon,
  WrenchIcon,
  Loader2Icon,
  XCircleIcon,
  CheckCircleIcon,
  HourglassIcon,
} from "lucide-react";
import DashboardCharts from "./DashboardCharts";

const DashboardContentOwner = ({ stats, recentActivity }) => {
  if (!stats) {
    // Skeleton UI while loading
    return (
      <div className="p-4 space-y-6 animate-pulse">
        <div className="h-10 bg-yellow-100 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-28 bg-white rounded-xl shadow p-4" />
          <div className="h-28 bg-white rounded-xl shadow p-4" />
          <div className="h-28 bg-white rounded-xl shadow p-4" />
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="h-6 w-1/4 bg-gray-200 mb-4 rounded" />
          <div className="divide-y divide-gray-200">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 p-2 rounded-full w-8 h-8" />
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Top Alert */}
      <div className="flex items-center bg-yellow-50 border border-yellow-400 text-yellow-800 p-4 rounded-lg">
        <BellIcon className="w-4 h-4 mr-2" />
        <span>
          You have {stats.serviceRequests.pending} new service requests and {stats.pendingBookings} pending bookings
        </span>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h2 className="text-xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h2>
              <p className="text-green-600 text-sm mt-1">↑ {stats.revenueChangePercent}% from last month</p>
            </div>
            <WalletIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Rooms Available</p>
              <h2 className="text-xl font-bold">{stats.roomsAvailable}</h2>
              <p className="text-gray-400 text-sm mt-1">Out of {stats.totalRooms} total rooms</p>
            </div>
            <Building2Icon className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Service Requests</p>
              <h2 className="text-xl font-bold">{stats.serviceRequests.total}</h2>
              <div className="mt-2 space-x-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  {stats.serviceRequests.pending} Pending
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {stats.serviceRequests.completed} Completed
                </span>
              </div>
            </div>
            <WrenchIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

    <DashboardCharts/>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="divide-y divide-gray-200">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => {
              let Icon = Loader2Icon;
              if (activity.type === "booking_request") Icon = HourglassIcon;
              else if (activity.type === "booking_confirmed") Icon = CheckCircleIcon;
              else if (activity.type === "booking_rejected") Icon = XCircleIcon;
              else if (activity.type === "payment_received") Icon = WalletIcon;
              else if (activity.type === "maintenance_new") Icon = WrenchIcon;
              else if (activity.type === "maintenance_resolved") Icon = CheckCircleIcon;
              else if (activity.type === "maintenance_cancelled") Icon = XCircleIcon;

              return (
                <div key={index} className="flex justify-between items-center py-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContentOwner;
