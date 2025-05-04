// import React, { useEffect, useState } from "react";

// const Payments = () => {
//   const [payments, setPayments] = useState([]);
//   const [refunds, setRefunds] = useState([]);

//   useEffect(() => {
//     // Temporarily using hardcoded data
//     const paymentData = [
//       {
//         name: "Sarah Johnson",
//         bookingId: "MM12345",
//         room: 301,
//         amount: "₹15,000",
//         date: "Jan 15, 2025"
//       },
//       {
//         name: "Mike Peterson",
//         bookingId: "MM12346",
//         room: 402,
//         amount: "₹12,000",
//         date: "Jan 14, 2025"
//       }
//     ];

//     const refundData = [
//       {
//         name: "Emily Wilson",
//         bookingId: "MM12340",
//         avatar: "https://i.pravatar.cc/40?img=11",
//         amount: "₹5,000",
//         reason: "Early termination due to job relocation"
//       },
//       {
//         name: "David Chen",
//         bookingId: "MM12339",
//         avatar: "https://i.pravatar.cc/40?img=12",
//         amount: "₹3,500",
//         reason: "Maintenance issues in room"
//       }
//     ];

//     setPayments(paymentData);
//     setRefunds(refundData);
//   }, []);

//   return (
//     <div className="p-4 space-y-6">
//       <h1 className="text-xl font-bold">Payments</h1>

//       <div className="space-y-3">
//         <h2 className="text-lg font-semibold">Successful Payments</h2>
//         <div className="space-y-3">
//           {payments.map((p, i) => (
//             <div
//               key={i}
//               className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 bg-white shadow-sm"
//             >
//               <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//                 <div>
//                   <p className="font-semibold">{p.name}</p>
//                   <p className="text-sm text-gray-500">Booking ID: #{p.bookingId}</p>
//                   <p className="text-sm text-gray-500">Room {p.room}</p>
//                 </div>
//               </div>
//               <div className="text-right mt-2 sm:mt-0">
//                 <p className="font-semibold">{p.amount}</p>
//                 <p className="text-xs text-gray-500">{p.date}</p>
//                 <span className="text-green-600 text-xs font-medium">✓ Paid</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-3">
//         <h2 className="text-lg font-semibold">Refund Requests</h2>
//         <div className="space-y-4">
//           {refunds.map((r, i) => (
//             <div
//               key={i}
//               className="border rounded-lg p-4 bg-white shadow-sm space-y-3"
//             >
//               <div className="flex justify-between items-center">
//                 <div className="flex gap-3 items-center">
//                   <img
//                     src={r.avatar}
//                     alt={r.name}
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <div>
//                     <p className="font-semibold">{r.name}</p>
//                     <p className="text-sm text-gray-500">Booking ID: #{r.bookingId}</p>
//                   </div>
//                 </div>
//                 <span className="text-yellow-600 text-xs font-medium">⦿ Pending</span>
//               </div>
//               <div className="text-sm text-gray-700">
//                 <p>
//                   <strong>Refund Amount:</strong> {r.amount}
//                 </p>
//                 <p>
//                   <strong>Reason:</strong> {r.reason}
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
//                   ✓ Approve
//                 </button>
//                 <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
//                   ✗ Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payments;
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CreditCard, ShieldCheck, Smartphone } from "lucide-react";

const Payments = () => {
  const navigate = useNavigate();
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-b from-white to-gray-100 text-gray-800">
      {/* Title */}
      <div className="text-center mb-6">
        <Lock className="mx-auto text-blue-500" size={32} />
        <h1 className="text-3xl md:text-4xl font-bold mt-2">Payments Coming Soon</h1>
        <p className="mt-2 text-sm md:text-base text-gray-600 max-w-md mx-auto">
          We're currently offering our services for free. Secure and seamless payments are on their way!
        </p>
      </div>

      {/* Illustration */}
      <img
        src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746379420/hhg9bcto5gzo9nq3kd4n.png"
        alt="Secure Wallet Illustration"
        className="w-60 md:w-72 h-auto my-6"
      />

      {/* Payment Options */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl mb-10">
        <h2 className="text-center font-semibold text-lg mb-6">Coming Payment Options</h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 text-center">
          <div>
            <Smartphone className="mx-auto text-blue-500" size={28} />
            <p className="font-medium mt-2">UPI Payments</p>
            <p className="text-sm text-gray-500">Quick and easy mobile payments</p>
          </div>
          <div>
            <CreditCard className="mx-auto text-green-500" size={28} />
            <p className="font-medium mt-2">Card Payments</p>
            <p className="text-sm text-gray-500">Credit & Debit cards accepted</p>
          </div>
          <div>
            <ShieldCheck className="mx-auto text-purple-500" size={28} />
            <p className="font-medium mt-2">Secure Gateway</p>
            <p className="text-sm text-gray-500">End-to-end encrypted transactions</p>
          </div>
        </div>
      </div>

      {/* Notify Section */}
      <div className="bg-blue-100 p-6 rounded-xl w-full max-w-xl text-center mb-8">
        <h3 className="font-semibold text-lg mb-4">Get Notified When We Launch</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 w-full sm:w-auto rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md">
            Notify Me
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800"  onClick={() => navigate("/DashboardOwner")}>
          ← Back to Dashboard
        </button>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"  onClick={() => navigate("/")}>
          Explore PGs Now →
        </button>
      </div>
    </div>
  );
};

export default Payments;



