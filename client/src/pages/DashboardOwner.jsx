import React, { useState, useEffect } from "react";
import {
  Home,
  CalendarCheck,
  CreditCard,
  Settings as Gear,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import DashboardContentOwner from "../components/dashboardContentOwner";
import BookingStatus from "../components/BookingStatus";
import Payments from "../components/paymentOwner";
import SettingsOwner from "../components/settingsOwner";
import { fetchDetailsUrl, baseurl } from "../constant/urls";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { name: "Dashboard", icon: <Home />, key: "dashboard" },
  { name: "Booking Status", icon: <CalendarCheck />, key: "booking" },
  { name: "Payments", icon: <CreditCard />, key: "payments" },
  { name: "Settings", icon: <Gear />, key: "settings" },
];

export default function DashboardOwner() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userDetails, setUserDetails] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentActivity: [],
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { ownerName, isOwnerAuthenticated, owner, type, handleLogout } =
    useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      if (isOwnerAuthenticated) {
        try {
          const userId = type === "owner" ? owner?.id : null;
          if (!userId) return;

          const url = new URL(fetchDetailsUrl);
          url.searchParams.append("userId", userId);
          url.searchParams.append("type", type);

          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch details");
          const data = await response.json();
          setUserDetails(data);
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
    };

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${baseurl}/auth/dashboard/owner-stats`, {
          withCredentials: true, // Automatically send cookies
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    if (isOwnerAuthenticated) {
      fetchDetails();
      fetchDashboardData();
    }
  }, [type, owner, isOwnerAuthenticated]);

  const renderComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardContentOwner
            stats={dashboardData.stats}
            recentActivity={dashboardData.recentActivity}
          />
        );
      case "booking":
        return <BookingStatus />;
      case "payments":
        return <Payments />;
      case "settings":
        return <SettingsOwner userDetails={userDetails} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow">
        <button onClick={() => setMobileSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="w-6" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-white shadow p-4 items-center sticky top-0 h-screen">
        <div className="flex flex-col items-center mb-6">
          <svg
            className="w-10 h-10 rounded-full mb-2 bg-gray-200"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="40" r="20" fill="#4F46E5" />
            <circle cx="50" cy="80" r="25" fill="#4F46E5" />
          </svg>
          <div className="text-center">
            <div className="text-base font-semibold">{ownerName}</div>
            <div className="text-sm text-gray-500">Property Owner</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 w-full">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={cn(
                "flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full transition-colors",
                activeTab === item.key &&
                  "bg-blue-100 text-blue-600 font-medium"
              )}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 p-2 rounded text-red-600 hover:bg-red-100 w-full transition-colors"
        >
          <LogOut /> Logout
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } bg-black/30`}
      >
        <div className="flex h-full">
          <div
            className={`transform transition-transform duration-300 ease-in-out ${
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } w-64 bg-white shadow-md p-4 flex flex-col`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <svg
                className="w-10 h-10 rounded-full mb-2 bg-gray-200"
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="40" r="20" fill="#4F46E5" />
                <circle cx="50" cy="80" r="25" fill="#4F46E5" />
              </svg>
              <div className="text-center">
                <div className="text-base font-semibold">{ownerName}</div>
                <div className="text-sm text-gray-500">Property Owner</div>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-left transition-colors",
                    activeTab === item.key &&
                      "bg-blue-100 text-blue-600 font-medium"
                  )}
                  onClick={() => {
                    setActiveTab(item.key);
                    setMobileSidebarOpen(false);
                  }}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-2 p-2 rounded text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut /> Logout
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4 pb-[62px] md:pb-0 lg:pb-0">
        {renderComponent()}
      </div>
    </div>
  );
}
