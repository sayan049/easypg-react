import React from "react";

function StickyBookingCard() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg flex flex-col md:flex-row items-center justify-between md:justify-around gap-4 z-50"
    style={{boxShadow:'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px'}}>
      {/* Information Section */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">Greenwood PG</h3>
        <p className="text-sm text-gray-600">Single Room</p>
        <div className="text-blue-600 font-bold text-xl mt-1">₹3,000</div>
        <p className="text-sm text-gray-600">
          Booking Duration: 1 Jan - 30 Jan
        </p>
        <p className="text-sm text-gray-600">Booking Fee: ₹100</p>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-4">
        {/* <div className="flex items-center bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
          <span className="mr-2">📍</span> Sayan Patra
        </div> */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded shadow">
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default StickyBookingCard;
