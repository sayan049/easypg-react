
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
        src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746981860/img-6820d3ce192cd_m6duqp.webp"
        alt="Secure Wallet Illustration"
        className="w-60 md:w-72 h-auto my-6"
        loading="lazy"
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



