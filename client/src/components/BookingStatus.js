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
import { io } from "socket.io-client";
import { useSocket } from "../contexts/socketContext";

// import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
const RejectModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-md p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Reject Booking</h2>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows="4"
          placeholder="Enter rejection reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(reason);
              setReason("");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};
const BookingCard = React.memo(
  ({
    booking,
    onConfirm,
    onReject,
    loading,
    maintenanceRequests,
    handleMaintenanceCancel,
    handleMaintenanceResolve,
  }) => {
    const [showMaintenance, setShowMaintenance] = useState(false);
    const [actionType, setActionType] = useState(null); // 'cancel' or 'resolve'
    const [actionMessage, setActionMessage] = useState(""); // for the entered message
    const [showModal, setShowModal] = useState(false);
    const [currentBookingId, setCurrentBookingId] = useState(null);
    const handleModalSubmit = (reason) => {
      if (reason) {
        handleStatusChange(currentBookingId, "rejected", reason);
      }
      setShowModal(false);
    };
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

    const bookingMaintenanceRequests = Array.isArray(
      maintenanceRequests?.requests
    )
      ? maintenanceRequests.requests.filter(
          (req) => req.booking === booking._id
        )
      : [];

    const toggleMaintenance = () => {
      setShowMaintenance((prev) => !prev);
    };

    const hasMaintenanceRequests = bookingMaintenanceRequests.length > 0;

    return (
      <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-4 transition-all duration-300">
        <div className="flex flex-col gap-4">
          {/* Booking Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <img
                src={
                  booking.student?.avatar ||
                  `https://i.pravatar.cc/150?u=${
                    booking.student?._id || "user"
                  }`
                }
                alt={booking.student?.firstName || "Student"}
                className="w-10 h-10 rounded-full"
              /> */}
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

          {/* PG Information */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-medium text-blue-800">PG Details</h3>
            <div className="text-sm space-y-1 mt-1">
              <p>
                <strong>PG Name:</strong> {booking.pgOwner?.messName || "N/A"}
              </p>
              <p>
                <strong>Room:</strong> {booking.room || "N/A"}
              </p>
              <p>
                <strong>Beds:</strong> {booking.bedsBooked || 0}
              </p>
              <p>
                <strong>Period:</strong>
                {booking.period?.startDate
                  ? new Date(booking.period.startDate).toLocaleDateString()
                  : "N/A"}{" "}
                - {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
              </p>
              <p>
                <strong>Amount:</strong> ₹
                {booking.payment?.totalAmount?.toLocaleString() || "0"}
              </p>
            </div>
          </div>

          {/* Maintenance Requests */}
          {booking.status === "confirmed" && hasMaintenanceRequests && (
            <div>
              <button
                onClick={toggleMaintenance}
                className="mt-2 text-blue-600 text-sm font-semibold hover:underline focus:outline-none"
              >
                {showMaintenance
                  ? "Hide Maintenance Requests"
                  : "View Maintenance Requests"}
              </button>

              {showMaintenance && (
                <div className="space-y-4 mt-3">
                  {bookingMaintenanceRequests.map((request) => (
                    <div
                      key={request._id}
                      className="border rounded-lg p-3 bg-gray-50"
                    >
                      {/* Top Row */}
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{request.title}</h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full min-w-[80px] text-center ${
                            request.status === "in-progress"
                              ? "bg-orange-100 text-orange-800"
                              : request.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Divider */}
                      <hr className="my-2 border-gray-300" />

                      {/* Details */}
                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="break-words">{request.description}</p>
                        <p>
                          <span className="font-medium">Submitted by:</span>{" "}
                          {request.student?.name || "Unknown Student"}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {request.student?.email || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span>{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Buttons */}
                      {request.status === "in-progress" && (
                        <div className="flex flex-col gap-2 mt-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setActionType({
                                  id: request._id,
                                  type: "cancel",
                                });
                                setActionMessage("");
                              }}
                              className="flex-1 border border-red-500 text-red-500 py-1 rounded hover:bg-red-50 text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                setActionType({
                                  id: request._id,
                                  type: "resolve",
                                });
                                setActionMessage("");
                              }}
                              className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700 text-sm"
                            >
                              Resolved
                            </button>
                          </div>

                          {/* Conditionally show textarea and OK button */}
                          {actionType?.id === request._id && (
                            <div className="mt-2 space-y-2">
                              <textarea
                                className="w-full border rounded p-2 text-sm"
                                placeholder={
                                  actionType.type === "cancel"
                                    ? "Reason for cancellation..."
                                    : "Give a response..."
                                }
                                value={actionMessage}
                                onChange={(e) =>
                                  setActionMessage(e.target.value)
                                }
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (actionType.type === "cancel") {
                                      handleMaintenanceCancel(
                                        request._id,
                                        actionMessage
                                      );
                                    } else {
                                      handleMaintenanceResolve(
                                        request._id,
                                        actionMessage
                                      );
                                    }
                                    setActionType(null); // Close input after sending
                                    setActionMessage("");
                                  }}
                                  disabled={!actionMessage.trim()}
                                  className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:bg-blue-400 text-sm"
                                >
                                  OK
                                </button>
                                <button
                                  onClick={() => {
                                    setActionType(null);
                                    setActionMessage("");
                                  }}
                                  className="flex-1 border border-gray-400 text-gray-600 py-1 rounded hover:bg-gray-100 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons for Pending Bookings */}
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

          {/* Rejection Reason */}
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
const BookingSkeletonCard = () => (
  <div className="w-full md:w-[48%] bg-white rounded-xl shadow p-4 animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-6 w-20 bg-gray-200 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
    <div className="h-8 bg-gray-300 rounded w-full" />
  </div>
);

const StatSkeletonCard = () => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between animate-pulse">
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded w-24" />
      <div className="h-6 bg-gray-300 rounded w-16" />
    </div>
    <div className="w-6 h-6 bg-gray-300 rounded-full" />
  </div>
);

// const BookingStatus = ({ owner }) => {
const BookingStatus = () => {
  const [tab, setTab] = useState("pending");
  const [maintenanceRequests, setMaintenanceRequests] = useState({
    requests: [],
  });
  const { setHasUnreadOwner, isConnected, setIsConnected } = useSocket();
  const [hit, setHit] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
  const { user, owner } = useAuth();
  const ownerId = owner?.id;
  const socket = io(baseurl);

  // useEffect(() => {
  //   socket.emit("join-owner-room", ownerId);

  //   socket.on("new-booking-request", (data) => {
  //     console.log("New booking received", data);
  //     // setBookings((prev) => ({
  //     //   ...prev,
  //     //   pending: {
  //     //     ...prev.pending,
  //     //     data: [data, ...prev.pending.data], // prepend new booking
  //     //     total: prev.pending.total + 1,
  //     //   },
  //     // }));
  //     fetchAllBookings();

  //     toast.info("You have a new booking request!");
  //   });

  //   return () => {
  //     socket.off("new-booking-request");
  //   };
  // }, [ownerId]);
  useEffect(() => {
    if (isConnected) {
      fetchAllBookings();
      setIsConnected(false);
    }
  }, [ownerId, isConnected]);

  const fetchMaintenanceRequests = async (bookingIds) => {
    try {
      setLoading((prev) => ({ ...prev, maintenance: true }));
      const response = await axios.get(
        `${baseurl}/auth/maintenance/requests/owner`,
        {
          params: {
            bookingIds: bookingIds.join(","),
          },
          withCredentials: true, // Automatically send cookies
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
          },
        }
      );
      return response.data || { requests: [] };
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";

      console.error("Error fetching maintenance requests:", error);
      toast.error(msg);
      return { requests: [] };
    } finally {
      setLoading((prev) => ({ ...prev, maintenance: false }));
    }
  };

  const handleMaintenanceStatusChange = async (
    requestId,
    status,
    message = ""
  ) => {
    try {
      setLoading((prev) => ({ ...prev, action: true }));

      await axios.post(
        `${baseurl}/auth/maintenance/${requestId}/update-status`,
        { status, message },
        {
          withCredentials: true, // Automatically send cookies
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
          },
        }
      );

      setMaintenanceRequests((prev) => ({
        requests: prev.requests.map((req) =>
          req._id === requestId ? { ...req, status } : req
        ),
      }));

      toast.success(`Maintenance request ${status}`);
    } catch (error) {
      console.error(`Error updating maintenance request (${status}):`, error);
      toast.error(`Failed to ${status} maintenance request`);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleMaintenanceCancel = (requestId, message) => {
    handleMaintenanceStatusChange(requestId, "cancelled", message);
  };

  const handleMaintenanceResolve = (requestId, message) => {
    handleMaintenanceStatusChange(requestId, "resolved", message);
  };

  const fetchAllBookings = async () => {
    try {
      setLoading((prev) => ({ ...prev, list: true }));

      const response = await axios.get(`${baseurl}/auth/bookings/owner/all`, {
        params: {
          limit,
        },
        withCredentials: true, // Automatically send cookies
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
        },
      });

      const { pending, confirmed, rejected } = response.data;
      console.log("All bookings response:", response.data);
      setBookings({
        pending: {
          data: pending.bookings || [],
          page: 1,
          total: pending.total || 0,
        },
        confirmed: {
          data: confirmed.bookings || [],
          page: 1,
          total: confirmed.total || 0,
        },
        rejected: {
          data: rejected.bookings || [],
          page: 1,
          total: rejected.total || 0,
        },
      });

      setStats({
        total:
          (pending.total || 0) + (confirmed.total || 0) + (rejected.total || 0),
        active: confirmed.total || 0,
        pending: pending.total || 0,
        rejected: rejected.total || 0,
      });

      // Fetch maintenance requests for confirmed bookings
      const bookingIds = confirmed.bookings?.map((b) => b._id) || [];
      if (bookingIds.length > 0) {
        const { requests } = await fetchMaintenanceRequests(bookingIds);
        setMaintenanceRequests({
          requests: Array.isArray(requests) ? requests : [],
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load bookings";
      console.error("Error fetching all bookings:", error);
      toast.error(msg);
    } finally {
      setLoading((prev) => ({ ...prev, list: false }));
    }
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  const handleStatusChange = async (bookingId, status, reason = "") => {
    try {
      setLoading((prev) => ({ ...prev, action: true }));

      await axios.post(
        `${baseurl}/auth/bookings/${bookingId}/status`,
        {
          status,
          //  ...(reason && { rejectionReason: reason }),
          rejectionReason: reason?.trim() || "No reason provided",
        },
        {
          withCredentials: true, // Automatically send cookies
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
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
      const msg =
        error.response?.data?.message || `Failed to ${status} booking`;
      console.error(`Status change error (${status}):`, error);
      toast.error(msg);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleConfirm = (bookingId) => {
    handleStatusChange(bookingId, "confirmed");
  };

  // const handleReject = (bookingId) => {
  //   const reason = prompt("Please enter rejection reason:");
  //   if (reason) {
  //     handleStatusChange(bookingId, "rejected", reason);
  //   }
  // };
  const handleReject = (bookingId) => {
    setCurrentBookingId(bookingId);
    setShowModal(true);
  };
  // const handleModalSubmit = (reason) => {
  //   if (reason) {
  //     handleStatusChange(currentBookingId, "rejected", reason);
  //   }
  //   setShowModal(false);
  // };
  const handleModalSubmit = (reason) => {
    if (reason) {
      handleStatusChange(currentBookingId, "rejected", reason);
    }
    setShowModal(false);
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // const PaginationControls = ({ status }) => {
  //   const current = bookings[status];
  //   const totalPages = Math.ceil(current.total / limit);

  //   if (totalPages <= 1) return null;

  //   return (
  //     <div className="flex justify-between items-center mt-4">
  //       <button
  //         onClick={() => fetchBookingsByStatus(status, current.page - 1)}
  //         disabled={current.page <= 1 || loading.list}
  //         className="px-4 py-2 border rounded disabled:opacity-50"
  //       >
  //         Previous
  //       </button>
  //       <span>
  //         Page {current.page} of {totalPages}
  //       </span>
  //       <button
  //         onClick={() => fetchBookingsByStatus(status, current.page + 1)}
  //         disabled={current.page >= totalPages || loading.list}
  //         className="px-4 py-2 border rounded disabled:opacity-50"
  //       >
  //         Next
  //       </button>
  //     </div>
  //   );
  // };
  if (loading.list || !owner) {
    return (
      <div className="p-4 space-y-6">
        {/* Skeleton for stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatSkeletonCard key={i} />
          ))}
        </div>

        {/* Skeleton for booking cards */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
          {[...Array(4)].map((_, i) => (
            <BookingSkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (
    !loading.list &&
    bookings.pending.data.length === 0 &&
    bookings.confirmed.data.length === 0 &&
    bookings.rejected.data.length === 0
  ) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4">No Bookings</h3>
          <p className="text-gray-600 mb-6">
            You haven't made any booking requests yet.
          </p>
          {/* <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Browse Accommodations
          </button> */}
        </div>
      </div>
    );
  }

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
          </div>

          {loading.list && loading.tabChange ? (
            <div className="flex flex-wrap gap-4">
              {[...Array(4)].map((_, i) => (
                <BookingSkeletonCard key={i} />
              ))}
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
                      handleMaintenanceCancel={handleMaintenanceCancel}
                      handleMaintenanceResolve={handleMaintenanceResolve}
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
              {/* <PaginationControls status={tab} /> */}
            </>
          )}
        </div>
        <RejectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      </div>
    </BookingStatusErrorBoundary>
  );
};

BookingStatus.propTypes = {
  owner: PropTypes.object,
};

export default BookingStatus;
