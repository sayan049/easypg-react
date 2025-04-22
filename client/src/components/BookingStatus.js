// import React, { useState } from "react";
// import { BookIcon, ClockIcon, HourglassIcon } from "lucide-react";

// const BookingCard = ({ name, id, days, type, avatar }) => (
//   <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-4">
//     <div className="flex flex-col gap-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
//           <div>
//             <p className="font-semibold">{name}</p>
//             <p className="text-xs text-gray-500">#{id}</p>
//           </div>
//         </div>
//         <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
//       </div>
//       <div className="text-sm">
//         <p><strong>Booked For:</strong> {days} Days</p>
//         <p><strong>Room Type:</strong> {type}</p>
//       </div>
//       <div className="flex gap-2">
//         <button className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Confirm</button>
//         <button className="flex-1 border border-red-500 text-red-500 py-1 rounded hover:bg-red-50">Reject</button>
//       </div>
//     </div>
//   </div>
// );

// const PendingRequests = () => (
//   <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
//     <BookingCard
//       name="Sarah Johnson"
//       id="MM12345"
//       days={90}
//       type="Double Sharing"
//       avatar="https://i.pravatar.cc/150?img=32"
//     />
//     <BookingCard
//       name="Mike Chen"
//       id="MM12346"
//       days={180}
//       type="Single Room"
//       avatar="https://i.pravatar.cc/150?img=33"
//     />
//   </div>
// );

// const ConfirmedBookings = () => (
//   <div className="text-gray-500 text-sm">No confirmed bookings yet.</div>
// );

// const BookingStatus = () => {
//   const [tab, setTab] = useState("pending");

//   return (
//     <div className="p-4 space-y-6">
//       {/* Top Section */}
//       <div className="space-y-4">
//         <h1 className="text-xl font-bold">Booking Status</h1>
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Bookings</p>
//               <h2 className="text-2xl font-bold">156</h2>
//             </div>
//             <BookIcon className="w-6 h-6 text-gray-400" />
//           </div>
//           <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Active Requests</p>
//               <h2 className="text-2xl font-bold">28</h2>
//             </div>
//             <ClockIcon className="w-6 h-6 text-gray-400" />
//           </div>
//           <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Pending Requests</p>
//               <h2 className="text-2xl font-bold">12</h2>
//             </div>
//             <HourglassIcon className="w-6 h-6 text-gray-400" />
//           </div>
//         </div>
//       </div>

//       {/* Custom Tab Switch */}
//       <div className="space-y-4">
//         <div className="flex gap-4 border-b">
//           <button
//             className={`pb-2 border-b-2 transition font-medium ${tab === "pending" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
//             onClick={() => setTab("pending")}
//           >
//             Pending Requests
//           </button>
//           <button
//             className={`pb-2 border-b-2 transition font-medium ${tab === "confirmed" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
//             onClick={() => setTab("confirmed")}
//           >
//             Confirmed Bookings
//           </button>
//         </div>

//         <div>
//           {tab === "pending" && <PendingRequests />}
//           {tab === "confirmed" && <ConfirmedBookings />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingStatus;
import React, { useState, useEffect } from "react";
import { BookIcon, ClockIcon, HourglassIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useSocket } from "../contexts/socketContext";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { baseurl } from "../constant/urls";

const BookingCard = ({ booking, onConfirm, onReject, loading }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  return (
    <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={booking.student?.avatar || `https://i.pravatar.cc/150?u=${booking.student?._id}`} 
              alt={booking.student?.name} 
              className="w-10 h-10 rounded-full" 
            />
            <div>
              <p className="font-semibold">{booking.student?.name || "Unknown User"}</p>
              <p className="text-xs text-gray-500">#{booking._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <span className={`${statusColors[booking.status]} text-xs px-2 py-1 rounded-full`}>
            {booking.status.toUpperCase()}
          </span>
        </div>
        <div className="text-sm space-y-1">
          <p><strong>Room:</strong> {booking.room}</p>
          <p><strong>Beds:</strong> {booking.bedsBooked} ({booking.originalBedCount} available)</p>
          <p><strong>Period:</strong> {new Date(booking.period.startDate).toLocaleDateString()} - {new Date(booking.period.endDate).toLocaleDateString()}</p>
          <p><strong>Amount:</strong> ₹{booking.payment.totalAmount}</p>
        </div>
        {booking.status === "pending" && (
          <div className="flex gap-2">
            <button 
              onClick={() => onConfirm(booking._id)}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-1"
            >
              {loading ? "Processing..." : (
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
};

const BookingStatus = () => {
  const [tab, setTab] = useState("pending");
  const [bookings, setBookings] = useState({ pending: [], confirmed: [] });
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState({ list: false, action: false });
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
    
    // Join owner's room for real-time updates
    if (socket && user?._id) {
      socket.emit("owner-join", user._id);
    }

    // Listen for new booking requests
    const handleNewBooking = (newBooking) => {
      setBookings(prev => ({
        ...prev,
        pending: [newBooking, ...prev.pending]
      }));
      setStats(prev => ({
        ...prev,
        pending: prev.pending + 1,
        total: prev.total + 1
      }));
      toast.info(`New booking request for ${newBooking.room}`);
    };

    if (socket) {
      socket.on("new-booking", handleNewBooking);
    }

    return () => {
      if (socket) {
        socket.off("new-booking", handleNewBooking);
      }
    };
  }, [socket, user]);

  const fetchBookings = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const [pendingRes, confirmedRes] = await Promise.all([
        axios.get("/api/bookings/owner?status=pending"),
        axios.get("/api/bookings/owner?status=confirmed")
      ]);

      setBookings({
        pending: pendingRes.data.bookings,
        confirmed: confirmedRes.data.bookings
      });

      setStats({
        total: pendingRes.data.bookings.length + confirmedRes.data.bookings.length,
        active: confirmedRes.data.bookings.length,
        pending: pendingRes.data.bookings.length
      });
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  };

  const handleStatusChange = async (bookingId, status, reason = "") => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      
      await axios.put(`${baseurl}/bookings/${bookingId}/status`, { 
        status,
        ...(reason && { rejectionReason: reason })
      });

      // Optimistically update UI
      setBookings(prev => {
        const updatedPending = prev.pending.filter(b => b._id !== bookingId);
        const updatedBooking = prev.pending.find(b => b._id === bookingId);
        
        if (status === "confirmed" && updatedBooking) {
          return {
            pending: updatedPending,
            confirmed: [{ ...updatedBooking, status }, ...prev.confirmed]
          };
        }
        return {
          ...prev,
          pending: updatedPending
        };
      });

      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        ...(status === "confirmed" && { active: prev.active + 1 })
      }));

      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} booking`);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
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

  return (
    <div className="p-4 space-y-6">
      {/* Stats Section */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Booking Status</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 border-b-2 transition font-medium ${tab === "pending" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("pending")}
          >
            Pending Requests ({bookings.pending.length})
          </button>
          <button
            className={`pb-2 border-b-2 transition font-medium ${tab === "confirmed" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("confirmed")}
          >
            Confirmed Bookings ({bookings.confirmed.length})
          </button>
        </div>

        {loading.list ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
            {tab === "pending" ? (
              bookings.pending.length > 0 ? (
                bookings.pending.map(booking => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onConfirm={handleConfirm}
                    onReject={handleReject}
                    loading={loading.action}
                  />
                ))
              ) : (
                <div className="text-gray-500 text-sm py-4">No pending requests</div>
              )
            ) : (
              bookings.confirmed.length > 0 ? (
                bookings.confirmed.map(booking => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    loading={loading.action}
                  />
                ))
              ) : (
                <div className="text-gray-500 text-sm py-4">No confirmed bookings</div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;