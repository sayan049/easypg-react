
import React, { useState } from "react";
import { json, useNavigate } from "react-router-dom";

function StickyBookingCard({ owner }) {
  const Navigate=useNavigate();
  const [duration, setDuration] = useState("1 Month");

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };
  const clickBook=()=>{
    const ownerParams = new URLSearchParams();
    ownerParams.set("owner",JSON.stringify(owner));
    Navigate(`/booking?${ownerParams}`);
  }
  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-white px-4 py-3 shadow-lg flex items-center justify-between z-50 md:px-8 lg:px-16 xl:px-24"
      style={{
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
        border: "solid 1px #D9D9D9",
      }}
    >
      {/* Left Section: Information */}
      <div className="flex flex-col">
        <h3 className="text-base md:text-lg font-semibold">{owner.messName}</h3>
        <p className="text-sm text-gray-600">{owner.roomInfo.length} Rooms</p>
        <div className="text-blue-600 font-bold text-lg mt-1">
          {owner.roomInfo?.length > 0
            ? `₹${Math.min(
                ...owner.roomInfo
                  .map((room) => Number(room.pricePerHead))
                  .filter(Number)
              )} /month`
            : "Price: N/A"}
        </div>
        {/* Booking Duration Dropdown */}
        {/* <div className="flex items-center text-sm text-gray-600 mt-1">
          <label htmlFor="booking-duration" className="mr-2">
            Booking Duration:
          </label>
          <select
            id="booking-duration"
            value={duration}
            onChange={handleDurationChange}
            className="border rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {["1 Month", "3 Months", "6 Months", "1 Year"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div> */}
        <p className="text-sm text-gray-600 mt-1">Booking Fee: ₹100</p>
      </div>

      {/* Right Section: Action */}
      <div className="flex items-center gap-4">
        {/* <div className="flex items-center bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
          <span className="mr-2">📍</span> Sayan Patra
        </div> */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded shadow"
          onClick={clickBook}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default StickyBookingCard;
