// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios"; // For making API requests
// import { useSocket } from "../contexts/socketContext"; // To use socket for real-time updates
// import { useAuth } from "../contexts/AuthContext"; // To get user details

// export default function BookingPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { owner } = location.state || {};
//   const [selectedRoom, setSelectedRoom] = useState(
//     owner?.roomInfo?.[0]?._id || ""
//   );
//   const [showAllPhotos, setShowAllPhotos] = useState(false);
//   const [duration, setDuration] = useState(6); // in months
//   const [checkInDate, setCheckInDate] = useState(""); // to store check-in date
//   const socket = useSocket(); // for real-time notifications
//   const { user } = useAuth(); // To get the authenticated user

//   // console.log(owner, owner.roomInfo, "room");
//   const handleBookingRequest = async () => {
//     try {
//       const selectedRoomInfo = owner?.roomInfo?.find(
//         (r) => r._id === selectedRoom
//       );
//       const monthlyRent = selectedRoomInfo?.pricePerHead || 0;
//       const totalAmount = monthlyRent * duration + monthlyRent; // Total including deposit

//       const bookingData = {
//         studentId: user.id,
//         ownerId: owner._id,
//         room: selectedRoom,
//         checkInDate,
//         duration,
//         totalAmount,
//         roomInfo: selectedRoomInfo,
//       };

//       // Make API call to create booking
//       const response = await axios.post(`/api/bookings`, bookingData);

//       if (response.status === 200) {
//         // Emit real-time notification for the owner
//         socket.emit("new-booking-request", {
//           ownerId: owner._id,
//           bookingId: response.data.booking._id,
//           studentId: user.id,
//           room: selectedRoomInfo.room,
//           bedContains: selectedRoomInfo.bedContains,
//           pricePerHead: selectedRoomInfo.pricePerHead,
//         });

//         // Show a success message
//         alert("Booking request sent successfully!");
//         navigate(-1); // Navigate back to the previous page or to another page
//       }
//     } catch (error) {
//       console.error("Error creating booking request:", error);
//       alert("An error occurred while sending the booking request.");
//     }
//   };

//   const primaryColor = "#2CA4B5";

//   return (
//     <div className="p-4 md:p-8 max-w-[100rem] mx-auto space-y-6 font-sans">
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
//         <div className="flex  mb-6 flex-col justify-start ">
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
//       {/* <div className="flex  mb-6 flex-col justify-start ">
//         <h2 className="text-2xl font-bold">xxx</h2>
//         <div className="flex gap-4 flex-col md:flex-row">
//           <p className="flex items-center text-gray-600 text-base gap-2">
//             <img src="assets/greyMarker.png" className="h-4" alt="" />
//             xx xx xxx
//           </p>
//           <p className="flex items-center text-gray-600 text-base gap-2">
//             <img src="assets/phoneIcon.png" className='h-5'alt="" />
//             445677
//           </p>
//         </div>
//       </div> */}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Side */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="rounded-2xl shadow-md bg-white">
//             <div className="p-4 space-y-4">
//               <h2 className="text-xl font-semibold">Select a Room</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {owner?.roomInfo?.map(
//                   (room) =>
//                     room && (
//                       <div
//                         key={room._id}
//                         className={`border rounded-2xl p-4 space-y-2 ${
//                           room.roomAvailable
//                             ? selectedRoom === room._id
//                               ? ""
//                               : "border-gray-200"
//                             : "border-red-500"
//                         }`}
//                         style={{
//                           borderColor: !room.roomAvailable
//                             ? "red"
//                             : selectedRoom === room._id
//                             ? primaryColor
//                             : undefined,
//                         }}
//                       >
//                         <div className="flex justify-between items-center">
//                           <h3 className="font-semibold text-lg">{room.room}</h3>
//                           <span
//                             className={`text-sm px-2 py-1 rounded-full ${
//                               room.roomAvailable
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             {room.roomAvailable ? "Available" : "Not Available"}
//                           </span>
//                         </div>
//                         <div className="flex items-center space-x-2 text-gray-600 text-sm">
//                           <span>WiFi</span>
//                           <span>AC</span>
//                           <span>{room._id === "102" ? "Double" : "TV"}</span>
//                         </div>
//                         <div
//                           className="text-lg font-bold"
//                           style={{ color: primaryColor }}
//                         >
//                           ₹{room.pricePerHead?.toLocaleString()}
//                           <span className="text-sm font-medium text-gray-500">
//                             /mo
//                           </span>
//                         </div>
//                         <button
//                           onClick={() =>
//                             room.roomAvailable && setSelectedRoom(room._id)
//                           }
//                           disabled={!room.roomAvailable}
//                           className={`w-full py-2 px-4 rounded-md font-semibold ${
//                             selectedRoom === room._id ? "text-white" : "border"
//                           } ${
//                             !room.roomAvailable
//                               ? "opacity-50 cursor-not-allowed"
//                               : ""
//                           }`}
//                           style={{
//                             backgroundColor:
//                               selectedRoom === room._id && room.roomAvailable
//                                 ? primaryColor
//                                 : "transparent",
//                             borderColor: !room.roomAvailable
//                               ? "red"
//                               : primaryColor,
//                             color:
//                               selectedRoom === room._id && room.roomAvailable
//                                 ? "white"
//                                 : primaryColor,
//                           }}
//                         >
//                           {selectedRoom === room._id ? "Selected" : "Select"}
//                         </button>
//                       </div>
//                     )
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="rounded-2xl shadow-md bg-white">
//             <div className="p-4">
//               <h2 className="text-xl font-semibold mb-4">Room Preview</h2>
//               {/* <div className="flex gap-4 overflow-x-auto pb-2">
//                 {(showAllPhotos
//                   ? owner?.messPhoto
//                   : owner?.messPhoto?.slice(0, 4)
//                 )?.map((image, index) => (
//                   <img
//                     key={index}
//                     src={image}
//                     alt={`Room ${index + 1}`}
//                     className="rounded-2xl w-64 h-48 object-cover flex-shrink-0"
//                   />
//                 ))}
//               </div> */}
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
//                   className="text-blue-600 underline text-sm mt-2 w-full text-left"
//                 ></button>
//               )}

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
//                   <li>🛏️ Double Bed</li>
//                   <li>🚿 Attached Bathroom</li>
//                   <li>⚡ Power Backup</li>
//                 </ul>
//                 <ul className="space-y-1">
//                   <li>👥 2 Person Sharing</li>
//                   <li>📅 Available from June 1</li>
//                   <li>✅ 1 Bed Available</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side */}
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
//                   onChange={(e) => setCheckInDate(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className="text-sm">Duration</label>
//                 <select
//                   className="mt-2 border rounded-md w-full p-2"
//                   value={duration}
//                   onChange={(e) => setDuration(Number(e.target.value))}
//                 >
//                   <option value={3}>3 months</option>
//                   <option value={6}>6 months</option>
//                   <option value={12}>12 months</option>
//                 </select>
//               </div>
//               {(() => {
//                 const room = owner?.roomInfo?.find(
//                   (r) => r._id === selectedRoom
//                 );
//                 const monthly = room?.pricePerHead || 0;
//                 const total = monthly * duration + monthly; // deposit = 1 month rent
//                 return (
//                   <>
//                     <p>Room Rent (monthly): ₹{monthly.toLocaleString()}</p>
//                     <p>Duration: {duration} months</p>
//                     <p>Security Deposit: ₹{monthly.toLocaleString()}</p>
//                     <div
//                       className="text-lg font-bold text-right"
//                       style={{ color: primaryColor }}
//                     >
//                       Total: ₹{total.toLocaleString()}
//                     </div>
//                   </>
//                 );
//               })()}
//             </div>
//           </div>
//           {/* 
//           <div className="rounded-2xl shadow-md bg-white">
//             <div className="p-4 space-y-4">
//               <h2 className="text-xl font-semibold">Payment Method</h2>
//               <div className="space-y-2">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="upi"
//                     defaultChecked
//                   />
//                   UPI Payment
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input type="radio" name="payment" value="card" />
//                   Credit/Debit Card
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input type="radio" name="payment" value="netbanking" />
//                   Net Banking
//                 </label>
//               </div>
//               <div>
//                 <label className="text-sm">Have a coupon?</label>
//                 <div className="flex items-center gap-2 mt-2">
//                   <input
//                     className="border p-2 rounded-md flex-1"
//                     placeholder="Enter code"
//                   />
//                   <button
//                     className="px-4 py-2 rounded-md text-white"
//                     style={{ backgroundColor: primaryColor }}
//                   >
//                     Apply
//                   </button>
//                 </div>
//               </div>
//               <button
//                 className="w-full mt-4 py-2 px-4 rounded-md text-white"
//                 style={{ backgroundColor: primaryColor }}
//               >
//                 Proceed to Payment
//               </button>
//             </div>
//           </div> */}
//           <button
//             className="w-full mt-4 py-2 px-4 rounded-md text-white"
//             style={{ backgroundColor: primaryColor }}
//             onClick={handleBookingRequest}
//           disabled={!selectedRoom || !checkInDate}
//           >
//             Book Request
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../contexts/socketContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { bookingRequestUrl } from "../constant/urls";

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { owner } = location.state || {};
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [duration, setDuration] = useState(6);
  const [checkInDate, setCheckInDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {socket,isConnected} = useSocket();
  const { emitWithAck, isInitialized } = useSocket();
  const { user } = useAuth();
   
  // Track if socket is ready to emit events
  const [socketReady, setSocketReady] = useState(false);
  useEffect(() => {
    if (socket) {
      const handleConnect = () => setSocketReady(true);
      const handleDisconnect = () => setSocketReady(false);
      
      // Set initial state
      setSocketReady(socket.connected);
      
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      
      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket]);
  // Convert bedCount string to number
  const bedCountToNumber = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5
  };

  const handleBookingRequest = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!selectedRoom || !checkInDate) {
        throw new Error("Please select a room and check-in date");
      }
  
      const selectedRoomInfo = owner?.roomInfo?.find(
        (r) => r._id === selectedRoom
      );
  
      if (!selectedRoomInfo) {
        throw new Error("Selected room not found");
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
          durationMonths: duration
        },
        payment: {
          totalAmount: selectedRoomInfo.pricePerHead * (duration + 1),
          deposit: selectedRoomInfo.pricePerHead
        },
        status: "pending"
      };
  
      // Make booking request
      const response = await axios.post(bookingRequestUrl, bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
  
      // Send socket notification if booking was successful
      if (response.data) {
        const MAX_RETRIES = 3;
        let retryCount = 0;
        
        const sendNotification = async () => {
          try {
            await emitWithAck('new-booking-request', {
              ownerId: owner._id,
              bookingId: response.data._id,
              studentId: user.id,
              room: selectedRoomInfo.room,
              bedsBooked: 1,
              pricePerHead: selectedRoomInfo.pricePerHead,
              timestamp: new Date().toISOString()
            });
            
            console.log('Real-time notification sent successfully');
          } catch (error) {
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              console.warn(`Retry ${retryCount} for notification...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              return sendNotification();
            }
            throw error;
          }
        };
  
        try {
          await sendNotification();
          toast.success("Booking created with real-time notification!");
        } catch (error) {
          console.warn("Real-time notification failed after retries:", error);
          toast.success("Booking created! Owner will be notified when online");
        }
      }
  
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || error.message || "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const primaryColor = "#2CA4B5";

  return (
    <div className="p-4 md:p-8 max-w-[100rem] mx-auto space-y-6 font-sans">
      <div className="flex items-center gap-4 mb-6 border-b pb-4 border-gray-300 justify-between">
        <div className="flex items-center gap-2">
          <img
            src="assets/backIcon.png"
            className="h-6 cursor-pointer"
            alt=""
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl font-bold">Confirm Your Booking</h1>
        </div>
        <div className="">
          <img src="assets/share.png" className="h-5" alt="" />
        </div>
      </div>

      {owner?.messName && (
        <div className="flex mb-6 flex-col justify-start">
          <h2 className="text-2xl font-bold">{owner?.messName}</h2>
          <div className="flex gap-4 flex-col md:flex-row">
            <p className="flex items-center text-gray-600 text-base gap-2">
              <img src="assets/greyMarker.png" className="h-4" alt="" />
              {owner?.address}
            </p>
            <p className="flex items-center text-gray-600 text-base gap-2">
              <img src="assets/phoneIcon.png" className="h-5" alt="" />
              {owner?.mobileNo}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl shadow-md bg-white">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Select a Room</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {owner?.roomInfo?.map((room) => (
                  <div
                    key={room._id}
                    className={`border rounded-2xl p-4 space-y-2 ${
                      room.roomAvailable
                        ? selectedRoom === room._id
                          ? "border-blue-500"
                          : "border-gray-200"
                        : "border-red-500"
                    }`}
                    style={{
                      borderColor: !room.roomAvailable
                        ? "red"
                        : selectedRoom === room._id
                        ? primaryColor
                        : undefined,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">{room.room}</h3>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          room.roomAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {room.roomAvailable 
                          ? `${bedCountToNumber[room.bedContains]} Bed${bedCountToNumber[room.bedContains] > 1 ? 's' : ''} Available`
                          : "Fully Booked"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      {owner.facility?.slice(0, 3).map((facility, index) => (
                        <span key={index}>{facility}</span>
                      ))}
                    </div>
                    <div className="text-lg font-bold" style={{ color: primaryColor }}>
                      ₹{room.pricePerHead?.toLocaleString()}
                      <span className="text-sm font-medium text-gray-500">/mo</span>
                    </div>
                    <button
                      onClick={() => room.roomAvailable && setSelectedRoom(room._id)}
                      disabled={!room.roomAvailable}
                      className={`w-full py-2 px-4 rounded-md font-semibold ${
                        selectedRoom === room._id ? "text-white" : "border"
                      } ${
                        !room.roomAvailable ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{
                        backgroundColor:
                          selectedRoom === room._id && room.roomAvailable
                            ? primaryColor
                            : "transparent",
                        borderColor: !room.roomAvailable ? "red" : primaryColor,
                        color:
                          selectedRoom === room._id && room.roomAvailable
                            ? "white"
                            : primaryColor,
                      }}
                    >
                      {selectedRoom === room._id ? "Selected" : "Select"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl shadow-md bg-white">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Room Preview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(showAllPhotos ? owner?.messPhoto : owner?.messPhoto?.slice(0, 4))?.map(
                  (image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Room ${index + 1}`}
                      className="rounded-2xl w-full h-48 object-cover"
                    />
                  )
                )}
              </div>
              {owner?.messPhoto?.length > 4 && (
                <button
                  onClick={() => setShowAllPhotos(!showAllPhotos)}
                  className="text-blue-600 underline text-sm mt-2 w-full"
                >
                  {showAllPhotos ? "View Less" : "View More"}
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  {owner?.facility?.slice(0, 3).map((item, index) => (
                    <li key={index}>✅ {item}</li>
                  ))}
                </ul>
                <ul className="space-y-1">
                  {owner?.facility?.slice(3, 6).map((item, index) => (
                    <li key={index}>✅ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Booking Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl shadow-md bg-white">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Booking Summary</h2>
              
              <div>
                <label className="text-sm">Check-in Date</label>
                <input
                  type="date"
                  className="mt-2 border rounded-md w-full p-2"
                  value={checkInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm">Duration (months)</label>
                <select
                  className="mt-2 border rounded-md w-full p-2"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  {[1, 2, 3, 6, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} month{num !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedRoom && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Room:</span>
                    <span>
                      {owner?.roomInfo?.find(r => r._id === selectedRoom)?.room}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Rent:</span>
                    <span>₹{owner?.roomInfo?.find(r => r._id === selectedRoom)?.pricePerHead?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{duration} month{duration !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span>₹{owner?.roomInfo?.find(r => r._id === selectedRoom)?.pricePerHead?.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span style={{ color: primaryColor }}>
                      ₹{(owner?.roomInfo?.find(r => r._id === selectedRoom)?.pricePerHead * (duration + 1))?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            className={`w-full mt-4 py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
              (!selectedRoom || !checkInDate || isLoading) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: primaryColor }}
            onClick={handleBookingRequest}
            disabled={!selectedRoom || !checkInDate || isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Request Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}