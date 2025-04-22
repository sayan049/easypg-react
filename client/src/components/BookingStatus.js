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

  // Calculate end date if not provided
  const endDate = booking.period?.endDate || 
    (booking.period?.startDate && new Date(
      new Date(booking.period.startDate).setMonth(
        new Date(booking.period.startDate).getMonth() + 
        (booking.period?.durationMonths || 0)
    )));

  return (
    <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={booking.student?.avatar || `https://i.pravatar.cc/150?u=${booking.student?._id || 'user'}`} 
              alt={booking.student?.name || "Student"} 
              className="w-10 h-10 rounded-full" 
            />
            <div>
              <p className="font-semibold">{booking.student?.name || "Unknown User"}</p>
              <p className="text-xs text-gray-500">#{booking._id?.slice(-6).toUpperCase() || '------'}</p>
            </div>
          </div>
          <span className={`${statusColors[booking.status] || 'bg-gray-100 text-gray-800'} text-xs px-2 py-1 rounded-full`}>
            {(booking.status || 'unknown').toUpperCase()}
          </span>
        </div>
        <div className="text-sm space-y-1">
          <p><strong>Room:</strong> {booking.room || 'N/A'}</p>
          <p><strong>Beds:</strong> {booking.bedsBooked || 0} ({booking.originalBedCount || 'unknown'} available)</p>
          <p><strong>Period:</strong> 
            {booking.period?.startDate ? new Date(booking.period.startDate).toLocaleDateString() : 'N/A'} - 
            {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
          </p>
          <p><strong>Amount:</strong> ₹{booking.payment?.totalAmount?.toLocaleString() || '0'}</p>
        </div>
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
};

const EmptyState = ({ message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    <Icon className="w-12 h-12 mb-3 text-gray-300" />
    <p className="text-lg">{message}</p>
  </div>
);

const BookingStatus = () => {
  const [tab, setTab] = useState("pending");
  const [bookings, setBookings] = useState({ 
    pending: [], 
    confirmed: [],
    rejected: [] 
  });
  const [stats, setStats] = useState({ 
    total: 0, 
    active: 0, 
    pending: 0,
    rejected: 0 
  });
  const [loading, setLoading] = useState({ 
    list: true, 
    action: false 
  });
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDataAndSetupSocket = async () => {
      try {
        // First load existing bookings
        await fetchBookings();

        // Then setup socket listeners
        if (socket && user?._id) {
          console.log("Joining owner room:", user._id);
          socket.emit("owner-join", user._id);

          socket.on("new-booking", (newBooking) => {
            console.log("New booking received via socket:", newBooking);
            setBookings(prev => ({
              ...prev,
              pending: [newBooking, ...(prev.pending || [])]
            }));
            setStats(prev => ({
              ...prev,
              pending: (prev.pending || 0) + 1,
              total: (prev.total || 0) + 1
            }));
            toast.info(`New booking request for ${newBooking.room}`);
          });

          socket.on("booking-updated", (updatedBooking) => {
            console.log("Booking update received:", updatedBooking);
            setBookings(prev => {
              const updatedPending = prev.pending?.filter(b => b._id !== updatedBooking._id) || [];
              
              if (updatedBooking.status === "confirmed") {
                return {
                  pending: updatedPending,
                  confirmed: [updatedBooking, ...(prev.confirmed || [])],
                  rejected: prev.rejected || []
                };
              } else if (updatedBooking.status === "rejected") {
                return {
                  pending: updatedPending,
                  confirmed: prev.confirmed || [],
                  rejected: [updatedBooking, ...(prev.rejected || [])]
                };
              }
              return prev;
            });
          });
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    fetchDataAndSetupSocket();

    return () => {
      if (socket) {
        console.log("Cleaning up socket listeners");
        socket.off("new-booking");
        socket.off("booking-updated");
        socket.emit("owner-leave", user?._id);
      }
    };
  }, [socket, user?._id]);

  const fetchBookings = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const [pendingRes, confirmedRes, rejectedRes] = await Promise.all([
        axios.get(`${baseurl}/bookings/owner?status=pending`),
        axios.get(`${baseurl}/bookings/owner?status=confirmed`),
        axios.get(`${baseurl}/bookings/owner?status=rejected`)
      ]);

      console.log("API responses:", { pendingRes, confirmedRes, rejectedRes });

      setBookings({
        pending: pendingRes.data?.bookings || [],
        confirmed: confirmedRes.data?.bookings || [],
        rejected: rejectedRes.data?.bookings || []
      });

      setStats({
        total: (pendingRes.data?.bookings?.length || 0) + 
              (confirmedRes.data?.bookings?.length || 0) +
              (rejectedRes.data?.bookings?.length || 0),
        active: confirmedRes.data?.bookings?.length || 0,
        pending: pendingRes.data?.bookings?.length || 0,
        rejected: rejectedRes.data?.bookings?.length || 0
      });
    } catch (error) {
      console.error("Fetch bookings error:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  };

  const handleStatusChange = async (bookingId, status, reason = "") => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      
      const response = await axios.put(`${baseurl}/bookings/${bookingId}/status`, { 
        status,
        ...(reason && { rejectionReason: reason })
      });
      console.log("Status change response:", response.data);

      setBookings(prev => {
        const updatedPending = prev.pending.filter(b => b._id !== bookingId);
        const updatedBooking = prev.pending.find(b => b._id === bookingId);
        
        if (!updatedBooking) return prev;

        if (status === "confirmed") {
          return {
            ...prev,
            pending: updatedPending,
            confirmed: [{ ...updatedBooking, status }, ...prev.confirmed]
          };
        } else if (status === "rejected") {
          return {
            ...prev,
            pending: updatedPending,
            rejected: [{ ...updatedBooking, status, rejectionReason: reason }, ...prev.rejected]
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
        ...(status === "confirmed" && { active: prev.active + 1 }),
        ...(status === "rejected" && { rejected: prev.rejected + 1 })
      }));

      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      console.error(`Status change error (${status}):`, error);
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

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white p-2 rounded shadow text-xs">
      <div className={`w-3 h-3 rounded-full ${
        socket?.connected ? 'bg-green-500' : 'bg-red-500'
      }`} />
      {socket?.connected ? `Connected (${socket.id})` : 'Disconnected'}
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <ConnectionStatus />
      
      {/* Stats Section */}
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
          <button
            className={`pb-2 border-b-2 transition font-medium ${tab === "rejected" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("rejected")}
          >
            Rejected Bookings ({bookings.rejected.length})
          </button>
        </div>

        {loading.list ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
            {tab === "pending" && (
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
                <EmptyState 
                  message="No pending booking requests" 
                  icon={HourglassIcon} 
                />
              )
            )}
            
            {tab === "confirmed" && (
              bookings.confirmed.length > 0 ? (
                bookings.confirmed.map(booking => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    loading={loading.action}
                  />
                ))
              ) : (
                <EmptyState 
                  message="No confirmed bookings" 
                  icon={CheckCircleIcon} 
                />
              )
            )}
            
            {tab === "rejected" && (
              bookings.rejected.length > 0 ? (
                bookings.rejected.map(booking => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    loading={loading.action}
                  />
                ))
              ) : (
                <EmptyState 
                  message="No rejected bookings" 
                  icon={XCircleIcon} 
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;