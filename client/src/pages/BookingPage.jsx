"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { bookingRequestUrl } from "../constant/urls";
import "react-toastify/dist/ReactToastify.css";
import { viewDetailsUrl } from "../constant/urls";
import {
  ArrowLeft,
  Share,
  MapPin,
  Phone,
  Check,
  Calendar,
  Clock,
  Home,
  Shield,
  CreditCard,
} from "lucide-react";

const BookingSkeleton = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [duration, setDuration] = useState(1);

  const rooms = [
    {
      id: 1,
      name: "RoomNo-1",
      features: ["AC", "TV"],
      available: true,
      price: 65365,
    },
    {
      id: 2,
      name: "RoomNo-2",
      features: ["AC", "TV"],
      available: true,
      price: 434553,
    },
    {
      id: 3,
      name: "RoomNo-3",
      features: ["AC", "TV"],
      available: true,
      price: 499,
      beds: 2,
    },
    { id: 4, name: "RoomNo-4", features: ["AC", "TV"], available: false },
    { id: 5, name: "RoomNo-5", features: ["AC", "TV"], available: false },
  ];

  const handleBooking = () => {
    // Booking logic here
    // alert(`Booking confirmed for ${selectedRoom.name}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Stay</h1>
          <div className="mt-2 text-gray-600">
            <p>Tanmoy magi</p>
            <p>makaut ℃, 7679766470</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Room Selection Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Select Your Room
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`border rounded-lg p-4 ${
                    room.available
                      ? "hover:border-blue-500 cursor-pointer"
                      : "opacity-60"
                  } ${
                    selectedRoom?.id === room.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => room.available && setSelectedRoom(room)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">
                      {room.name}
                      {!room.available && (
                        <span className="text-red-500 ml-2">
                          (Fully Booked)
                        </span>
                      )}
                    </h3>
                    {room.beds && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {room.beds} beds Available
                      </span>
                    )}
                  </div>

                  <ul className="mt-2 space-y-1">
                    {room.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        <span className="mr-2">✓</span> {feature}
                      </li>
                    ))}
                  </ul>

                  {room.available && room.price && (
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-lg font-bold">
                        ¥{room.price.toLocaleString()} / month
                      </span>
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoom(room);
                        }}
                      >
                        Select Room
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Booking Summary Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Booking Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (months)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Security Assurance */}
          <div className="p-6 border-b border-gray-200 bg-blue-50">
            <p className="text-blue-800 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Secure booking process with 100% data protection
            </p>
          </div>

          {/* Confirm Booking Button */}
          <div className="p-6">
            <button
              onClick={handleBooking}
              disabled={!selectedRoom || !checkInDate}
              className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                selectedRoom && checkInDate
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } transition`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [duration, setDuration] = useState(6);
  const [checkInDate, setCheckInDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messData, setMessData] = useState(null);
  const { user, IsAuthenticated, isOwnerAuthenticated } = useAuth();

  const { messId } = useParams();

  useEffect(() => {
    const fetchMessDetails = async () => {
      try {
        const res = await axios.get(`${viewDetailsUrl}/${messId}`);
        setMessData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch mess details:", err);
      }
    };

    fetchMessDetails();
  }, [messId]);

  // Convert bedCount string to number
  const bedCountToNumber = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  };

  const handleBookingRequest = async () => {
    console.log(
      "auth",
      parseInt(messData.minimumBookingDuration.split(" ")[0]),
      duration
    );
    if (isOwnerAuthenticated) {
      return toast.error("mess owners can't book messes");
    }
    if (!IsAuthenticated) return toast.error("please login to book any mess");
    if (duration < parseInt(messData.minimumBookingDuration.split(" ")[0]))
      return toast.error(
        `Minimum booking duration is ${messData.minimumBookingDuration}`
      );
    try {
      setIsLoading(true);

      // Validate inputs
      if (!selectedRoom || !checkInDate) {
        toast.error("Please select a room and check-in date");
        setIsLoading(false);
        return;
      }

      const selectedRoomInfo = messData?.roomInfo?.find(
        (r) => r._id === selectedRoom
      );

      if (!selectedRoomInfo) {
        toast.error("Selected room not found");
        setIsLoading(false);
        return;
      }

      // Prepare booking data
      const bookingData = {
        student: user.id,
        pgOwner: messData._id,
        room: selectedRoomInfo.room,
        bedsBooked: 1,
        originalBedCount: selectedRoomInfo.bedContains,
        pricePerHead: selectedRoomInfo.pricePerHead,
        period: {
          startDate: checkInDate,
          durationMonths: duration,
        },
        payment: {
          totalAmount: selectedRoomInfo.pricePerHead * (duration + 1),
          deposit: selectedRoomInfo.pricePerHead,
        },
        status: "pending",
      };

      // Make booking request
      const { data } = await axios.post(bookingRequestUrl, bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (data.success) {
        toast.success(data.message || "Booking request sent successfully!");
        // Optionally navigate after success
        // navigate('/bookings');
      } else {
        toast.error(data.message || "Booking request failed");
      }
    } catch (error) {
      console.error("Booking error:", error);

      // Handle error response from server
      if (error.response) {
        const serverMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Booking request failed";
        toast.error(serverMessage);
      }
      // Handle network errors
      else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      }
      // Handle other errors
      else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!messData) return <BookingSkeleton />;
  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                Book Your Stay
              </h1>
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Share"
            >
              <Share className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Details */}
        {messData?.messName && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {messData?.messName}
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{messData?.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{messData?.mobileNo}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Selection */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-teal-600" />
                  Select Your Room
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {messData?.roomInfo?.map((room) => (
                    <div
                      key={room._id}
                      className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
                        !room.roomAvailable
                          ? "opacity-75 border border-red-500"
                          : selectedRoom === room._id
                          ? "ring-2 ring-teal-500 shadow-md"
                          : "hover:shadow-md border border-gray-200"
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {room.room}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              room.roomAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {room.roomAvailable
                              ? `${bedCountToNumber[room.bedContains]} Bed${
                                  bedCountToNumber[room.bedContains] > 1
                                    ? "s"
                                    : ""
                                } Available`
                              : "Fully Booked"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {messData.facility
                            ?.slice(0, 3)
                            .map((facility, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                              >
                                <Check className="h-3 w-3 mr-1 text-teal-600" />
                                {facility}
                              </span>
                            ))}
                        </div>

                        <div className="flex items-baseline mb-4">
                          <span className="text-2xl font-bold text-teal-600">
                            ₹{room.pricePerHead?.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            /month
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            room.roomAvailable && setSelectedRoom(room._id)
                          }
                          disabled={!room.roomAvailable}
                          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                            !room.roomAvailable
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-red-500"
                              : selectedRoom === room._id
                              ? "bg-teal-600 text-white"
                              : "bg-white text-teal-600 border border-teal-600 hover:bg-teal-50"
                          }`}
                        >
                          {selectedRoom === room._id
                            ? "Selected"
                            : "Select Room"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Preview */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Room Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(showAllPhotos
                    ? messData?.messPhoto
                    : messData?.messPhoto?.slice(0, 6)
                  )?.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Room ${index + 1}`}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
                {messData?.messPhoto?.length > 6 && (
                  <button
                    onClick={() => setShowAllPhotos(!showAllPhotos)}
                    className="mt-4 text-teal-600 font-medium hover:text-teal-700 transition-colors flex items-center"
                  >
                    {showAllPhotos ? "Show Less Photos" : "View All Photos"}
                  </button>
                )}
              </div>

              {/* Amenities */}
              <div className="px-6 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {messData?.facility?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Check className="h-4 w-4 text-teal-600 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-teal-600" />
                  Booking Summary
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      value={checkInDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Duration
                    </label>
                    <select
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    >
                      {[1, 2, 3, 6, 12, 24].map((num) => (
                        <option key={num} value={num}>
                          {num} month{num !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedRoom && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Room Type:</span>
                          <span className="font-medium">
                            {
                              messData?.roomInfo?.find(
                                (r) => r._id === selectedRoom
                              )?.room
                            }
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Monthly Rent:</span>
                          <span className="font-medium">
                            ₹
                            {messData?.roomInfo
                              ?.find((r) => r._id === selectedRoom)
                              ?.pricePerHead?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {duration} month{duration !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Security Deposit:
                          </span>
                          <span className="font-medium">
                            ₹
                            {(
                              messData?.roomInfo?.find(
                                (r) => r._id === selectedRoom
                              )?.pricePerHead * messData?.minimumSecurityDeposit
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900">
                              Total Amount:
                            </span>
                            <span className="text-xl font-bold text-teal-600">
                              ₹
                              {(
                                messData?.roomInfo?.find(
                                  (r) => r._id === selectedRoom
                                )?.pricePerHead *
                                (duration + messData?.minimumSecurityDeposit)
                              )?.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Includes security deposit and {duration} month
                            {duration !== 1 ? "s" : ""} rent
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            your security deposit will be refunded you when u
                            leave the Mess
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      className={`w-full py-3.5 px-4 rounded-lg font-medium text-white transition-all ${
                        !selectedRoom || !checkInDate || isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg"
                      }`}
                      onClick={handleBookingRequest}
                      disabled={!selectedRoom || !checkInDate || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        "Confirm Booking"
                      )}
                    </button>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                    <Shield className="h-4 w-4 mr-1 text-teal-600" />
                    Secure booking process with 100% data protection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
