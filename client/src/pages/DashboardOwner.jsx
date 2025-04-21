import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { Home, CalendarCheck, CreditCard, Settings as Gear } from "lucide-react";
import { cn } from "../lib/utils";
import DashboardContentOwner from "../components/dashboardContentOwner";
import BookingStatus from "../components/BookingStatus";
import Payments from "../components/paymentOwner";
import SettingsOwner from "../components/settingsOwner";
import { fetchDetailsUrl } from "../constant/urls";
import { useAuth } from "../contexts/AuthContext";

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
        return <SettingsOwner userDetails={userDetails}/>;
      default:
        return null;
    }
  };
    const [userDetails, setUserDetails] = useState(null);
    const {
        userName,
        IsAuthenticated,
        isOwnerAuthenticated,
        ownerName,
        user,
        owner,
        type,
      } = useAuth();
  useEffect(() => {
          const fetchDetails = async () => {
           // setIsLoading(true);
            try {
              const userId = type === "owner" ? owner?.id : user?.id;
              if (!userId) {
                console.error("User ID is missing");
                return;
              }
      
              const url = new URL(fetchDetailsUrl);
              url.searchParams.append("userId", userId);
              url.searchParams.append("type", type);
      
              const response = await fetch(url, { method: "GET" });
      
              if (!response.ok) {
                throw new Error("Failed to fetch details");
              }
      
              const data = await response.json();
              setUserDetails(data); // Pass this to Settings
            } catch (error) {
              console.error("Error fetching details:", error);
            } finally {
            //  setIsLoading(false);
            }
          };
      
          fetchDetails();
        }, [type, user, owner]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-white shadow  p-4 items-center sticky top-0 h-screen">
        {/* <img
          src="https://via.placeholder.com/80"
          alt="Profile"
          className="w-20 h-20 rounded-full mb-2"
        /> */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" xml:space="preserve"><path fill="#282828" d="M135.832 140.848h-70.9c-2.9 0-5.6-1.6-7.4-4.5-1.4-2.3-1.4-5.7 0-8.6l4-8.2c2.8-5.6 9.7-9.1 14.9-9.5 1.7-.1 5.1-.8 8.5-1.6 2.5-.6 3.9-1 4.7-1.3-.2-.7-.6-1.5-1.1-2.2-6-4.7-9.6-12.6-9.6-21.1 0-14 9.6-25.3 21.5-25.3s21.5 11.4 21.5 25.3c0 8.5-3.6 16.4-9.6 21.1-.5.7-.9 1.4-1.1 2.1.8.3 2.2.7 4.6 1.3 3 .7 6.6 1.3 8.4 1.5 5.3.5 12.1 3.8 14.9 9.4l3.9 7.9c1.5 3 1.5 6.8 0 9.1-1.6 2.9-4.4 4.6-7.2 4.6zm-35.4-78.2c-9.7 0-17.5 9.6-17.5 21.3 0 7.4 3.1 14.1 8.2 18.1.1.1.3.2.4.4 1.4 1.8 2.2 3.8 2.2 5.9 0 .6-.2 1.2-.7 1.6-.4.3-1.4 1.2-7.2 2.6-2.7.6-6.8 1.4-9.1 1.6-4.1.4-9.6 3.2-11.6 7.3l-3.9 8.2c-.8 1.7-.9 3.7-.2 4.8.8 1.3 2.3 2.6 4 2.6h70.9c1.7 0 3.2-1.3 4-2.6.6-1 .7-3.4-.2-5.2l-3.9-7.9c-2-4-7.5-6.8-11.6-7.2-2-.2-5.8-.8-9-1.6-5.8-1.4-6.8-2.3-7.2-2.5-.4-.4-.7-1-.7-1.6 0-2.1.8-4.1 2.2-5.9.1-.1.2-.3.4-.4 5.1-3.9 8.2-10.7 8.2-18-.2-11.9-8-21.5-17.7-21.5z"/></svg>
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
