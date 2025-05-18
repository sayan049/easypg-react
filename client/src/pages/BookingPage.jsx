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
  Copy,
  Link,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";

// components/BookingSkeleton.jsx
export const BookingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Details Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-3">
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="flex gap-4">
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Selection Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl p-5"
                  >
                    <div className="flex justify-between mb-3">
                      <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
                      <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className="h-4 w-16 bg-gray-200 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                </div>
                <div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="h-12 w-full bg-gray-200 rounded-lg mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

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
        withCredentials: true, // Automatically send cookies
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
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

  // share section
  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocialMedia = (platform) => {
    const shareUrl = window.location.href;
    const title = `Check out ${messData?.messName || "this mess"} on messmate`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(
            title
          )}&body=${encodeURIComponent(`${title}: ${shareUrl}`)}`
        );
        break;
      default:
        break;
    }

    setShowShareMenu(false);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `Check out ${messData?.messName || "this mess"} on HostelHub`,
        text: `I found this great mess on HostelHub: ${messData?.messName}`,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Native share not supported or was cancelled", err);
    }
    setShowShareMenu(false);
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

            {/* share */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Share"
                onClick={handleShareClick}
              >
                <Share className="h-5 w-5 text-gray-600" />
              </button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    {navigator.share ? (
                      <button
                        onClick={handleNativeShare}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Share via...
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-2 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy link
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => shareOnSocialMedia("facebook")}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                          Share on Facebook
                        </button>
                        <button
                          onClick={() => shareOnSocialMedia("twitter")}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                          Share on Twitter
                        </button>
                        <button
                          onClick={() => shareOnSocialMedia("email")}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Share via Email
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
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
                <span>{messData?.mobileNo.slice(0,4)}xxxxxx</span>
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
