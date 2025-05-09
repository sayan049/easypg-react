
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../contexts/AuthContext";
// import { toast, ToastContainer } from "react-toastify";
// import { bookingRequestUrl } from "../constant/urls";
// import "react-toastify/dist/ReactToastify.css";

// export default function BookingPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // const { owner } = location.state || {};
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [showAllPhotos, setShowAllPhotos] = useState(false);
//   const [duration, setDuration] = useState(6);
//   const [checkInDate, setCheckInDate] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { user } = useAuth();
//   // const queryParams = new URLSearchParams(location.search);
//   // const owner = JSON.parse(queryParams.get("owner"))
//   //   ? JSON.parse(queryParams.get("owner"))
//   //   : null;
//   const queryParams = new URLSearchParams(location.search);
// const encoded = queryParams.get("owner");
// const owner = encoded ? JSON.parse(decodeURIComponent(atob(encoded))) : null;


//   // Convert bedCount string to number
//   const bedCountToNumber = {
//     one: 1,
//     two: 2,
//     three: 3,
//     four: 4,
//     five: 5,
//   };

//   const handleBookingRequest = async () => {
//     try {
//       setIsLoading(true);

//       // Validate inputs
//       if (!selectedRoom || !checkInDate) {
//         toast.error("Please select a room and check-in date");
//         setIsLoading(false);
//         return;
//       }

//       const selectedRoomInfo = owner?.roomInfo?.find(
//         (r) => r._id === selectedRoom
//       );

//       if (!selectedRoomInfo) {
//         toast.error("Selected room not found");
//         setIsLoading(false);
//         return;
//       }

//       // Prepare booking data
//       const bookingData = {
//         student: user.id,
//         pgOwner: owner._id,
//         room: selectedRoomInfo.room,
//         bedsBooked: 1,
//         originalBedCount: selectedRoomInfo.bedContains,
//         pricePerHead: selectedRoomInfo.pricePerHead,
//         period: {
//           startDate: checkInDate,
//           durationMonths: duration,
//         },
//         payment: {
//           totalAmount: selectedRoomInfo.pricePerHead * (duration + 1),
//           deposit: selectedRoomInfo.pricePerHead,
//         },
//         status: "pending",
//       };

//       // Make booking request
//       const { data } = await axios.post(bookingRequestUrl, bookingData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });

//       if (data.success) {
//         toast.success(data.message || "Booking request sent successfully!");
//         // Optionally navigate after success
//         // navigate('/bookings');
//       } else {
//         toast.error(data.message || "Booking request failed");
//       }
//     } catch (error) {
//       console.error("Booking error:", error);

//       // Handle error response from server
//       if (error.response) {
//         const serverMessage =
//           error.response.data?.message ||
//           error.response.data?.error ||
//           "Booking request failed";
//         toast.error(serverMessage);
//       }
//       // Handle network errors
//       else if (error.request) {
//         toast.error(
//           "Network error. Please check your connection and try again."
//         );
//       }
//       // Handle other errors
//       else {
//         toast.error("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const primaryColor = "#2CA4B5";

//   return (
//     <div className="p-4 md:p-8 max-w-[100rem] mx-auto space-y-6 font-sans">
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
//       <div className="flex items-center gap-4 mb-6 border-b pb-4 border-gray-300 justify-between">
//         <div className="flex items-center gap-2">
//           <img
//             src="assets/backIcon.png"
//             className="h-6 cursor-pointer"
//             alt=""
//             onClick={() => navigate(-1)}
//           />
//           <h1 className="text-xl font-bold">Confirm Your Booking</h1>
//         </div>
//         <div className="">
//           <img src="assets/share.png" className="h-5" alt="" />
//         </div>
//       </div>

//       {owner?.messName && (
//         <div className="flex mb-6 flex-col justify-start">
//           <h2 className="text-2xl font-bold">{owner?.messName}</h2>
//           <div className="flex gap-4 flex-col md:flex-row">
//             <p className="flex items-center text-gray-600 text-base gap-2">
//               <img src="assets/greyMarker.png" className="h-4" alt="" />
//               {owner?.address}
//             </p>
//             <p className="flex items-center text-gray-600 text-base gap-2">
//               <img src="assets/phoneIcon.png" className="h-5" alt="" />
//               {owner?.mobileNo}
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Side */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="rounded-2xl shadow-md bg-white">
//             <div className="p-4 space-y-4">
//               <h2 className="text-xl font-semibold">Select a Room</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {owner?.roomInfo?.map((room) => (
//                   <div
//                     key={room._id}
//                     className={`border rounded-2xl p-4 space-y-2 ${
//                       room.roomAvailable
//                         ? selectedRoom === room._id
//                           ? "border-blue-500"
//                           : "border-gray-200"
//                         : "border-red-500"
//                     }`}
//                     style={{
//                       borderColor: !room.roomAvailable
//                         ? "red"
//                         : selectedRoom === room._id
//                         ? primaryColor
//                         : undefined,
//                     }}
//                   >
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-semibold text-lg">{room.room}</h3>
//                       <span
//                         className={`text-sm px-2 py-1 rounded-full ${
//                           room.roomAvailable
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {room.roomAvailable
//                           ? `${bedCountToNumber[room.bedContains]} Bed${
//                               bedCountToNumber[room.bedContains] > 1 ? "s" : ""
//                             } Available`
//                           : "Fully Booked"}
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-gray-600 text-sm">
//                       {owner.facility?.slice(0, 3).map((facility, index) => (
//                         <span key={index}>{facility}</span>
//                       ))}
//                     </div>
//                     <div
//                       className="text-lg font-bold"
//                       style={{ color: primaryColor }}
//                     >
//                       ₹{room.pricePerHead?.toLocaleString()}
//                       <span className="text-sm font-medium text-gray-500">
//                         /mo
//                       </span>
//                     </div>
//                     <button
//                       onClick={() =>
//                         room.roomAvailable && setSelectedRoom(room._id)
//                       }
//                       disabled={!room.roomAvailable}
//                       className={`w-full py-2 px-4 rounded-md font-semibold ${
//                         selectedRoom === room._id ? "text-white" : "border"
//                       } ${
//                         !room.roomAvailable
//                           ? "opacity-50 cursor-not-allowed"
//                           : ""
//                       }`}
//                       style={{
//                         backgroundColor:
//                           selectedRoom === room._id && room.roomAvailable
//                             ? primaryColor
//                             : "transparent",
//                         borderColor: !room.roomAvailable ? "red" : primaryColor,
//                         color:
//                           selectedRoom === room._id && room.roomAvailable
//                             ? "white"
//                             : primaryColor,
//                       }}
//                     >
//                       {selectedRoom === room._id ? "Selected" : "Select"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="rounded-2xl shadow-md bg-white">
//             <div className="p-4">
//               <h2 className="text-xl font-semibold mb-4">Room Preview</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {(showAllPhotos
//                   ? owner?.messPhoto
//                   : owner?.messPhoto?.slice(0, 4)
//                 )?.map((image, index) => (
//                   <img
//                     key={index}
//                     src={image}
//                     alt={`Room ${index + 1}`}
//                     className="rounded-2xl w-full h-48 object-cover"
//                   />
//                 ))}
//               </div>
//               {owner?.messPhoto?.length > 4 && (
//                 <button
//                   onClick={() => setShowAllPhotos(!showAllPhotos)}
//                   className="text-blue-600 underline text-sm mt-2 w-full"
//                 >
//                   {showAllPhotos ? "View Less" : "View More"}
//                 </button>
//               )}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
//                 <ul className="space-y-1">
//                   {owner?.facility?.slice(0, 3).map((item, index) => (
//                     <li key={index}>✅ {item}</li>
//                   ))}
//                 </ul>
//                 <ul className="space-y-1">
//                   {owner?.facility?.slice(3, 6).map((item, index) => (
//                     <li key={index}>✅ {item}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Booking Summary */}
//         <div className="space-y-6">
//           <div className="rounded-2xl shadow-md bg-white">
//             <div className="p-4 space-y-4">
//               <h2 className="text-xl font-semibold">Booking Summary</h2>

//               <div>
//                 <label className="text-sm">Check-in Date</label>
//                 <input
//                   type="date"
//                   className="mt-2 border rounded-md w-full p-2"
//                   value={checkInDate}
//                   min={new Date().toISOString().split("T")[0]}
//                   onChange={(e) => setCheckInDate(e.target.value)}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-sm">Duration (months)</label>
//                 <select
//                   className="mt-2 border rounded-md w-full p-2"
//                   value={duration}
//                   onChange={(e) => setDuration(Number(e.target.value))}
//                 >
//                   {[1, 2, 3, 6, 12].map((num) => (
//                     <option key={num} value={num}>
//                       {num} month{num !== 1 ? "s" : ""}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {selectedRoom && (
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Room:</span>
//                     <span>
//                       {
//                         owner?.roomInfo?.find((r) => r._id === selectedRoom)
//                           ?.room
//                       }
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Monthly Rent:</span>
//                     <span>
//                       ₹
//                       {owner?.roomInfo
//                         ?.find((r) => r._id === selectedRoom)
//                         ?.pricePerHead?.toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Duration:</span>
//                     <span>
//                       {duration} month{duration !== 1 ? "s" : ""}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Security Deposit:</span>
//                     <span>
//                       ₹
//                       {owner?.roomInfo
//                         ?.find((r) => r._id === selectedRoom)
//                         ?.pricePerHead?.toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="border-t pt-2 flex justify-between font-semibold">
//                     <span>Total Amount:</span>
//                     <span style={{ color: primaryColor }}>
//                       ₹
//                       {(
//                         owner?.roomInfo?.find((r) => r._id === selectedRoom)
//                           ?.pricePerHead *
//                         (duration + 1)
//                       )?.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <button
//             className={`w-full mt-4 py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
//               !selectedRoom || !checkInDate || isLoading
//                 ? "opacity-70 cursor-not-allowed"
//                 : ""
//             }`}
//             style={{ backgroundColor: primaryColor }}
//             onClick={handleBookingRequest}
//             disabled={!selectedRoom || !checkInDate || isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               "Request Booking"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import { bookingRequestUrl } from "../constant/urls"
import "react-toastify/dist/ReactToastify.css"
import { ArrowLeft, Share, MapPin, Phone, Check, Calendar, Clock, Home, Shield, CreditCard } from "lucide-react"

export default function BookingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [duration, setDuration] = useState(6)
  const [checkInDate, setCheckInDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const queryParams = new URLSearchParams(location.search)
  const encoded = queryParams.get("owner")
  const owner = encoded ? JSON.parse(decodeURIComponent(atob(encoded))) : null

  // Convert bedCount string to number
  const bedCountToNumber = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  }

  const handleBookingRequest = async () => {
    try {
      setIsLoading(true)

      // Validate inputs
      if (!selectedRoom || !checkInDate) {
        toast.error("Please select a room and check-in date")
        setIsLoading(false)
        return
      }

      const selectedRoomInfo = owner?.roomInfo?.find((r) => r._id === selectedRoom)

      if (!selectedRoomInfo) {
        toast.error("Selected room not found")
        setIsLoading(false)
        return
      }

      // Prepare booking data
      const bookingData = {
        student: user.id,
        pgOwner: owner._id,
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
      }

      // Make booking request
      const { data } = await axios.post(bookingRequestUrl, bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (data.success) {
        toast.success(data.message || "Booking request sent successfully!")
        // Optionally navigate after success
        // navigate('/bookings');
      } else {
        toast.error(data.message || "Booking request failed")
      }
    } catch (error) {
      console.error("Booking error:", error)

      // Handle error response from server
      if (error.response) {
        const serverMessage = error.response.data?.message || error.response.data?.error || "Booking request failed"
        toast.error(serverMessage)
      }
      // Handle network errors
      else if (error.request) {
        toast.error("Network error. Please check your connection and try again.")
      }
      // Handle other errors
      else {
        toast.error("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

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
              <h1 className="text-xl font-bold text-gray-900">Book Your Stay</h1>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Share">
              <Share className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Details */}
        {owner?.messName && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{owner?.messName}</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{owner?.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{owner?.mobileNo}</span>
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
                  {owner?.roomInfo?.map((room) => (
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
                          <h3 className="font-semibold text-lg text-gray-900">{room.room}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              room.roomAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {room.roomAvailable
                              ? `${bedCountToNumber[room.bedContains]} Bed${
                                  bedCountToNumber[room.bedContains] > 1 ? "s" : ""
                                } Available`
                              : "Fully Booked"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {owner.facility?.slice(0, 3).map((facility, index) => (
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
                          <span className="text-sm text-gray-500 ml-1">/month</span>
                        </div>

                        <button
                          onClick={() => room.roomAvailable && setSelectedRoom(room._id)}
                          disabled={!room.roomAvailable}
                          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                            !room.roomAvailable
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-red-500"
                              : selectedRoom === room._id
                                ? "bg-teal-600 text-white"
                                : "bg-white text-teal-600 border border-teal-600 hover:bg-teal-50"
                          }`}
                        >
                          {selectedRoom === room._id ? "Selected" : "Select Room"}
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Room Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(showAllPhotos ? owner?.messPhoto : owner?.messPhoto?.slice(0, 6))?.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Room ${index + 1}`}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
                {owner?.messPhoto?.length > 6 && (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {owner?.facility?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
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
                      {[1, 2, 3, 6, 12].map((num) => (
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
                            {owner?.roomInfo?.find((r) => r._id === selectedRoom)?.room}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Monthly Rent:</span>
                          <span className="font-medium">
                            ₹{owner?.roomInfo?.find((r) => r._id === selectedRoom)?.pricePerHead?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {duration} month{duration !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Security Deposit:</span>
                          <span className="font-medium">
                            ₹{owner?.roomInfo?.find((r) => r._id === selectedRoom)?.pricePerHead?.toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total Amount:</span>
                            <span className="text-xl font-bold text-teal-600">
                              ₹
                              {(
                                owner?.roomInfo?.find((r) => r._id === selectedRoom)?.pricePerHead *
                                (duration + 1)
                              )?.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Includes security deposit and {duration} month{duration !== 1 ? "s" : ""} rent
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
  )
}
