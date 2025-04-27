// import React, { useState, useEffect } from "react";
// import {
//   BookIcon,
//   ClockIcon,
//   HourglassIcon,
//   CheckCircleIcon,
//   XCircleIcon,
// } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { baseurl } from "../constant/urls";

// const BookingCard = React.memo(({ booking, onConfirm, onReject, loading }) => {
//   const statusColors = {
//     pending: "bg-yellow-100 text-yellow-800",
//     confirmed: "bg-green-100 text-green-800",
//     rejected: "bg-red-100 text-red-800",
//   };

//   const endDate =
//     booking.period?.endDate ||
//     (booking.period?.startDate &&
//       new Date(
//         new Date(booking.period.startDate).setMonth(
//           new Date(booking.period.startDate).getMonth() +
//             (booking.period?.durationMonths || 0)
//         )
//       ));

//   return (
//     <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-4">

//       <div className="flex flex-col gap-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <img
//               src={
//                 booking.student?.avatar ||
//                 `https://i.pravatar.cc/150?u=${booking.student?._id || "user"}`
//               }
//               alt={booking.student?.firstName || "Student"}
//               className="w-10 h-10 rounded-full"
//             />
//             <div>
//               <p className="font-semibold">
//                 {booking.student?.firstName && booking.student?.lastName
//                   ? `${booking.student.firstName} ${booking.student.lastName}`
//                   : "Unknown User"}
//               </p>
//               <p className="text-xs text-gray-500">
//                 #{booking._id?.slice(-6).toUpperCase() || "------"}
//               </p>
//             </div>
//           </div>
//           <span
//             className={`${
//               statusColors[booking.status] || "bg-gray-100 text-gray-800"
//             } text-xs px-2 py-1 rounded-full`}
//           >
//             {(booking.status || "unknown").toUpperCase()}
//           </span>
//         </div>
//         <div className="text-sm space-y-1">
//           <p>
//             <strong>Room:</strong> {booking.room || "N/A"}
//           </p>
//           <p>
//             <strong>Beds:</strong> {booking.bedsBooked || 0} (
//             {booking.originalBedCount || "unknown"} available)
//           </p>
//           <p>
//             <strong>Period:</strong>
//             {booking.period?.startDate
//               ? new Date(booking.period.startDate).toLocaleDateString()
//               : "N/A"}{" "}
//             -{endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
//           </p>
//           <p>
//             <strong>Amount:</strong> ₹
//             {booking.payment?.totalAmount?.toLocaleString() || "0"}
//           </p>
//         </div>
//         {booking.status === "pending" && (
//           <div className="flex gap-2">
//             <button
//               onClick={() => onConfirm(booking._id)}
//               disabled={loading}
//               className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-1"
//             >
//               {loading ? (
//                 <span className="flex items-center gap-1">
//                   <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
//                   Processing...
//                 </span>
//               ) : (
//                 <>
//                   <CheckCircleIcon className="w-4 h-4" />
//                   Confirm
//                 </>
//               )}
//             </button>
//             <button
//               onClick={() => onReject(booking._id)}
//               disabled={loading}
//               className="flex-1 border border-red-500 text-red-500 py-1 rounded hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-1"
//             >
//               <XCircleIcon className="w-4 h-4" />
//               Reject
//             </button>
//           </div>
//         )}
//         {booking.rejectionReason && (
//           <div className="text-sm p-2 bg-gray-50 rounded">
//             <p className="font-medium">Rejection Reason:</p>
//             <p>{booking.rejectionReason}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// const EmptyState = ({ message, icon: Icon }) => (
//   <div className="flex flex-col items-center justify-center py-12 text-gray-500">
//     <Icon className="w-12 h-12 mb-3 text-gray-300" />
//     <p className="text-lg">{message}</p>
//   </div>
// );

// class BookingStatusErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("BookingStatus Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-4 text-red-500">
//           Something went wrong with bookings. Please refresh.
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const BookingStatus = () => {
//   const [tab, setTab] = useState("pending");
//   const [bookings, setBookings] = useState({
//     pending: { data: [], page: 1, total: 0 },
//     confirmed: { data: [], page: 1, total: 0 },
//     rejected: { data: [], page: 1, total: 0 },
//   });
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     pending: 0,
//     rejected: 0,
//   });
//   const [loading, setLoading] = useState({
//     list: true,
//     action: false,
//     tabChange: false,
//   });
//   const limit = 10;
//   const { user, owner } = useAuth();
//   const ownerId = owner?._id;

//   const fetchBookings = async (status, page = 1) => {
//     try {
//       setLoading((prev) => ({
//         ...prev,
//         list: true,
//         tabChange: status !== tab,
//       }));

//       const response = await axios.get(`${baseurl}/auth/bookings/owner`, {
//         params: {
//           status,
//           page,
//           limit,
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });

//       setBookings((prev) => ({
//         ...prev,
//         [status]: {
//           data: response.data.bookings || [],
//           page,
//           total: response.data.pagination?.total || 0,
//         },
//       }));

//       if (page === 1) {
//         setStats((prev) => ({
//           ...prev,
//           [status]: response.data.pagination?.total || 0,
//           total:
//             prev.total -
//             (prev[status] || 0) +
//             (response.data.pagination?.total || 0),
//         }));
//       }

//       if (status !== tab) {
//         setTab(status);
//       }
//     } catch (error) {
//       console.error(`Error fetching ${status} bookings:`, error);
//       toast.error(`Failed to load ${status} bookings`);
//       setBookings((prev) => ({
//         ...prev,
//         [status]: {
//           data: [],
//           page: 1,
//           total: 0,
//         },
//       }));
//     } finally {
//       setLoading((prev) => ({ ...prev, list: false, tabChange: false }));
//     }
//   };

//   const handleTabChange = (newTab) => {
//     if (bookings[newTab].data.length === 0 || bookings[newTab].page !== 1) {
//       fetchBookings(newTab, 1);
//     } else {
//       setTab(newTab);
//     }
//   };

//   const handleStatusChange = async (bookingId, status, reason = "") => {
//     console.log("handleStatusChange","xx", bookingId, status, reason);
//     try {
//       setLoading((prev) => ({ ...prev, action: true }));

//       await axios.post(
//         `${baseurl}/auth/bookings/${bookingId}/status`,
//         {
//           status,
//           ...(reason && { rejectionReason: reason }),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//         }
//       );

//       setBookings((prev) => {
//         const updatedPending = prev.pending.data.filter(
//           (b) => b._id !== bookingId
//         );
//         const updatedBooking = prev.pending.data.find(
//           (b) => b._id === bookingId
//         );

//         if (!updatedBooking) return prev;

//         if (status === "confirmed") {
//           return {
//             ...prev,
//             pending: {
//               ...prev.pending,
//               data: updatedPending,
//               total: prev.pending.total - 1,
//             },
//             confirmed: {
//               ...prev.confirmed,
//               data: [{ ...updatedBooking, status }, ...prev.confirmed.data],
//               total: prev.confirmed.total + 1,
//             },
//           };
//         } else if (status === "rejected") {
//           return {
//             ...prev,
//             pending: {
//               ...prev.pending,
//               data: updatedPending,
//               total: prev.pending.total - 1,
//             },
//             rejected: {
//               ...prev.rejected,
//               data: [
//                 { ...updatedBooking, status, rejectionReason: reason },
//                 ...prev.rejected.data,
//               ],
//               total: prev.rejected.total + 1,
//             },
//           };
//         }
//         return prev;
//       });

//       setStats((prev) => ({
//         ...prev,
//         pending: prev.pending - 1,
//         ...(status === "confirmed" && { active: prev.active + 1 }),
//         ...(status === "rejected" && { rejected: prev.rejected + 1 }),
//       }));

//       toast.success(`Booking ${status} successfully`);
//     } catch (error) {
//       console.error(`Status change error (${status}):`, error);
//       toast.error(`Failed to ${status} booking`);
//       fetchBookings(tab, bookings[tab].page);
//     } finally {
//       setLoading((prev) => ({ ...prev, action: false }));
//     }
//   };

//   const handleConfirm = (bookingId) => {
//     handleStatusChange(bookingId, "confirmed");
//   };

//   const handleReject = (bookingId) => {
//     const reason = prompt("Please enter rejection reason:");
//     if (reason) {
//       handleStatusChange(bookingId, "rejected", reason);
//     }
//   };

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       await Promise.all([
//         fetchBookings("pending"),
//         fetchBookings("confirmed"),
//         fetchBookings("rejected"),
//       ]);
//     };

//     fetchInitialData();
//   }, []);

//   const PaginationControls = ({ status }) => {
//     const current = bookings[status];
//     const totalPages = Math.ceil(current.total / limit);

//     if (totalPages <= 1) return null;

//     return (
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => fetchBookings(status, current.page - 1)}
//           disabled={current.page <= 1 || loading.list}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {current.page} of {totalPages}
//         </span>
//         <button
//           onClick={() => fetchBookings(status, current.page + 1)}
//           disabled={current.page >= totalPages || loading.list}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     );
//   };

//   return (
//     <BookingStatusErrorBoundary>
//       <div className="p-4 space-y-6">
//       <ToastContainer
//         position="top-center"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         style={{ zIndex: 9999 }} // Ensure it's above other elements
//       />
//         <div className="space-y-4">
//           <h1 className="text-xl font-bold">Booking Status</h1>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Total Bookings</p>
//                 <h2 className="text-2xl font-bold">{stats.total}</h2>
//               </div>
//               <BookIcon className="w-6 h-6 text-gray-400" />
//             </div>
//             <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Active Bookings</p>
//                 <h2 className="text-2xl font-bold">{stats.active}</h2>
//               </div>
//               <ClockIcon className="w-6 h-6 text-gray-400" />
//             </div>
//             <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Pending Requests</p>
//                 <h2 className="text-2xl font-bold">{stats.pending}</h2>
//               </div>
//               <HourglassIcon className="w-6 h-6 text-gray-400" />
//             </div>
//             <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Rejected Bookings</p>
//                 <h2 className="text-2xl font-bold">{stats.rejected}</h2>
//               </div>
//               <XCircleIcon className="w-6 h-6 text-gray-400" />
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="flex gap-4 border-b">
//             <button
//               className={`pb-2 border-b-2 transition font-medium ${
//                 tab === "pending"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500"
//               }`}
//               onClick={() => handleTabChange("pending")}
//             >
//               Pending Requests ({bookings.pending.total})
//             </button>
//             <button
//               className={`pb-2 border-b-2 transition font-medium ${
//                 tab === "confirmed"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500"
//               }`}
//               onClick={() => handleTabChange("confirmed")}
//             >
//               Confirmed Bookings ({bookings.confirmed.total})
//             </button>
//             <button
//               className={`pb-2 border-b-2 transition font-medium ${
//                 tab === "rejected"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500"
//               }`}
//               onClick={() => handleTabChange("rejected")}
//             >
//               Rejected Bookings ({bookings.rejected.total})
//             </button>
//           </div>

//           {loading.list && loading.tabChange ? (
//             <div className="flex justify-center py-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
//             </div>
//           ) : (
//             <>
//               <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
//                 {bookings[tab].data.length > 0 ? (
//                   bookings[tab].data.map((booking) => (
//                     <BookingCard
//                       key={booking._id}
//                       booking={booking}
//                       onConfirm={handleConfirm}
//                       onReject={handleReject}
//                       loading={loading.action}
//                     />
//                   ))
//                 ) : (
//                   <EmptyState
//                     message={`No ${tab} bookings`}
//                     icon={
//                       tab === "pending"
//                         ? HourglassIcon
//                         : tab === "confirmed"
//                         ? CheckCircleIcon
//                         : XCircleIcon
//                     }
//                   />
//                 )}
//               </div>
//               <PaginationControls status={tab} />
//             </>
//           )}
//         </div>
//       </div>
//     </BookingStatusErrorBoundary>
//   );
// };

// export default BookingStatus;
// import React, { useState, useEffect } from "react";
// import {
//   BookIcon,
//   ClockIcon,
//   HourglassIcon,
//   CheckCircleIcon,
//   XCircleIcon,
// } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import PropTypes from "prop-types";
// import { baseurl } from "../constant/urls";

// const BookingCard = React.memo(({ booking, onConfirm, onReject, loading }) => {
//   const statusColors = {
//     pending: "bg-yellow-100 text-yellow-800",
//     confirmed: "bg-green-100 text-green-800",
//     rejected: "bg-red-100 text-red-800",
//   };

//   const endDate =
//     booking.period?.endDate ||
//     (booking.period?.startDate &&
//       new Date(
//         new Date(booking.period.startDate).setMonth(
//           new Date(booking.period.startDate).getMonth() +
//             (booking.period?.durationMonths || 0)
//         )
//       ));

//   return (
//     <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-4">
//       <div className="flex flex-col gap-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <img
//               src={
//                 booking.student?.avatar ||
//                 `https://i.pravatar.cc/150?u=${booking.student?._id || "user"}`
//               }
//               alt={booking.student?.firstName || "Student"}
//               className="w-10 h-10 rounded-full"
//             />
//             <div>
//               <p className="font-semibold">
//                 {booking.student?.firstName && booking.student?.lastName
//                   ? `${booking.student.firstName} ${booking.student.lastName}`
//                   : "Unknown User"}
//               </p>
//               <p className="text-xs text-gray-500">
//                 #{booking._id?.slice(-6).toUpperCase() || "------"}
//               </p>
//             </div>
//           </div>
//           <span
//             className={`${
//               statusColors[booking.status] || "bg-gray-100 text-gray-800"
//             } text-xs px-2 py-1 rounded-full`}
//           >
//             {(booking.status || "unknown").toUpperCase()}
//           </span>
//         </div>
//         <div className="text-sm space-y-1">
//           <p>
//             <strong>Room:</strong> {booking.room || "N/A"}
//           </p>
//           <p>
//             <strong>Beds:</strong> {booking.bedsBooked || 0} (
//             {booking.originalBedCount || "unknown"} available)
//           </p>
//           <p>
//             <strong>Period:</strong>
//             {booking.period?.startDate
//               ? new Date(booking.period.startDate).toLocaleDateString()
//               : "N/A"}{" "}
//             -{endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
//           </p>
//           <p>
//             <strong>Amount:</strong> ₹
//             {booking.payment?.totalAmount?.toLocaleString() || "0"}
//           </p>
//         </div>
//         {booking.status === "pending" && (
//           <div className="flex gap-2">
//             <button
//               onClick={() => onConfirm(booking._id)}
//               disabled={loading}
//               className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-1"
//             >
//               {loading ? (
//                 <span className="flex items-center gap-1">
//                   <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
//                   Processing...
//                 </span>
//               ) : (
//                 <>
//                   <CheckCircleIcon className="w-4 h-4" />
//                   Confirm
//                 </>
//               )}
//             </button>
//             <button
//               onClick={() => onReject(booking._id)}
//               disabled={loading}
//               className="flex-1 border border-red-500 text-red-500 py-1 rounded hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-1"
//             >
//               <XCircleIcon className="w-4 h-4" />
//               Reject
//             </button>
//           </div>
//         )}
//         {booking.rejectionReason && (
//           <div className="text-sm p-2 bg-gray-50 rounded">
//             <p className="font-medium">Rejection Reason:</p>
//             <p>{booking.rejectionReason}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// const EmptyState = ({ message, icon: Icon }) => (
//   <div className="flex flex-col items-center justify-center py-12 text-gray-500">
//     <Icon className="w-12 h-12 mb-3 text-gray-300" />
//     <p className="text-lg">{message}</p>
//   </div>
// );

// class BookingStatusErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("BookingStatus Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-4 text-red-500">
//           Something went wrong with bookings. Please refresh.
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const BookingStatus = ({ owner }) => {
//   const [tab, setTab] = useState("pending");
//   const [maintenanceRequests, setMaintenanceRequests] = useState({});
//   const [bookings, setBookings] = useState({
//     pending: { data: [], page: 1, total: 0 },
//     confirmed: { data: [], page: 1, total: 0 },
//     rejected: { data: [], page: 1, total: 0 },
//   });
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     pending: 0,
//     rejected: 0,
//   });
//   const [loading, setLoading] = useState({
//     list: true,
//     action: false,
//     tabChange: false,
//   });
//   const limit = 10;
//   const { user } = useAuth();
//   const ownerId = owner?._id;

//   const fetchBookings = async (status, page = 1) => {
//     try {
//       setLoading((prev) => ({
//         ...prev,
//         list: true,
//         tabChange: status !== tab,
//       }));

//       const response = await axios.get(`${baseurl}/auth/bookings/owner`, {
//         params: {
//           status,
//           page,
//           limit,
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });

//       setBookings((prev) => ({
//         ...prev,
//         [status]: {
//           data: response.data.bookings || [],
//           page,
//           total: response.data.pagination?.total || 0,
//         },
//       }));

//       if (page === 1) {
//         setStats((prev) => ({
//           ...prev,
//           [status]: response.data.pagination?.total || 0,
//           total:
//             prev.total -
//             (prev[status] || 0) +
//             (response.data.pagination?.total || 0),
//         }));
//       }

//       if (status !== tab) {
//         setTab(status);
//       }
//     } catch (error) {
//       console.error(`Error fetching ${status} bookings:`, error);
//       toast.error(`Failed to load ${status} bookings`);
//       setBookings((prev) => ({
//         ...prev,
//         [status]: {
//           data: [],
//           page: 1,
//           total: 0,
//         },
//       }));
//     } finally {
//       setLoading((prev) => ({ ...prev, list: false, tabChange: false }));
//     }
//   };

//   const handleTabChange = (newTab) => {
//     if (bookings[newTab].data.length === 0 || bookings[newTab].page !== 1) {
//       fetchBookings(newTab, 1);
//     } else {
//       setTab(newTab);
//     }
//   };

//   const handleStatusChange = async (bookingId, status, reason = "") => {
//     try {
//       setLoading((prev) => ({ ...prev, action: true }));

//       await axios.post(
//         `${baseurl}/auth/bookings/${bookingId}/status`,
//         {
//           status,
//           ...(reason && { rejectionReason: reason }),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//         }
//       );

//       setBookings((prev) => {
//         const updatedPending = prev.pending.data.filter(
//           (b) => b._id !== bookingId
//         );
//         const updatedBooking = prev.pending.data.find(
//           (b) => b._id === bookingId
//         );

//         if (!updatedBooking) return prev;

//         if (status === "confirmed") {
//           return {
//             ...prev,
//             pending: {
//               ...prev.pending,
//               data: updatedPending,
//               total: prev.pending.total - 1,
//             },
//             confirmed: {
//               ...prev.confirmed,
//               data: [{ ...updatedBooking, status }, ...prev.confirmed.data],
//               total: prev.confirmed.total + 1,
//             },
//           };
//         } else if (status === "rejected") {
//           return {
//             ...prev,
//             pending: {
//               ...prev.pending,
//               data: updatedPending,
//               total: prev.pending.total - 1,
//             },
//             rejected: {
//               ...prev.rejected,
//               data: [
//                 { ...updatedBooking, status, rejectionReason: reason },
//                 ...prev.rejected.data,
//               ],
//               total: prev.rejected.total + 1,
//             },
//           };
//         }
//         return prev;
//       });

//       setStats((prev) => ({
//         ...prev,
//         pending: prev.pending - 1,
//         ...(status === "confirmed" && { active: prev.active + 1 }),
//         ...(status === "rejected" && { rejected: prev.rejected + 1 }),
//       }));

//       toast.success(`Booking ${status} successfully`);
//     } catch (error) {
//       console.error(`Status change error (${status}):`, error);
//       toast.error(`Failed to ${status} booking`);
//       fetchBookings(tab, bookings[tab].page);
//     } finally {
//       setLoading((prev) => ({ ...prev, action: false }));
//     }
//   };

//   const handleConfirm = (bookingId) => {
//     handleStatusChange(bookingId, "confirmed");
//   };

//   const handleReject = (bookingId) => {
//     const reason = prompt("Please enter rejection reason:");
//     if (reason) {
//       handleStatusChange(bookingId, "rejected", reason);
//     }
//   };

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       await Promise.all([
//         fetchBookings("pending"),
//         fetchBookings("confirmed"),
//         fetchBookings("rejected"),
//       ]);
//     };

//     fetchInitialData();
//   }, []);

//   const PaginationControls = ({ status }) => {
//     const current = bookings[status];
//     const totalPages = Math.ceil(current.total / limit);

//     if (totalPages <= 1) return null;

//     return (
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => fetchBookings(status, current.page - 1)}
//           disabled={current.page <= 1 || loading.list}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {current.page} of {totalPages}
//         </span>
//         <button
//           onClick={() => fetchBookings(status, current.page + 1)}
//           disabled={current.page >= totalPages || loading.list}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     );
//   };

//   return (
//     <BookingStatusErrorBoundary>
//       <div className="p-4 space-y-6">
//         <ToastContainer
//           position="top-center"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           style={{ zIndex: 9999 }}
//         />
//         <div className="space-y-4">
//           <h1 className="text-xl font-bold">Booking Status</h1>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Total Bookings</p>
//                 <h2 className="text-2xl font-bold">{stats.total}</h2>
//               </div>
//               <BookIcon className="w-6 h-6 text-gray-400" />
//             </div>
//             <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Active Bookings</p>
//                 <h2 className="text-2xl font-bold">{stats.active}</h2>
//               </div>
//               <ClockIcon className="w-6 h-6 text-gray-400" />
//             </div>
//             <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Pending Requests</p>
//                 <h2 className="text-2xl font-bold">{stats.pending}</h2>
//               </div>
//               <HourglassIcon className="w-6 h-6 text-gray-400" />
//             </div>
//             <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Rejected Bookings</p>
//                 <h2 className="text-2xl font-bold">{stats.rejected}</h2>
//               </div>
//               <XCircleIcon className="w-6 h-6 text-gray-400" />
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="flex gap-4 border-b">
//             <button
//               className={`pb-2 border-b-2 transition font-medium ${
//                 tab === "pending"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500"
//               }`}
//               onClick={() => handleTabChange("pending")}
//             >
//               Pending Requests ({bookings.pending.total})
//             </button>
//             <button
//               className={`pb-2 border-b-2 transition font-medium ${
//                 tab === "confirmed"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500"
//               }`}
//               onClick={() => handleTabChange("confirmed")}
//             >
//               Confirmed Bookings ({bookings.confirmed.total})
//             </button>
//             <button
//               className={`pb-2 border-b-2 transition font-medium ${
//                 tab === "rejected"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500"
//               }`}
//               onClick={() => handleTabChange("rejected")}
//             >
//               Rejected Bookings ({bookings.rejected.total})
//             </button>
//           </div>

//           {loading.list && loading.tabChange ? (
//             <div className="flex justify-center py-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
//             </div>
//           ) : (
//             <>
//               <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
//                 {bookings[tab].data.length > 0 ? (
//                   bookings[tab].data.map((booking) => (
//                     <BookingCard
//                       key={booking._id}
//                       booking={booking}
//                       onConfirm={handleConfirm}
//                       onReject={handleReject}
//                       loading={loading.action}
//                     />
//                   ))
//                 ) : (
//                   <EmptyState
//                     message={`No ${tab} bookings`}
//                     icon={
//                       tab === "pending"
//                         ? HourglassIcon
//                         : tab === "confirmed"
//                         ? CheckCircleIcon
//                         : XCircleIcon
//                     }
//                   />
//                 )}
//               </div>
//               <PaginationControls status={tab} />
//             </>
//           )}
//         </div>
//       </div>
//     </BookingStatusErrorBoundary>
//   );
// };

// BookingStatus.propTypes = {
//   owner: PropTypes.object,
// };

// export default BookingStatus;
import React, { useState, useEffect } from "react";
import {
  BookIcon,
  ClockIcon,
  HourglassIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshCw,
  AlertTriangle,
  Check,
  Clock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { baseurl } from "../constant/urls";

const BookingCard = React.memo(
  ({ booking, onConfirm, onReject, loading, maintenanceRequests }) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    const endDate =
      booking.period?.endDate ||
      (booking.period?.startDate &&
        new Date(
          new Date(booking.period.startDate).setMonth(
            new Date(booking.period.startDate).getMonth() +
              (booking.period?.durationMonths || 0)
          )
        ));

    // Filter maintenance requests for this booking
    // This remains the same since we're already filtering by booking._id
    const bookingMaintenanceRequests = maintenanceRequests.filter(
      (req) => req.booking === booking._id
    );

    const hasActiveMaintenance = bookingMaintenanceRequests.some(
      (req) => req.status === "in-progress" || req.status === "pending"
    );

    const getStatusIcon = (status) => {
      switch (status) {
        case "in-progress":
          return <AlertTriangle className="w-4 h-4 inline mr-1" />;
        case "pending":
          return <Clock className="w-4 h-4 inline mr-1" />;
        case "completed":
          return <Check className="w-4 h-4 inline mr-1" />;
        default:
          return null;
      }
    };

    return (
      <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  booking.student?.avatar ||
                  `https://i.pravatar.cc/150?u=${
                    booking.student?._id || "user"
                  }`
                }
                alt={booking.student?.firstName || "Student"}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">
                  {booking.student?.firstName && booking.student?.lastName
                    ? `${booking.student.firstName} ${booking.student.lastName}`
                    : "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  #{booking._id?.slice(-6).toUpperCase() || "------"}
                </p>
              </div>
            </div>
            <span
              className={`${
                statusColors[booking.status] || "bg-gray-100 text-gray-800"
              } text-xs px-2 py-1 rounded-full`}
            >
              {(booking.status || "unknown").toUpperCase()}
            </span>
          </div>
          <div className="text-sm space-y-1">
            <p>
              <strong>Room:</strong> {booking.room || "N/A"}
            </p>
            <p>
              <strong>Beds:</strong> {booking.bedsBooked || 0} (
              {booking.originalBedCount || "unknown"} available)
            </p>
            <p>
              <strong>Period:</strong>
              {booking.period?.startDate
                ? new Date(booking.period.startDate).toLocaleDateString()
                : "N/A"}{" "}
              -{endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
            </p>
            <p>
              <strong>Amount:</strong> ₹
              {booking.payment?.totalAmount?.toLocaleString() || "0"}
            </p>
          </div>

          {/* Maintenance Request Section */}
          {booking.status === "confirmed" &&
            bookingMaintenanceRequests.length > 0 && (
              <div className="mt-2 border-t pt-2">
                <div
                  className={`p-2 rounded mb-2 ${
                    hasActiveMaintenance
                      ? "bg-orange-100 text-orange-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  <p className="font-medium">
                    {hasActiveMaintenance
                      ? "Active Maintenance"
                      : "Completed Maintenance"}
                    <span className="ml-2 text-sm font-normal">
                      ({bookingMaintenanceRequests.length} request
                      {bookingMaintenanceRequests.length !== 1 ? "s" : ""})
                    </span>
                  </p>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {bookingMaintenanceRequests.map((request) => (
                    <div
                      key={request._id}
                      className="p-2 bg-gray-50 rounded text-sm"
                    >
                      <p className="font-medium">{request.title}</p>
                      <p className="text-gray-600">{request.description}</p>
                      <p className="mt-1">
                        Status:
                        <span
                          className={
                            request.status === "in-progress"
                              ? "text-orange-600"
                              : request.status === "pending"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {getStatusIcon(request.status)} {request.status}
                        </span>
                      </p>
                      {request.response && (
                        <p className="mt-1">
                          <span className="font-medium">Response:</span>{" "}
                          {request.response}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {booking.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => onConfirm(booking._id)}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-1"
              >
                {loading ? (
                  <span className="flex items-center gap-1">
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </span>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4" />
                    Confirm
                  </>
                )}
              </button>
              <button
                onClick={() => onReject(booking._id)}
                disabled={loading}
                className="flex-1 border border-red-500 text-red-500 py-1 rounded hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <XCircleIcon className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}
          {booking.rejectionReason && (
            <div className="text-sm p-2 bg-gray-50 rounded">
              <p className="font-medium">Rejection Reason:</p>
              <p>{booking.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

const EmptyState = ({ message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    <Icon className="w-12 h-12 mb-3 text-gray-300" />
    <p className="text-lg">{message}</p>
  </div>
);

class BookingStatusErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("BookingStatus Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          Something went wrong with bookings. Please refresh.
        </div>
      );
    }
    return this.props.children;
  }
}

const BookingStatus = ({ owner }) => {
  const [tab, setTab] = useState("pending");
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [bookings, setBookings] = useState({
    pending: { data: [], page: 1, total: 0 },
    confirmed: { data: [], page: 1, total: 0 },
    rejected: { data: [], page: 1, total: 0 },
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState({
    list: true,
    action: false,
    tabChange: false,
    maintenance: false,
  });
  const limit = 10;
  const { user } = useAuth();
  const ownerId = owner?._id;

  const fetchMaintenanceRequests = async (bookingIds) => {
    // Add parameter here
    try {
      setLoading((prev) => ({ ...prev, maintenance: true }));
      const response = await axios.get(
        `${baseurl}/auth/maintenance/requests/owner`,
        {
          params: {
            bookingIds: bookingIds.join(","),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      toast.error("Failed to load maintenance requests");
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, maintenance: false }));
    }
  };

  const fetchBookings = async (status, page = 1) => {
    try {
      setLoading((prev) => ({
        ...prev,
        list: true,
        tabChange: status !== tab,
      }));

      const response = await axios.get(`${baseurl}/auth/bookings/owner`, {
        params: {
          status,
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setBookings((prev) => ({
        ...prev,
        [status]: {
          data: response.data.bookings || [],
          page,
          total: response.data.pagination?.total || 0,
        },
      }));

      if (page === 1) {
        setStats((prev) => ({
          ...prev,
          [status]: response.data.pagination?.total || 0,
          total:
            prev.total -
            (prev[status] || 0) +
            (response.data.pagination?.total || 0),
        }));
      }

      // Fetch maintenance requests when loading confirmed bookings
      // Inside fetchBookings function, when status is "confirmed":
      if (status === "confirmed") {
        const bookingIds = response.data.bookings.map((b) => b._id);
        const requests = await fetchMaintenanceRequests(bookingIds); // Pass bookingIds here
        setMaintenanceRequests(requests);
      }
      if (status !== tab) {
        setTab(status);
      }
    } catch (error) {
      console.error(`Error fetching ${status} bookings:`, error);
      toast.error(`Failed to load ${status} bookings`);
      setBookings((prev) => ({
        ...prev,
        [status]: {
          data: [],
          page: 1,
          total: 0,
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, list: false, tabChange: false }));
    }
  };

  const handleTabChange = (newTab) => {
    if (bookings[newTab].data.length === 0 || bookings[newTab].page !== 1) {
      fetchBookings(newTab, 1);
    } else {
      setTab(newTab);
    }
  };

  const handleStatusChange = async (bookingId, status, reason = "") => {
    try {
      setLoading((prev) => ({ ...prev, action: true }));

      await axios.post(
        `${baseurl}/auth/bookings/${bookingId}/status`,
        {
          status,
          ...(reason && { rejectionReason: reason }),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setBookings((prev) => {
        const updatedPending = prev.pending.data.filter(
          (b) => b._id !== bookingId
        );
        const updatedBooking = prev.pending.data.find(
          (b) => b._id === bookingId
        );

        if (!updatedBooking) return prev;

        if (status === "confirmed") {
          return {
            ...prev,
            pending: {
              ...prev.pending,
              data: updatedPending,
              total: prev.pending.total - 1,
            },
            confirmed: {
              ...prev.confirmed,
              data: [{ ...updatedBooking, status }, ...prev.confirmed.data],
              total: prev.confirmed.total + 1,
            },
          };
        } else if (status === "rejected") {
          return {
            ...prev,
            pending: {
              ...prev.pending,
              data: updatedPending,
              total: prev.pending.total - 1,
            },
            rejected: {
              ...prev.rejected,
              data: [
                { ...updatedBooking, status, rejectionReason: reason },
                ...prev.rejected.data,
              ],
              total: prev.rejected.total + 1,
            },
          };
        }
        return prev;
      });

      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        ...(status === "confirmed" && { active: prev.active + 1 }),
        ...(status === "rejected" && { rejected: prev.rejected + 1 }),
      }));

      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      console.error(`Status change error (${status}):`, error);
      toast.error(`Failed to ${status} booking`);
      fetchBookings(tab, bookings[tab].page);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleConfirm = (bookingId) => {
    handleStatusChange(bookingId, "confirmed");
  };

  const handleReject = (bookingId) => {
    const reason = prompt("Please enter rejection reason:");
    if (reason) {
      handleStatusChange(bookingId, "rejected", reason);
    }
  };
  const refreshMaintenanceData = async () => {
    if (bookings.confirmed.data.length > 0) {
      const bookingIds = bookings.confirmed.data.map(b => b._id);
      const requests = await fetchMaintenanceRequests(bookingIds);  // Pass bookingIds here
      setMaintenanceRequests(requests);
      toast.success("Maintenance requests refreshed");
    }
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchBookings("pending"),
        fetchBookings("confirmed"),
        fetchBookings("rejected"),
      ]);
    };

    fetchInitialData();
  }, []);

  const PaginationControls = ({ status }) => {
    const current = bookings[status];
    const totalPages = Math.ceil(current.total / limit);

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => fetchBookings(status, current.page - 1)}
          disabled={current.page <= 1 || loading.list}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {current.page} of {totalPages}
        </span>
        <button
          onClick={() => fetchBookings(status, current.page + 1)}
          disabled={current.page >= totalPages || loading.list}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <BookingStatusErrorBoundary>
      <div className="p-4 space-y-6">
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
          style={{ zIndex: 9999 }}
        />
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Booking Status</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <h2 className="text-2xl font-bold">{stats.total}</h2>
              </div>
              <BookIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Bookings</p>
                <h2 className="text-2xl font-bold">{stats.active}</h2>
              </div>
              <ClockIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Requests</p>
                <h2 className="text-2xl font-bold">{stats.pending}</h2>
              </div>
              <HourglassIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected Bookings</p>
                <h2 className="text-2xl font-bold">{stats.rejected}</h2>
              </div>
              <XCircleIcon className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex gap-4">
              <button
                className={`pb-2 border-b-2 transition font-medium ${
                  tab === "pending"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => handleTabChange("pending")}
              >
                Pending Requests ({bookings.pending.total})
              </button>
              <button
                className={`pb-2 border-b-2 transition font-medium ${
                  tab === "confirmed"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => handleTabChange("confirmed")}
              >
                Confirmed Bookings ({bookings.confirmed.total})
              </button>
              <button
                className={`pb-2 border-b-2 transition font-medium ${
                  tab === "rejected"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => handleTabChange("rejected")}
              >
                Rejected Bookings ({bookings.rejected.total})
              </button>
            </div>
            {tab === "confirmed" && (
              <button
                onClick={refreshMaintenanceData}
                disabled={loading.maintenance}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading.maintenance ? "animate-spin" : ""
                  }`}
                />
                Refresh Maintenance
              </button>
            )}
          </div>

          {loading.list && loading.tabChange ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                {bookings[tab].data.length > 0 ? (
                  bookings[tab].data.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onConfirm={handleConfirm}
                      onReject={handleReject}
                      loading={loading.action}
                      maintenanceRequests={maintenanceRequests}
                    />
                  ))
                ) : (
                  <EmptyState
                    message={`No ${tab} bookings`}
                    icon={
                      tab === "pending"
                        ? HourglassIcon
                        : tab === "confirmed"
                        ? CheckCircleIcon
                        : XCircleIcon
                    }
                  />
                )}
              </div>
              <PaginationControls status={tab} />
            </>
          )}
        </div>
      </div>
    </BookingStatusErrorBoundary>
  );
};

BookingStatus.propTypes = {
  owner: PropTypes.object,
};

export default BookingStatus;
