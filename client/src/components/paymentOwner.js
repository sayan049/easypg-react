import React, { useEffect, useState } from "react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    // Temporarily using hardcoded data
    const paymentData = [
      {
        name: "Sarah Johnson",
        bookingId: "MM12345",
        room: 301,
        amount: "₹15,000",
        date: "Jan 15, 2025"
      },
      {
        name: "Mike Peterson",
        bookingId: "MM12346",
        room: 402,
        amount: "₹12,000",
        date: "Jan 14, 2025"
      }
    ];

    const refundData = [
      {
        name: "Emily Wilson",
        bookingId: "MM12340",
        avatar: "https://i.pravatar.cc/40?img=11",
        amount: "₹5,000",
        reason: "Early termination due to job relocation"
      },
      {
        name: "David Chen",
        bookingId: "MM12339",
        avatar: "https://i.pravatar.cc/40?img=12",
        amount: "₹3,500",
        reason: "Maintenance issues in room"
      }
    ];

    setPayments(paymentData);
    setRefunds(refundData);
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Payments</h1>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Successful Payments</h2>
        <div className="space-y-3">
          {payments.map((p, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-500">Booking ID: #{p.bookingId}</p>
                  <p className="text-sm text-gray-500">Room {p.room}</p>
                </div>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="font-semibold">{p.amount}</p>
                <p className="text-xs text-gray-500">{p.date}</p>
                <span className="text-green-600 text-xs font-medium">✓ Paid</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Refund Requests</h2>
        <div className="space-y-4">
          {refunds.map((r, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 bg-white shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-gray-500">Booking ID: #{r.bookingId}</p>
                  </div>
                </div>
                <span className="text-yellow-600 text-xs font-medium">⦿ Pending</span>
              </div>
              <div className="text-sm text-gray-700">
                <p>
                  <strong>Refund Amount:</strong> {r.amount}
                </p>
                <p>
                  <strong>Reason:</strong> {r.reason}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  ✓ Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payments;
