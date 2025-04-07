import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BookingPage() {
  const [selectedRoom, setSelectedRoom] = useState('102');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Confirm Your Booking</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
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
                    <Button
                      onClick={() => setSelectedRoom(room.id)}
                      className="w-full"
                      variant={selectedRoom === room.id ? 'default' : 'outline'}
                    >
                      {selectedRoom === room.id ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
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
            </CardContent>
          </Card>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Booking Summary</h2>
              <div>
                <label className="text-sm">Check-in Date</label>
                <Calendar className="mt-2" />
              </div>
              <div>
                <label className="text-sm">Duration</label>
                <Select>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="3 months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-700">
                <p>Room Rent (monthly): ₹15,000</p>
                <p>Duration: 6 months</p>
                <p>Security Deposit: ₹15,000</p>
              </div>
              <div className="text-lg font-bold text-right">
                Total: ₹1,05,000
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <RadioGroup defaultValue="upi">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" />
                  <label>UPI Payment</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" />
                  <label>Credit/Debit Card</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="netbanking" />
                  <label>Net Banking</label>
                </div>
              </RadioGroup>
              <div>
                <label className="text-sm">Have a coupon?</label>
                <div className="flex items-center gap-2 mt-2">
                  <Input placeholder="Enter code" />
                  <Button>Apply</Button>
                </div>
              </div>
              <Button className="w-full mt-4">Proceed to Payment</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
