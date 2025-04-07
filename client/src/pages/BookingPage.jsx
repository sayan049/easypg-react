import React, { useState } from 'react';

export default function BookingPage() {
  const [selectedRoom, setSelectedRoom] = useState('102');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Confirm Your Booking</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl shadow-md bg-white">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Select a Room</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ id: '101', price: 12000, available: true }, { id: '102', price: 15000, available: false }].map((room) => (
                  <div
                    key={room.id}
                    className={`border rounded-2xl p-4 space-y-2 ${selectedRoom === room.id ? 'border-blue-500' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Room {room.id}</h3>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${room.available ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                      >
                        {room.available ? 'Available' : '1 Bed Left'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <span>WiFi</span>
                      <span>AC</span>
                      <span>{room.id === '102' ? 'Double' : 'TV'}</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ₹{room.price.toLocaleString()}
                      <span className="text-sm font-medium text-gray-500">/mo</span>
                    </div>
                    <button
                      onClick={() => setSelectedRoom(room.id)}
                      className={`w-full py-2 px-4 rounded-md font-semibold ${selectedRoom === room.id ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600'}`}
                    >
                      {selectedRoom === room.id ? 'Selected' : 'Select'}
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
                <img src="/room-preview1.jpg" alt="Room Preview" className="rounded-2xl w-full h-48 object-cover" />
                <img src="/room-preview2.jpg" alt="Room Preview" className="rounded-2xl w-full h-48 object-cover" />
              </div>
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
                <input type="date" className="mt-2 border rounded-md w-full p-2" />
              </div>
              <div>
                <label className="text-sm">Duration</label>
                <select className="mt-2 border rounded-md w-full p-2">
                  <option>3 months</option>
                  <option>6 months</option>
                </select>
              </div>
              <div className="text-sm text-gray-700">
                <p>Room Rent (monthly): ₹15,000</p>
                <p>Duration: 6 months</p>
                <p>Security Deposit: ₹15,000</p>
              </div>
              <div className="text-lg font-bold text-right">
                Total: ₹1,05,000
              </div>
            </div>
          </div>

          <div className="rounded-2xl shadow-md bg-white">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" value="upi" defaultChecked />
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
                  <input className="border p-2 rounded-md flex-1" placeholder="Enter code" />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Apply</button>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md">Proceed to Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}