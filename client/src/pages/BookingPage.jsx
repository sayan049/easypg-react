import React, { useState } from "react";

export default function BookingPage() {
  const [selectedRoom, setSelectedRoom] = useState("Room 102");
  const [paymentMethod, setPaymentMethod] = useState("");

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">Confirm Your Booking</h1>
        <h2 className="text-lg font-bold mt-2">Sunshine PG & Mess</h2>
        <p className="text-sm text-gray-600">
          123 Main Street, Koramangala, Bangalore • +91 98765 43210
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          {/* Select Room */}
          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Select a Room</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: "Room 101", price: 12000, available: true },
                { name: "Room 102", price: 15000, available: false },
              ].map((room) => (
                <div
                  key={room.name}
                  className={`border rounded-lg p-4 flex flex-col gap-2 ${
                    selectedRoom === room.name ? "border-blue-500" : ""
                  }`}
                >
                  <img
                    src="https://via.placeholder.com/300x150"
                    alt="room"
                    className="rounded-md"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-blue-600 font-bold">
                        ₹{room.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedRoom(room.name)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        selectedRoom === room.name
                          ? "bg-gray-300 text-gray-600"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {selectedRoom === room.name ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Preview */}
          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4">Room Preview</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <img
                src="https://via.placeholder.com/300x200"
                className="rounded-md w-full"
                alt="Room Preview"
              />
              <div>
                <p className="mb-2 font-medium">Room Features</p>
                <ul className="text-sm space-y-1">
                  <li>🛏️ Double Bed</li>
                  <li>🛁 Attached Bathroom</li>
                  <li>🔌 Power Backup</li>
                </ul>
                <p className="mt-4 mb-2 font-medium">Room Details</p>
                <ul className="text-sm space-y-1">
                  <li>👥 2 Person Sharing</li>
                  <li>📅 Available from June 1</li>
                  <li>🛏️ 1 Bed Available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[350px] space-y-6">
          <div className="bg-white shadow rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold">Booking Summary</h3>
            <div className="text-sm space-y-1">
              <div>
                <label className="block font-medium">Check-in Date</label>
                <input type="date" className="border w-full p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium mt-2">Duration</label>
                <select className="border w-full p-2 rounded">
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </div>
              <p className="pt-2">Room Rent (monthly): ₹15,000</p>
              <p>Duration: 6 months</p>
              <p>Security Deposit: ₹15,000</p>
              <p className="font-bold">Total Amount: ₹1,05,000</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <div className="space-y-2 text-sm">
              <label className="block">
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                  className="mr-2"
                />
                UPI Payment
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={paymentMethod === "Card"}
                  onChange={() => setPaymentMethod("Card")}
                  className="mr-2"
                />
                Credit/Debit Card
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="payment"
                  value="NetBanking"
                  checked={paymentMethod === "NetBanking"}
                  onChange={() => setPaymentMethod("NetBanking")}
                  className="mr-2"
                />
                Net Banking
              </label>
              <div>
                <input
                  type="text"
                  placeholder="Enter code"
                  className="border p-2 w-full rounded mt-2"
                />
                <button className="bg-gray-200 text-sm mt-2 px-3 py-1 rounded">
                  Apply
                </button>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded font-medium mt-3">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
