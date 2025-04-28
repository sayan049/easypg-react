// import React from "react";
// import { FaRupeeSign, FaBookmark, FaCalendarAlt, FaHome } from "react-icons/fa";
// import { FiAlertCircle } from "react-icons/fi";

// const DashboardContent = ({
//   user,
//   bookings = [],
//   currentStay = [],
//   upcomingStay = [],
//   pastStay = [],
//   stats = {},
//   daysRemaining = 0,
//   totalAmountConfirmed = 0,
//   loading = false,
// }) => {
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }
//   if (!loading && bookings.length === 0) {
//     return (
//       <div className="px-4 py-8 text-center">
//         <div className="bg-white shadow-md rounded-xl p-8 max-w-md mx-auto">
//           <h3 className="text-xl font-semibold mb-4">No Bookings</h3>
//           <p className="text-gray-600 mb-6">
//             You haven't made any bookings yet.
//           </p>
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
//             Browse Accommodations
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       {/* Welcome Message */}
//       <div className="mb-8">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//           Welcome back, {user?.firstName || "Guest"}!
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Your comfort is our priority. Manage your stays efficiently.
//         </p>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <StatCard
//           icon={<FaRupeeSign className="text-2xl text-blue-500" />}
//           label="Total Spent"
//           value={`₹${totalAmountConfirmed || 0}`}
//         />
//         <StatCard
//           icon={<FaBookmark className="text-2xl text-green-500" />}
//           label="Active Bookings"
//           value={stats?.active || 0}
//         />
//         <StatCard
//           icon={<FaCalendarAlt className="text-2xl text-purple-500" />}
//           label="Days Remaining"
//           value={daysRemaining || 0}
//         />
//       </div>

//       {/* Notifications Section */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">
//           Stay Notifications
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {upcomingStay ? (
//             <NotificationCard
//               icon={<FiAlertCircle className="text-blue-500 text-xl" />}
//               title="Upcoming Check-in"
//               description={upcomingStay.pgOwner?.messName || "Unknown PG"}
//               date={`Check-in: ${formatDate(upcomingStay.period?.startDate)}`}
//             />
//           ) : (
//             <NotificationCard
//               icon={<FiAlertCircle className="text-gray-400 text-xl" />}
//               title="No Upcoming Stay"
//               description="You have no upcoming bookings."
//               date=""
//             />
//           )}

//           {currentStay ? (
//             <NotificationCard
//               icon={<FiAlertCircle className="text-yellow-500 text-xl" />}
//               title="Ongoing Stay"
//               description={currentStay.pgOwner?.messName || "Unknown PG"}
//               date={`Ends: ${formatDate(currentStay.period?.endDate)}`}
//             />
//           ) : (
//             <NotificationCard
//               icon={<FiAlertCircle className="text-gray-400 text-xl" />}
//               title="No Current Stay"
//               description="You are not checked-in to any stay."
//               date=""
//             />
//           )}
//         </div>
//       </div>

//       {/* Upcoming PGs Section */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">
//           Upcoming PGs
//         </h2>
//         {upcomingStay ? (
//           <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
//             <div>
//               <h3 className="text-gray-800 font-semibold">
//                 {upcomingStay.pgOwner?.messName}
//               </h3>
//               <p className="text-gray-500 text-sm">
//                 {upcomingStay.room?.roomType || "Room"} - Beds Booked:{" "}
//                 {upcomingStay.bedsBooked?.length || 0}
//               </p>
//               <p className="text-gray-400 text-xs mt-1">
//                 {formatDate(upcomingStay.period?.startDate)} –{" "}
//                 {formatDate(upcomingStay.period?.endDate)}
//               </p>
//             </div>
//             <div className="flex flex-col md:items-end mt-4 md:mt-0">
//               <p className="font-bold text-gray-800 mb-2">
//                 ₹{upcomingStay.pricePerHead || "N/A"}/month
//               </p>
//               <div className="flex gap-2">
//                 <button className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50">
//                   Cancel
//                 </button>
//                 <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
//                   Extend Stay
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-500">No upcoming PG stays booked yet.</p>
//         )}
//       </div>

//       {/* Maintenance Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Create Maintenance Request */}
//         <div>
//           <h2 className="text-lg font-semibold mb-4 text-gray-700">
//             Create Maintenance Request
//           </h2>
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Issue Title
//               </label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Enter issue title"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 rows="4"
//                 className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Describe the issue"
//               ></textarea>
//             </div>
//             <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
//               Submit Request
//             </button>
//           </div>
//         </div>

//         {/* Maintenance History */}
//         <div>
//           <h2 className="text-lg font-semibold mb-4 text-gray-700">
//             Maintenance History
//           </h2>
//           <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
//             <MaintenanceItem
//               title="Plumbing Issue"
//               date="Reported on Feb 15, 2025"
//               status="In Progress"
//               statusColor="bg-yellow-400"
//             />
//             <MaintenanceItem
//               title="Electrical Repair"
//               date="Reported on Feb 10, 2025"
//               status="Resolved"
//               statusColor="bg-green-400"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function StatCard({ icon, label, value }) {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
//       <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
//       <div>
//         <p className="text-gray-500 text-sm">{label}</p>
//         <p className="font-bold text-xl">{value}</p>
//       </div>
//     </div>
//   );
// }

// function NotificationCard({ icon, title, description, date }) {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md flex gap-4 items-center">
//       <div>{icon}</div>
//       <div>
//         <h3 className="font-semibold text-gray-800">{title}</h3>
//         <p className="text-sm text-gray-500">{description}</p>
//         {date && <p className="text-xs text-gray-400">{date}</p>}
//       </div>
//     </div>
//   );
// }

// function MaintenanceItem({ title, date, status, statusColor }) {
//   return (
//     <div className="flex justify-between items-center">
//       <div>
//         <h4 className="font-semibold text-gray-800">{title}</h4>
//         <p className="text-xs text-gray-400">{date}</p>
//       </div>
//       <span
//         className={`text-xs text-white px-2 py-1 rounded-full ${statusColor}`}
//       >
//         {status}
//       </span>
//     </div>
//   );
// }

// // helper: format date
// function formatDate(dateString) {
//   if (!dateString) return "N/A";
//   const options = { year: "numeric", month: "short", day: "numeric" };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// }

// export default DashboardContent;
// import React from "react";
// import {
//   FaRupeeSign,
//   FaBookmark,
//   FaCalendarAlt,
//   FaHome,
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaBed,
//   FaWifi,
//   FaParking,
//   FaUtensils,
//   FaTv,
//   FaSnowflake,
//   FaBroom,
//   FaSwimmingPool
// } from "react-icons/fa";
// import { FiAlertCircle } from "react-icons/fi";

// const DashboardContent = ({
//   user,
//   bookings = [],
//   currentStay = [],
//   upcomingStay = [],
//   pastStay = [],
//   stats = {},
//   daysRemaining = 0,
//   totalAmountConfirmed = 0,
//   loading = false,
// }) => {
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }
//   if (!loading && bookings.length === 0) {
//     return (
//       <div className="px-4 py-8 text-center">
//         <div className="bg-white shadow-md rounded-xl p-8 max-w-md mx-auto">
//           <h3 className="text-xl font-semibold mb-4">No Bookings</h3>
//           <p className="text-gray-600 mb-6">
//             You haven't made any bookings yet.
//           </p>
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
//             Browse Accommodations
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       {/* Welcome Message */}
//       <div className="mb-8">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//           Welcome back, {user?.firstName || "Guest"}!
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Your comfort is our priority. Manage your stays efficiently.
//         </p>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <StatCard
//           icon={<FaRupeeSign className="text-2xl text-blue-500" />}
//           label="Total Spent"
//           value={`₹${totalAmountConfirmed || 0}`}
//         />
//         <StatCard
//           icon={<FaBookmark className="text-2xl text-green-500" />}
//           label="Active Bookings"
//           value={stats?.active || 0}
//         />
//         <StatCard
//           icon={<FaCalendarAlt className="text-2xl text-purple-500" />}
//           label="Days Remaining"
//           value={daysRemaining || 0}
//         />
//       </div>

//       {/* Notifications Section */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">
//           Stay Notifications
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {upcomingStay.length > 0 ? (
//             upcomingStay.map((stay, index) => (
//               <NotificationCard
//                 key={index}
//                 icon={<FiAlertCircle className="text-blue-500 text-xl" />}
//                 title={`Upcoming Check-in #${index + 1}`}
//                 description={stay.pgOwner?.messName || "Unknown PG"}
//                 date={`Check-in: ${formatDate(stay.period?.startDate)}`}
//               />
//             ))
//           ) : (
//             <NotificationCard
//               icon={<FiAlertCircle className="text-gray-400 text-xl" />}
//               title="No Upcoming Stay"
//               description="You have no upcoming bookings."
//               date=""
//             />
//           )}

//           {currentStay.length > 0 ? (
//             currentStay.map((stay, index) => (
//               <NotificationCard
//                 key={index}
//                 icon={<FiAlertCircle className="text-yellow-500 text-xl" />}
//                 title={`Ongoing Stay #${index + 1}`}
//                 description={stay.pgOwner?.messName || "Unknown PG"}
//                 date={`Ends: ${formatDate(stay.period?.endDate)}`}
//               />
//             ))
//           ) : (
//             <NotificationCard
//               icon={<FiAlertCircle className="text-gray-400 text-xl" />}
//               title="No Current Stay"
//               description="You are not checked-in to any stay."
//               date=""
//             />
//           )}
//         </div>
//       </div>

//       {/* Current Stays Section */}
//       {currentStay.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold mb-4 text-gray-700">
//             Current Stays ({currentStay.length})
//           </h2>
//           <div className="space-y-4">
//             {currentStay.map((stay, index) => (
//               <StayCard key={index} stay={stay} type="current" />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Upcoming Stays Section */}
//       {upcomingStay.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold mb-4 text-gray-700">
//             Upcoming Stays ({upcomingStay.length})
//           </h2>
//           <div className="space-y-4">
//             {upcomingStay.map((stay, index) => (
//               <StayCard key={index} stay={stay} type="upcoming" />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Past Stays Section */}
//       {pastStay.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold mb-4 text-gray-700">
//             Past Stays ({pastStay.length})
//           </h2>
//           <div className="space-y-4">
//             {pastStay.map((stay, index) => (
//               <StayCard key={index} stay={stay} type="past" />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Maintenance Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Create Maintenance Request */}
//         <div>
//           <h2 className="text-lg font-semibold mb-4 text-gray-700">
//             Create Maintenance Request
//           </h2>
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Issue Title
//               </label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Enter issue title"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 rows="4"
//                 className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Describe the issue"
//               ></textarea>
//             </div>
//             <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
//               Submit Request
//             </button>
//           </div>
//         </div>

//         {/* Maintenance History */}
//         <div>
//           <h2 className="text-lg font-semibold mb-4 text-gray-700">
//             Maintenance History
//           </h2>
//           <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
//             <MaintenanceItem
//               title="Plumbing Issue"
//               date="Reported on Feb 15, 2025"
//               status="In Progress"
//               statusColor="bg-yellow-400"
//             />
//             <MaintenanceItem
//               title="Electrical Repair"
//               date="Reported on Feb 10, 2025"
//               status="Resolved"
//               statusColor="bg-green-400"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // New StayCard component to display detailed stay information
// function StayCard({ stay, type }) {
//   const bgColor = {
//     current: "bg-blue-50",
//     upcoming: "bg-green-50",
//     past: "bg-gray-50"
//   }[type];

//   const borderColor = {
//     current: "border-blue-200",
//     upcoming: "border-green-200",
//     past: "border-gray-200"
//   }[type];

//   return (
//     <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${borderColor}`}>
//       <div className="flex flex-col md:flex-row justify-between gap-6">
//         {/* PG Details */}
//         <div className="flex-1">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <FaHome className="text-blue-600 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {stay.pgOwner?.messName || "Unknown PG"}
//               </h3>
//               <p className="text-gray-500">{stay.room?.roomType || "Room"}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Owner Info */}
//             <div className="space-y-2">
//               <h4 className="font-medium text-gray-700 flex items-center gap-2">
//                 <FaUser className="text-gray-500" /> Owner Details
//               </h4>
//               <p className="text-sm text-gray-600">
//                 {stay.pgOwner?.firstName} {stay.pgOwner?.lastName}
//               </p>
//               <p className="text-sm text-gray-600 flex items-center gap-2">
//                 <FaEnvelope className="text-gray-400" /> {stay.pgOwner?.email}
//               </p>
//               <p className="text-sm text-gray-600 flex items-center gap-2">
//                 <FaPhone className="text-gray-400" /> {stay.pgOwner?.mobileNo}
//               </p>
//             </div>

//             {/* Address */}
//             <div className="space-y-2">
//               <h4 className="font-medium text-gray-700 flex items-center gap-2">
//                 <FaMapMarkerAlt className="text-gray-500" /> Address
//               </h4>
//               <p className="text-sm text-gray-600">{stay.pgOwner?.address}</p>
//             </div>

//             {/* Room Info */}
//             <div className="space-y-2">
//               <h4 className="font-medium text-gray-700 flex items-center gap-2">
//                 <FaBed className="text-gray-500" /> Room Details
//               </h4>
//               <p className="text-sm text-gray-600">
//                 Beds Booked: {stay.bedsBooked?.length || 0}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Price: ₹{stay.pricePerHead}/month
//               </p>
//             </div>

//             {/* Dates */}
//             <div className="space-y-2">
//               <h4 className="font-medium text-gray-700 flex items-center gap-2">
//                 <FaCalendarAlt className="text-gray-500" /> Stay Period
//               </h4>
//               <p className="text-sm text-gray-600">
//                 {formatDate(stay.period?.startDate)} - {formatDate(stay.period?.endDate)}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Duration: {stay.period?.durationMonths} months
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Amenities */}
//         {stay.pgOwner?.facility && (
//           <div className="md:w-1/3">
//             <h4 className="font-medium text-gray-700 mb-3">Amenities</h4>
//             <div className="grid grid-cols-2 gap-3">
//               {stay.pgOwner.facility.includes("A/C") && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <FaWifi className="text-green-500" /> A/C
//                 </div>
//               )}
//               {stay.pgOwner.facility.includes("TV") && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <FaParking className="text-green-500" /> TV
//                 </div>
//               )}
//               {stay.pgOwner.facility.includes("Power Backup") && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <FaUtensils className="text-green-500" /> Power Backup
//                 </div>
//               )}
//               {stay.pgOwner.facility.includes("WiFi") && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <FaTv className="text-green-500" /> WiFi
//                 </div>
//               )}
//               {stay.pgOwner.facility.includes("Kitchen") && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <FaSnowflake className="text-green-500" /> Kitchen
//                 </div>
//               )}
//               {stay.pgOwner.facility.includes("Tank Water") && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <FaBroom className="text-green-500" /> Tank Water
//                 </div>
//               )}
//               {stay.pgOwner.facility.includes("Double Bed") && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <FaSwimmingPool className="text-green-500" /> Double Bed
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-3 mt-6">
//         {type === 'upcoming' && (
//           <>
//             <button className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50">
//               Cancel
//             </button>
//             <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
//               Extend Stay
//             </button>
//           </>
//         )}
//         {type === 'current' && (
//           <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
//             Request Maintenance
//           </button>
//         )}
//         {type === 'past' && (
//           <button className="px-4 py-2 text-sm border border-gray-500 text-gray-500 rounded-md hover:bg-gray-50">
//             Book Again
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// function StatCard({ icon, label, value }) {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
//       <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
//       <div>
//         <p className="text-gray-500 text-sm">{label}</p>
//         <p className="font-bold text-xl">{value}</p>
//       </div>
//     </div>
//   );
// }

// function NotificationCard({ icon, title, description, date }) {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md flex gap-4 items-center">
//       <div>{icon}</div>
//       <div>
//         <h3 className="font-semibold text-gray-800">{title}</h3>
//         <p className="text-sm text-gray-500">{description}</p>
//         {date && <p className="text-xs text-gray-400">{date}</p>}
//       </div>
//     </div>
//   );
// }

// function MaintenanceItem({ title, date, status, statusColor }) {
//   return (
//     <div className="flex justify-between items-center">
//       <div>
//         <h4 className="font-semibold text-gray-800">{title}</h4>
//         <p className="text-xs text-gray-400">{date}</p>
//       </div>
//       <span
//         className={`text-xs text-white px-2 py-1 rounded-full ${statusColor}`}
//       >
//         {status}
//       </span>
//     </div>
//   );
// }

// // helper: format date
// function formatDate(dateString) {
//   if (!dateString) return "N/A";
//   const options = { year: "numeric", month: "short", day: "numeric" };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// }

// export default DashboardContent;
import React, { useState, useEffect } from "react";
import {
  FaRupeeSign,
  FaBookmark,
  FaCalendarAlt,
  FaHome,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBed,
  FaWifi,
  FaParking,
  FaUtensils,
  FaTv,
  FaSnowflake,
  FaBroom,
  FaSwimmingPool,
  FaFemale,
  FaMale,
} from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseurl } from "../constant/urls";
import {
  MdOutlineAcUnit,
  MdTv,
  MdOutlinePower,
  MdOutlineWifi,
  MdOutlineKitchen,
  MdOpacity,
  MdBed,
  MdKitchen,
} from "react-icons/md";

const DashboardContent = ({
  user,
  bookings = [],
  upcomingStay = [],
  currentStay = [],
  pastStay = [],
  stats = {},
  daysRemaining = 0,
  totalAmountConfirmed = 0,
  loading = false,
}) => {
  const [selectedStayId, setSelectedStayId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true); // Start submitting process

    const selectedStay = currentStay.find(
      (stay) => stay._id === selectedStayId
    );

    if (!selectedStay) {
      alert("Please select a valid stay.");
      setIsSubmitting(false); // Stop loading
      return;
    }
    console.log("Selected Stay:", selectedStay);
    console.log("User ID:", user._id);
    console.log("Selected Stay Student ID:", selectedStay.student._id);
    // Now student is an object, so we check selectedStay.student._id
    if (selectedStay.student?._id?.toString() !== user._id.toString()) {
      alert("You can only submit a maintenance request for your own stay.");
      setIsSubmitting(false);
      return;
    }

    const studentId = selectedStay.student._id; // From the selected stay
    const bookingId = selectedStay._id; // The current stay _id is your booking id
    const pgOwnerId = selectedStay.pgOwner._id; // The PG owner's id
    if (!title || !description || !pgOwnerId) {
      alert("Please fill in all fields.");
      setIsSubmitting(false); // Stop loading
      return;
    }

    const requestBody = {
      studentId,
      bookingId,
      pgOwnerId,
      title,
      description,
    };

    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${baseurl}/auth/maintenance-request`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Maintenance request submitted successfully!");
      console.log("Response:", response.data);
      // Optionally, reset form fields
      setTitle("");
      setDescription("");
      setSelectedStayId("");
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      alert("There was an error submitting the request. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop loading after submission attempt
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!loading && bookings.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4">No Bookings</h3>
          <p className="text-gray-600 mb-6">
            You haven't made any bookings yet.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Browse Accommodations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }} // Ensure it's above other elements
      />
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, {user?.firstName || "Guest"}!
        </h1>
        <p className="text-gray-500 mt-2">
          Your comfort is our priority. Manage your stays efficiently.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<FaRupeeSign className="text-2xl text-blue-500" />}
          label="Total Spent"
          value={`₹${totalAmountConfirmed || 0}`}
        />
        <StatCard
          icon={<FaBookmark className="text-2xl text-green-500" />}
          label="Active Bookings"
          value={stats?.active || 0}
        />
        <StatCard
          icon={<FaCalendarAlt className="text-2xl text-purple-500" />}
          label="Days Remaining"
          value={daysRemaining || 0}
        />
      </div>

      {/* Notifications Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Stay Notifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingStay.length > 0 ? (
            upcomingStay.map((stay, index) => (
              <NotificationCard
                key={index}
                icon={<FiAlertCircle className="text-blue-500 text-xl" />}
                title={`Upcoming Check-in #${index + 1}`}
                description={stay.pgOwner?.messName || "Unknown PG"}
                date={`Check-in: ${formatDate(stay.period?.startDate)}`}
              />
            ))
          ) : (
            <NotificationCard
              icon={<FiAlertCircle className="text-gray-400 text-xl" />}
              title="No Upcoming Stay"
              description="You have no upcoming bookings."
              date=""
            />
          )}
        </div>
      </div>

      {/* Upcoming Stays Section - Enhanced UI */}
      {upcomingStay.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Upcoming Stays ({upcomingStay.length})
          </h2>
          <div className="space-y-6">
            {upcomingStay.map((stay, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Header with PG name and status */}
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaHome className="text-blue-600" />
                        {stay.pgOwner?.messName || "PG Name Not Available"}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        Upcoming Stay • Check-in:{" "}
                        {formatDate(stay.period?.startDate)}
                      </p>
                    </div>
                    <span className="text-green-700 bg-green-100 text-xs px-3 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>
                </div>

                {/* PG Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Owner Information */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FaUser className="text-gray-500" /> Owner Details
                      </h4>
                      <div className="space-y-2 pl-6">
                        <p className="text-sm text-gray-600">
                          {stay.pgOwner?.firstName} {stay.pgOwner?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" />{" "}
                          {stay.pgOwner?.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaPhone className="text-gray-400" />{" "}
                          {stay.pgOwner?.mobileNo}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" /> Address
                      </h4>
                      <p className="text-sm text-gray-600 pl-6">
                        {stay.pgOwner?.address}
                      </p>
                    </div>
                  </div>

                  {/* Stay Information */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FaBed className="text-gray-500" /> Room Details
                      </h4>

                      <div className="space-y-2 pl-6">
                        {/* PG Type with Gender */}
                        <p className="flex items-center gap-2 text-sm">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-white transition-colors duration-300 ${
                              stay.pgOwner?.gender === "Girls PG"
                                ? "bg-pink-500"
                                : ""
                            } ${
                              stay.pgOwner?.gender === "Boys PG"
                                ? "bg-blue-500"
                                : ""
                            } ${
                              stay.pgOwner?.gender === "Coed PG"
                                ? "bg-green-500"
                                : ""
                            }
                              `}
                          >
                            {stay.pgOwner?.gender === "Girls PG" && (
                              <FaFemale className="text-xs" />
                            )}
                            {stay.pgOwner?.gender === "Boys PG" && (
                              <FaMale className="text-xs" />
                            )}
                            {stay.pgOwner?.gender === "Coed PG" && (
                              <FaUser className="text-xs" />
                            )}
                            {stay.pgOwner?.gender || "Not specified"}
                          </span>
                        </p>

                        {/* Room Information */}
                        <p className="text-sm text-gray-600">
                          <strong>Room:</strong> {stay.room || "Not specified"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Beds Booked:</strong> {stay.bedsBooked || 0}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Price:</strong> ₹{stay.pricePerHead || 0}
                          /month
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-500" /> Stay Period
                      </h4>
                      <div className="space-y-2 pl-6">
                        <p className="text-sm text-gray-600">
                          {formatDate(stay.period?.startDate)} -{" "}
                          {formatDate(stay.period?.endDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {stay.period?.durationMonths} months
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: ₹{stay.payment?.totalAmount || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  {stay.pgOwner?.facility && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {stay.pgOwner.facility.includes("A/C") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdOutlineAcUnit className="text-blue-500" /> A/C
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("TV") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdTv className="text-blue-500" /> TV
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("Power Backup") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdOutlinePower className="text-blue-500" /> Power
                            Backup
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("WiFi") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdOutlineWifi className="text-blue-500" /> WiFi
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("Kitchen") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdOutlineKitchen className="text-blue-500" />{" "}
                            Kitchen
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("Tank Water") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdOpacity className="text-blue-500" /> Tank Water
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("Double Bed") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdBed className="text-blue-500" /> Double Bed
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50">
                      Cancel Booking
                    </button>
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Contact Owner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Stays Section */}
      {pastStay.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Past Stays ({pastStay.length})
          </h2>
          <div className="space-y-4">
            {pastStay.map((stay, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-200"
              >
                <div className="flex flex-col md:flex-row  gap-6">
                  {/* PG Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <FaHome className="text-gray-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {stay.pgOwner?.messName || "Unknown PG"}
                        </h3>
                        <p className="text-gray-500">{stay.room || "Room"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Owner Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <FaUser className="text-gray-500" /> Owner Details
                        </h4>
                        <p className="text-sm text-gray-600">
                          {stay.pgOwner?.firstName} {stay.pgOwner?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" />{" "}
                          {stay.pgOwner?.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaPhone className="text-gray-400" />{" "}
                          {stay.pgOwner?.mobileNo}
                        </p>
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-500" /> Address
                        </h4>
                        <p className="text-sm text-gray-600">
                          {stay.pgOwner?.address}
                        </p>
                      </div>

                      {/* Room Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <FaBed className="text-gray-500" /> Room Details
                        </h4>
                        <p className="text-sm text-gray-600">
                          Beds Booked: {stay.bedsBooked?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ₹{stay.pricePerHead}/month
                        </p>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-500" /> Stay
                          Period
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(stay.period?.startDate)} -{" "}
                          {formatDate(stay.period?.endDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {stay.period?.durationMonths} months
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  {stay.pgOwner?.facility && (
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {stay.pgOwner.facility.includes("A/C") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdOutlineAcUnit className="text-blue-500" /> A/C
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("TV") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdTv className="text-blue-500" /> TV
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("Power Backup") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdOutlinePower className="text-blue-500" /> Power
                            Backup
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("WiFi") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdOutlineWifi className="text-blue-500" /> WiFi
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("Kitchen") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdKitchen className="text-blue-500" /> Kitchen
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("Tank Water") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdOpacity className="text-blue-500" /> Tank Water
                          </span>
                        )}
                        {stay.pgOwner.facility.includes("Double Bed") && (
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <MdBed className="text-blue-500" /> Double Bed
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6">
                  <button className="px-4 py-2 text-sm border border-gray-500 text-gray-500 rounded-md hover:bg-gray-50">
                    Book Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-md rounded-xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
              Maintenance Request
            </h2>

            {/* PG Selection */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Select Stay (PG)
              </label>
              <select
                value={selectedStayId}
                onChange={(e) => setSelectedStayId(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 p-3 text-gray-700"
                required
              >
                <option value="">-- Select a Stay --</option>
                {currentStay.map((stay) => (
                  <option key={stay._id} value={stay._id}>
                    {stay.pgOwner?.messName} | {stay.pgOwner?.firstName}{" "}
                    {stay.pgOwner?.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* PG Details after selecting */}
            {selectedStayId && (
              <div className="bg-gray-100 rounded-lg p-4 shadow-sm space-y-2">
                {(() => {
                  const selectedStay = currentStay.find(
                    (stay) => stay._id === selectedStayId
                  );
                  if (!selectedStay) return null;
                  return (
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center gap-2">
                        <FaHome className="text-blue-500" />{" "}
                        {selectedStay.pgOwner?.messName}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaUser className="text-blue-500" />{" "}
                        {selectedStay.pgOwner?.firstName}{" "}
                        {selectedStay.pgOwner?.lastName}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500" />{" "}
                        {selectedStay.pgOwner?.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaEnvelope className="text-blue-500" />{" "}
                        {selectedStay.pgOwner?.email}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Issue Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 p-3 text-gray-700"
                placeholder="Short title for the issue (e.g., Water leakage)"
                required
                disabled={!selectedStayId}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Issue Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 p-3 text-gray-700"
                placeholder="Describe the issue in detail..."
                required
                disabled={!selectedStayId}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className={`w-full px-6 py-3 rounded-lg transition text-white font-medium ${
                  selectedStayId
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!selectedStayId || isSubmitting} // also disable while submitting
              >
                {isSubmitting ? "Submitting..." : "Submit Maintenance Request"}
              </button>
            </div>
          </div>
        </form>
        {/* Maintenance History */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Maintenance History
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <MaintenanceItem
              title="Plumbing Issue"
              date="Reported on Feb 15, 2025"
              status="In Progress"
              statusColor="bg-yellow-400"
            />
            <MaintenanceItem
              title="Electrical Repair"
              date="Reported on Feb 10, 2025"
              status="Resolved"
              statusColor="bg-green-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-bold text-xl">{value}</p>
      </div>
    </div>
  );
}

function NotificationCard({ icon, title, description, date }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex gap-4 items-center">
      <div>{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        {date && <p className="text-xs text-gray-400">{date}</p>}
      </div>
    </div>
  );
}

function MaintenanceItem({ title, date, status, statusColor }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
      <span
        className={`text-xs text-white px-2 py-1 rounded-full ${statusColor}`}
      >
        {status}
      </span>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default DashboardContent;
