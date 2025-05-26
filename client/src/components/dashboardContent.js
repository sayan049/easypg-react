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
  FaUsers,
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
  MdOutlineHome,
  MdPersonOutline,
  MdEmail,
  MdPhone,
} from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
const DashboardContent = ({
  user,
  bookings = [],
  upcomingStay = [],
  currentStay = [],
  pastStay = [],
  pendingStay = [],
  stats = {},
  daysRemaining = 0,
  totalAmountConfirmed = 0,
  maintenanceHistory = [],
  loading = false,
}) => {
  const [selectedStayId, setSelectedStayId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelInput, setShowCancelInput] = useState(null); // bookingId
  const [cancelReason, setCancelReason] = useState("");
  const handleCancelBooking = async (bookingId) => {
    try {
      // console.log("Cancel Booking ID:", bookingId);
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${baseurl}/auth/bookings/${bookingId}/cancel`,
        { reason: cancelReason },
        {
          withCredentials: true, // Automatically send cookies
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
          },
        }
      );

      toast.success(res.data.message || "Booking cancelled successfully");
      setShowCancelInput(null);
      setCancelReason("");
      window.location.reload(); // or refetch data
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

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
    // console.log("Selected Stay:", selectedStay);
    // console.log("User ID:", user._id);
    // console.log("Selected Stay Student ID:", selectedStay.student._id);
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
          withCredentials: true, // Automatically send cookies
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
          },
        }
      );
      toast.success("Maintenance request submitted successfully!");
      //  alert("Maintenance request submitted successfully!");
      // console.log("Response:", response.data);
      // Optionally, reset form fields
      setTitle("");
      setDescription("");
      setSelectedStayId("");
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      // alert("There was an error submitting the request. Please try again.");
      toast.error(
        error.response?.data?.message || "Failed to submit maintenance request"
      );
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
      {/* pending stay section */}
      {pendingStay?.length > 0 ? (
        <div className="space-y-6 mb-6">
          <h3 className="text-lg font-semibold">
            Pending Accommodations ({pendingStay.length})
          </h3>

          {pendingStay.map((stay, index) => (
            <div
              key={stay._id || index}
              className="bg-white shadow-md p-6 rounded-xl border-l-4 border-yellow-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <MdOutlineHome className="text-blue-500" />
                    {stay.pgOwner?.messName || "PG Name Not Available"}
                  </h2>
                  {pendingStay.length > 1 && (
                    <span className="text-sm text-gray-500">
                      Stay #{index + 1}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <MdPersonOutline /> Owner Details
                  </h4>
                  <div className="pl-6 space-y-2">
                    <p className="text-sm text-gray-600">
                      {stay.pgOwner?.firstName} {stay.pgOwner?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MdEmail /> {stay.pgOwner?.email || "Email not specified"}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MdPhone />{" "}
                      {stay.pgOwner?.mobileNo || "Phone not specified"}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <HiOutlineLocationMarker />{" "}
                      {stay.pgOwner?.address || "Address not specified"}
                    </p>
                  </div>
                </div>

                {/* Stay Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <FaBed /> Room Details
                  </h4>
                  <div className="pl-6 space-y-2">
                    <p className="text-sm text-gray-600">
                      {stay.room || "Room not specified"}
                      {stay.bedsBooked && (
                        <span>
                          {" "}
                          ({stay.bedsBooked} bed{stay.bedsBooked > 1 ? "s" : ""}
                          )
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaRupeeSign />
                      {stay.payment?.totalAmount ? (
                        <>
                          ₹{stay.payment.totalAmount}
                          {stay.pricePerHead && (
                            <span> (₹{stay.pricePerHead}/month)</span>
                          )}
                        </>
                      ) : (
                        "Price not available"
                      )}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaCalendarAlt />
                      {stay.period?.startDate
                        ? new Date(stay.period.startDate).toLocaleDateString()
                        : "Start date not specified"}{" "}
                      -{" "}
                      {stay.period?.endDate
                        ? new Date(stay.period.endDate).toLocaleDateString()
                        : "End date not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {stay.pgOwner?.facility?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Amenities</h4>
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

              {/* Action Buttons: Cancel + Contact */}
              <div className=" px-6 py-4 border-t border-gray-200 flex justify-between items-center mt-6">
                {/* <div className="flex gap-3 w-full md:w-auto">
                  {showCancelInput === stay._id ? (
                    <div className="space-y-2 w-full">
                      <textarea
                        rows="3"
                        className="w-full border rounded p-2 text-sm"
                        placeholder="Optional: Reason for cancellation"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelBooking(stay._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          Submit Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowCancelInput(null);
                            setCancelReason("");
                          }}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCancelInput(stay._id)}
                      className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  )}

                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Contact Owner
                  </button>
                </div> */}
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto md:items-start">
                  {showCancelInput === stay._id ? (
                    <div className="space-y-2 w-full w-auto">
                      <textarea
                        rows="3"
                        className="w-full border rounded p-2 text-sm"
                        placeholder="Optional: Reason for cancellation"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelBooking(stay._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          Submit Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowCancelInput(null);
                            setCancelReason("");
                          }}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCancelInput(stay._id)}
                      className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  )}

                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 self-start">
                    Contact Owner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md p-6 rounded-xl mb-6 text-center">
          <MdOutlineHome className="mx-auto text-4xl text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">
            No Pending Stay
          </h3>
          <p className="text-gray-500 mt-1">
            You don't have any Pending accommodations right now.
          </p>
        </div>
      )}

      {/* Upcoming Stays Section - Enhanced UI */}
      {upcomingStay?.length > 0 ? (
        <div className="space-y-6 mb-6">
          <h3 className="text-lg font-semibold">
            Upcoming Accommodations ({upcomingStay.length})
          </h3>

          {upcomingStay.map((stay, index) => (
            <div
              key={stay._id || index}
              className="bg-white shadow-md p-6 rounded-xl border-l-4 border-blue-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <MdOutlineHome className="text-blue-500" />
                    {stay.pgOwner?.messName || "PG Name Not Available"}
                  </h2>
                  {upcomingStay.length > 1 && (
                    <span className="text-sm text-gray-500">
                      Stay #{index + 1}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <MdPersonOutline /> Owner Details
                  </h4>
                  <div className="pl-6 space-y-2">
                    <p className="text-sm text-gray-600">
                      {stay.pgOwner?.firstName} {stay.pgOwner?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MdEmail /> {stay.pgOwner?.email || "Email not specified"}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MdPhone />{" "}
                      {stay.pgOwner?.mobileNo || "Phone not specified"}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <HiOutlineLocationMarker />{" "}
                      {stay.pgOwner?.address || "Address not specified"}
                    </p>
                  </div>
                </div>

                {/* Stay Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <FaBed /> Room Details
                  </h4>
                  <div className="pl-6 space-y-2">
                    <p className="text-sm text-gray-600">
                      {stay.room || "Room not specified"}
                      {stay.bedsBooked && (
                        <span>
                          {" "}
                          ({stay.bedsBooked} bed{stay.bedsBooked > 1 ? "s" : ""}
                          )
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaRupeeSign />
                      {stay.payment?.totalAmount ? (
                        <>
                          ₹{stay.payment.totalAmount}
                          {stay.pricePerHead && (
                            <span> (₹{stay.pricePerHead}/month)</span>
                          )}
                        </>
                      ) : (
                        "Price not available"
                      )}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaCalendarAlt />
                      {stay.period?.startDate
                        ? new Date(stay.period.startDate).toLocaleDateString()
                        : "Start date not specified"}{" "}
                      -{" "}
                      {stay.period?.endDate
                        ? new Date(stay.period.endDate).toLocaleDateString()
                        : "End date not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {stay.pgOwner?.facility?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Amenities</h4>
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

              {/* Action Buttons: Cancel + Contact */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center mt-6">
                <div className="flex gap-3 w-full md:w-auto">
                  {showCancelInput === stay._id ? (
                    <div className="space-y-2 w-full">
                      <textarea
                        rows="3"
                        className="w-full border rounded p-2 text-sm"
                        placeholder="Optional: Reason for cancellation"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelBooking(stay._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          Submit Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowCancelInput(null);
                            setCancelReason("");
                          }}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCancelInput(stay._id)}
                      className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  )}

                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Contact Owner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md p-6 rounded-xl mb-6 text-center">
          <MdOutlineHome className="mx-auto text-4xl text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">
            No Upcoming Stay
          </h3>
          <p className="text-gray-500 mt-1">
            You don't have any upcoming accommodations right now.
          </p>
        </div>
      )}

      {/* Past Stays Section */}
      {pastStay?.length > 0 ? (
        <div className="space-y-6 mb-6">
          <h3 className="text-lg font-semibold">
            Past Accommodations ({pastStay.length})
          </h3>

          {pastStay.map((stay, index) => (
            <div
              key={stay._id || index}
              className="bg-white shadow-md p-6 rounded-xl border-l-4 border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <MdOutlineHome className="text-blue-500" />
                    {stay.pgOwner?.messName || "PG Name Not Available"}
                  </h2>
                  {pastStay.length > 1 && (
                    <span className="text-sm text-gray-500">
                      Stay #{index + 1}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <MdPersonOutline /> Owner Details
                  </h4>
                  <div className="pl-6 space-y-2">
                    <p className="text-sm text-gray-600">
                      {stay.pgOwner?.firstName} {stay.pgOwner?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MdEmail /> {stay.pgOwner?.email || "Email not specified"}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MdPhone />{" "}
                      {stay.pgOwner?.mobileNo || "Phone not specified"}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <HiOutlineLocationMarker />{" "}
                      {stay.pgOwner?.address || "Address not specified"}
                    </p>
                  </div>
                </div>

                {/* Stay Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <FaBed /> Room Details
                  </h4>
                  <div className="pl-6 space-y-2">
                    <p className="text-sm text-gray-600">
                      {stay.room || "Room not specified"}
                      {stay.bedsBooked && (
                        <span>
                          {" "}
                          ({stay.bedsBooked} bed{stay.bedsBooked > 1 ? "s" : ""}
                          )
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaRupeeSign />
                      {stay.payment?.totalAmount ? (
                        <>
                          ₹{stay.payment.totalAmount}
                          {stay.pricePerHead && (
                            <span> (₹{stay.pricePerHead}/month)</span>
                          )}
                        </>
                      ) : (
                        "Price not available"
                      )}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaCalendarAlt />
                      {stay.period?.startDate
                        ? new Date(stay.period.startDate).toLocaleDateString()
                        : "Start date not specified"}{" "}
                      -{" "}
                      {stay.period?.endDate
                        ? new Date(stay.period.endDate).toLocaleDateString()
                        : "End date not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {stay.pgOwner?.facility?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Amenities</h4>
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

              {/* Action Buttons: Cancel + Contact */}
              {/* <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center mt-6">
                <div className="flex gap-3 w-full md:w-auto">
                  {showCancelInput === stay._id ? (
                    <div className="space-y-2 w-full">
                      <textarea
                        rows="3"
                        className="w-full border rounded p-2 text-sm"
                        placeholder="Optional: Reason for cancellation"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelBooking(stay._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          Submit Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowCancelInput(null);
                            setCancelReason("");
                          }}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCancelInput(stay._id)}
                      className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  )}

                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Contact Owner
                  </button>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md p-6 rounded-xl mb-6 text-center">
          <MdOutlineHome className="mx-auto text-4xl text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">No Past Stay</h3>
          <p className="text-gray-500 mt-1">
            You don't have any Past accommodations right now.
          </p>
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
          <h3 className="text-lg font-semibold mb-2">Maintenance History</h3>
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4 max-h-[400px] overflow-y-auto">
            {maintenanceHistory.length > 0 ? (
              maintenanceHistory.map((item, index) => (
                <ExpandableMaintenanceItem key={index} item={item} />
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No maintenance history found.
              </p>
            )}
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

const ExpandableMaintenanceItem = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);

  const statusColors = {
    "in-progress": "bg-yellow-400",
    resolved: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <div className="border p-4 rounded-md relative bg-gray-50">
      {/* Top row: Title + Status */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-sm">{item.title}</h3>
        <span
          className={`text-white text-xs px-2 py-1 rounded ${
            statusColors[item.status] || "bg-gray-400"
          }`}
        >
          {item.status?.replace("-", " ").toUpperCase()}
        </span>
      </div>

      {/* Reported on */}
      <p className="text-xs text-gray-500 mt-1">
        Reported on {formatDate(item.createdAt)}
      </p>

      {/* Toggle Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-blue-600 text-xs mt-2 hover:underline focus:outline-none"
      >
        {showDetails ? "Hide Details" : "View Details"}
      </button>

      {/* Expanded details */}
      {showDetails && (
        <div className="mt-2 text-xs text-gray-700 space-y-1">
          <p>
            <strong>Mess:</strong> {item.messName || "N/A"}
          </p>
          <p>
            <strong>Room:</strong> {item.roomNo || "N/A"}
          </p>
          <p>
            <strong>Owner:</strong> {item.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {item.ownerEmail || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default DashboardContent;
// {currentStay?.length > 0 ? (
//   <div className="space-y-6 mb-6">
//     <h3 className="text-lg font-semibold">
//       Current Accommodations ({currentStay.length})
//     </h3>

//     {currentStay.map((stay, index) => (
//       <div
//         key={stay._id || index}
//         className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-200"
//       >
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h2 className="text-xl font-bold flex items-center gap-2">
//               <MdOutlineHome className="text-blue-500" />
//               {stay.pgOwner?.messName || "PG Name Not Available"}
//             </h2>
//             {currentStay.length > 1 && (
//               <span className="text-sm text-gray-500">
//                 Stay #{index + 1}
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Owner Info */}
//           <div className="space-y-3">
//             <h4 className="font-medium text-gray-700 flex items-center gap-2">
//               <MdPersonOutline /> Owner Details
//             </h4>
//             <div className="pl-6 space-y-2">
//               <p className="text-sm text-gray-600">
//                 {stay.pgOwner?.firstName} {stay.pgOwner?.lastName}
//               </p>
//               <p className="text-sm text-gray-600 flex items-center gap-2">
//                 <MdEmail /> {stay.pgOwner?.email || "Email not specified"}
//               </p>
//               <p className="text-sm text-gray-600 flex items-center gap-2">
//                 <MdPhone />{" "}
//                 {stay.pgOwner?.mobileNo || "Phone not specified"}
//               </p>
//               <p className="text-sm text-gray-600 flex items-center gap-2">
//                 <HiOutlineLocationMarker />{" "}
//                 {stay.pgOwner?.address || "Address not specified"}
//               </p>
//             </div>
//           </div>

//           {/* Stay Info */}
//           <div className="space-y-3">
//             <h4 className="font-medium text-gray-700 flex items-center gap-2">
//               <FaBed /> Room Details
//             </h4>
//             <div className="pl-6 space-y-2">
//               <p className="text-sm text-gray-600">
//                 {stay.room || "Room not specified"}
//                 {stay.bedsBooked && (
//                   <span>
//                     {" "}
//                     ({stay.bedsBooked} bed{stay.bedsBooked > 1 ? "s" : ""}
//                     )
//                   </span>
//                 )}
//               </p>
//               <p className="text-sm text-gray-600 flex items-center gap-2">
//                 <FaRupeeSign />
//                 {stay.payment?.totalAmount ? (
//                   <>
//                     ₹{stay.payment.totalAmount}
//                     {stay.pricePerHead && (
//                       <span> (₹{stay.pricePerHead}/month)</span>
//                     )}
//                   </>
//                 ) : (
//                   "Price not available"
//                 )}
//               </p>
//               <p className="text-sm text-gray-600 flex items-center gap-2">
//                 <FaCalendarAlt />
//                 {stay.period?.startDate
//                   ? new Date(stay.period.startDate).toLocaleDateString()
//                   : "Start date not specified"}{" "}
//                 -{" "}
//                 {stay.period?.endDate
//                   ? new Date(stay.period.endDate).toLocaleDateString()
//                   : "End date not specified"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Amenities */}
//         {stay.pgOwner?.facility?.length > 0 && (
//           <div className="mt-4">
//             <h4 className="font-medium text-gray-700 mb-2">Amenities</h4>
//             <div className="flex flex-wrap gap-2">
//               {stay.pgOwner.facility.includes("A/C") && (
//                 <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
//                   <MdOutlineAcUnit className="text-blue-500" /> A/C
//                 </span>
//               )}
//               {stay.pgOwner.facility.includes("TV") && (
//                 <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
//                   <MdTv className="text-blue-500" /> TV
//                 </span>
//               )}
//               {stay.pgOwner.facility.includes("Power Backup") && (
//                 <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
//                   <MdOutlinePower className="text-blue-500" /> Power
//                   Backup
//                 </span>
//               )}
//               {stay.pgOwner.facility.includes("WiFi") && (
//                 <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
//                   <MdOutlineWifi className="text-blue-500" /> WiFi
//                 </span>
//               )}
//               {stay.pgOwner.facility.includes("Kitchen") && (
//                 <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
//                   <MdKitchen className="text-blue-500" /> Kitchen
//                 </span>
//               )}
//               {stay.pgOwner.facility.includes("Tank Water") && (
//                 <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
//                   <MdOpacity className="text-blue-500" /> Tank Water
//                 </span>
//               )}
//               {stay.pgOwner.facility.includes("Double Bed") && (
//                 <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
//                   <MdBed className="text-blue-500" /> Double Bed
//                 </span>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Buttons: Invoice + Feedback */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           {stay._id && (
//             <button
//               onClick={() => handleDownloadInvoice(stay._id)}
//               className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-700 bg-blue-600 text-white text-sm font-medium"
//             >
//               <FaDownload /> Download Invoice
//             </button>
//           )}
//           <button
//             onClick={() =>
//               setShowFeedbackIndex(
//                 showFeedbackIndex === index ? null : index
//               )
//             }
//             className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-yellow-500 bg-yellow-400 text-white text-sm font-medium"
//           >
//             <FaPaperPlane /> Give Feedback
//           </button>
//         </div>

//         {/* Feedback Form */}
//         {showFeedbackIndex === index && (
//           <div className="mt-4 p-4 border border-yellow-300 rounded-lg bg-yellow-50">
//             <div className="mb-3">
//               <p className="text-sm font-medium mb-1">Your Rating:</p>
//               <div className="flex gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     onClick={() =>
//                       setRatings((prev) => ({
//                         ...prev,
//                         [stay._id]: star,
//                       }))
//                     }
//                     className="text-2xl text-yellow-500"
//                   >
//                     {ratings[stay._id] >= star ? (
//                       <AiFillStar />
//                     ) : (
//                       <AiOutlineStar />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="mb-3">
//               <textarea
//                 rows={4}
//                 className="w-full p-2 border border-gray-300 rounded-lg text-sm"
//                 placeholder="Write your feedback..."
//                 value={comments[stay._id] || ""}
//                 onChange={(e) =>
//                   setComments((prev) => ({
//                     ...prev,
//                     [stay._id]: e.target.value,
//                   }))
//                 }
//               ></textarea>
//             </div>
//             <button
//               onClick={() =>
//                 handleFeedbackSubmit(
//                   stay._id,
//                   ratings[stay._id],
//                   comments[stay._id]
//                 )
//               }
//               className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
//             >
//               <FaPaperPlane /> Submit Feedback
//             </button>
//           </div>
//         )}
//       </div>
//     ))}
//   </div>
// ) : (
//   <div className="bg-white shadow-md p-6 rounded-xl mb-6 text-center">
//     <MdOutlineHome className="mx-auto text-4xl text-gray-400 mb-3" />
//     <h3 className="text-lg font-semibold text-gray-700">
//       No Current Stay
//     </h3>
//     <p className="text-gray-500 mt-1">
//       You don't have any active accommodations right now.
//     </p>
//   </div>
// )}
