import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, CalendarCheck, CreditCard, Settings as Gear } from "lucide-react";
import { cn } from "../lib/utils";
import DashboardContentOwner from "../components/dashboardContentOwner";
import BookingStatus from "../components/BookingStatus";
import Payments from "../components/paymentOwner";
import SettingsOwner from "../components/settingsOwner";

const navItems = [
  { name: "Dashboard", icon: <Home />, key: "dashboard" },
  { name: "Booking Status", icon: <CalendarCheck />, key: "booking" },
  { name: "Payments", icon: <CreditCard />, key: "payments" },
  { name: "Settings", icon: <Gear />, key: "settings" },
];

// const Dashboard = () => <div className="p-4">Dashboard Component</div>;
// const BookingStatus = () => <div className="p-4">Booking Status Component</div>;
// const Payments = () => <div className="p-4">Payments Component</div>;
// const Settings = () => <div className="p-4">Settings Component</div>;

export default function DashboardOwner() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContentOwner/>;
      case "booking":
        return <BookingStatus/>;
      case "payments":
        return <Payments/>;
      case "settings":
        return <SettingsOwner/>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-white shadow  p-4 items-center sticky top-0 h-screen">
        <img
          src="https://via.placeholder.com/80"
          alt="Profile"
          className="w-20 h-20 rounded-full mb-2"
        />
        <div className="text-center mb-6">
          <div className="text-base font-semibold">John Smith</div>
          <div className="text-sm text-gray-500">Property Owner</div>
        </div>
        <nav className="flex flex-col gap-2 w-full">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={cn(
                "flex items-center gap-2 p-2 rounded hover:bg-gray-100",
                activeTab === item.key && "bg-gray-100 font-medium"
              )}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-50 p-4 pb-[62px] md:pb-0 lg:pb-0">
        {renderComponent()}
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className="flex flex-col items-center text-sm"
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
