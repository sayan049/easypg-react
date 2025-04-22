import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function BookingPage() {
  const location = useLocation();
  const { owner } = location.state || {};
  const [selectedRoom, setSelectedRoom] = useState(
    owner?.roomInfo?.[0]?._id || ""
  );
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [duration, setDuration] = useState(6); // in months

  // console.log(owner, owner.roomInfo, "room");

  const primaryColor = "#2CA4B5";

  return (
    <div className="p-4 md:p-8 max-w-full mx-auto space-y-6 font-sans">
      <div className="flex items-center gap-4 mb-6 border-b pb-4 border-gray-300 justify-between">
        <div className="flex items-center gap-2">
          <img src="assets/backIcon.png" className="h-6" alt="" />
          <h1 className="text-xl font-bold">Confirm Your Booking</h1>
        </div>
        <div className="">share</div>
      </div>
      {owner?.messName && (
        <div className="flex  mb-6 flex-col justify-start ">
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
      {/* <div className="flex  mb-6 flex-col justify-start ">
        <h2 className="text-2xl font-bold">xxx</h2>
        <div className="flex gap-4 flex-col md:flex-row">
          <p className="flex items-center text-gray-600 text-base gap-2">
            <img src="assets/greyMarker.png" className="h-4" alt="" />
            xx xx xxx
          </p>
          <p className="flex items-center text-gray-600 text-base gap-2">
            <img src="assets/phoneIcon.png" className='h-5'alt="" />
            445677
          </p>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl shadow-md bg-white">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Select a Room</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {owner?.roomInfo?.map(
                  (room) =>
                    room && (
                      <div
                        key={room._id}
                        className={`border rounded-2xl p-4 space-y-2 ${
                          room.roomAvailable
                            ? selectedRoom === room._id
                              ? ""
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
                            {room.roomAvailable ? "Available" : "Not Available"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 text-sm">
                          <span>WiFi</span>
                          <span>AC</span>
                          <span>{room._id === "102" ? "Double" : "TV"}</span>
                        </div>
                        <div
                          className="text-lg font-bold"
                          style={{ color: primaryColor }}
                        >
                          ₹{room.pricePerHead?.toLocaleString()}
                          <span className="text-sm font-medium text-gray-500">
                            /mo
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            room.roomAvailable && setSelectedRoom(room._id)
                          }
                          disabled={!room.roomAvailable}
                          className={`w-full py-2 px-4 rounded-md font-semibold ${
                            selectedRoom === room._id ? "text-white" : "border"
                          } ${
                            !room.roomAvailable
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              selectedRoom === room._id && room.roomAvailable
                                ? primaryColor
                                : "transparent",
                            borderColor: !room.roomAvailable
                              ? "red"
                              : primaryColor,
                            color:
                              selectedRoom === room._id && room.roomAvailable
                                ? "white"
                                : primaryColor,
                          }}
                        >
                          {selectedRoom === room._id ? "Selected" : "Select"}
                        </button>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl shadow-md bg-white">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Room Preview</h2>
              {/* <div className="flex gap-4 overflow-x-auto pb-2">
                {(showAllPhotos
                  ? owner?.messPhoto
                  : owner?.messPhoto?.slice(0, 4)
                )?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Room ${index + 1}`}
                    className="rounded-2xl w-64 h-48 object-cover flex-shrink-0"
                  />
                ))}
              </div> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(showAllPhotos
                  ? owner?.messPhoto
                  : owner?.messPhoto?.slice(0, 4)
                )?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Room ${index + 1}`}
                    className="rounded-2xl w-full h-48 object-cover"
                  />
                ))}
              </div>

              {owner?.messPhoto?.length > 4 && (
                <button
                  onClick={() => setShowAllPhotos(!showAllPhotos)}
                  className="text-blue-600 underline text-sm mt-2 w-full text-left"
                ></button>
              )}

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
                  <li>🛏️ Double Bed</li>
                  <li>🚿 Attached Bathroom</li>
                  <li>⚡ Power Backup</li>
                </ul>
                <ul className="space-y-1">
                  <li>👥 2 Person Sharing</li>
                  <li>📅 Available from June 1</li>
                  <li>✅ 1 Bed Available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          <div className="rounded-2xl shadow-md bg-white">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Booking Summary</h2>
              <div>
                <label className="text-sm">Check-in Date</label>
                <input
                  type="date"
                  className="mt-2 border rounded-md w-full p-2"
                />
              </div>
              <div>
                <label className="text-sm">Duration</label>
                <select
                  className="mt-2 border rounded-md w-full p-2"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={3}>3 months</option>
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                </select>
              </div>
              {(() => {
                const room = owner?.roomInfo?.find(
                  (r) => r._id === selectedRoom
                );
                const monthly = room?.pricePerHead || 0;
                const total = monthly * duration + monthly; // deposit = 1 month rent
                return (
                  <>
                    <p>Room Rent (monthly): ₹{monthly.toLocaleString()}</p>
                    <p>Duration: {duration} months</p>
                    <p>Security Deposit: ₹{monthly.toLocaleString()}</p>
                    <div
                      className="text-lg font-bold text-right"
                      style={{ color: primaryColor }}
                    >
                      Total: ₹{total.toLocaleString()}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="rounded-2xl shadow-md bg-white">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    defaultChecked
                  />
                  UPI Payment
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" value="card" />
                  Credit/Debit Card
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" value="netbanking" />
                  Net Banking
                </label>
              </div>
              <div>
                <label className="text-sm">Have a coupon?</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    className="border p-2 rounded-md flex-1"
                    placeholder="Enter code"
                  />
                  <button
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Apply
                  </button>
                </div>
              </div>
              <button
                className="w-full mt-4 py-2 px-4 rounded-md text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
