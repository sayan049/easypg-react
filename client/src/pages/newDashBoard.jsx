import React, { useState, useEffect } from "react";
import Cart from "../components/cart";
import { useAuth } from "../contexts/AuthContext";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  Home,
  CalendarCheck,
  CreditCard,
  Settings as Gear,
  Menu,
  X,
  LogOut as LogOutIcon,
} from "lucide-react";
import { Heart, HeartOff } from "lucide-react";
import axios from "axios";
import { baseurl, fetchDetailsUrl } from "../constant/urls";
import { toast } from "react-toastify";
import BookingTable from "../components/BookingTable";
import Settings from "../components/settings";
import DashboardContent from "../components/dashboardContent";
// const DashboardContent = React.lazy(() => import('./components/dashboardContent'));

import Payments from "../components/payment";
import { io } from "socket.io-client";


function NewDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    upcoming: 0,
    active: 0,
    past: 0,
    pending: 0,
  });
  const [currentStay, setCurrentStay] = useState(null);
  const [upcomingStay, setUpcomingStay] = useState(null);
  const [pastStay, setPastStay] = useState(null);
  const [pendingStay, setPendingStay] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [totalAmountConfirmed, setTotalAmountConfirmed] = useState(0);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);

  const { userName, user, owner, type, handleLogout } = useAuth();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const userId = type === "student" ? user?.id : owner?.id;
      if (!userId) return;

      const detailsUrl = new URL(fetchDetailsUrl);
      detailsUrl.searchParams.append("userId", userId);
      detailsUrl.searchParams.append("type", type);
      const detailsResponse = await fetch(detailsUrl, { method: "GET" });
      if (!detailsResponse.ok) throw new Error("Failed to fetch user details");
      const detailsData = await detailsResponse.json();
      setUserDetails(detailsData);

      if (type === "student") {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${baseurl}/auth/bookings/user`, {
          withCredentials: true, // Automatically send cookies
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest" // Bypass tracking prevention
          },
        });
        if (response.data && response.data.success) {
          const bookingsData = response.data.bookings || [];
          const bookingsWithDates = bookingsData.map((booking) => {
            const endDate = new Date(booking.period.startDate);
            endDate.setMonth(
              endDate.getMonth() + booking.period.durationMonths
            );
            return { ...booking, period: { ...booking.period, endDate } };
          });

          setBookings(bookingsWithDates);
          setStats({
            upcoming: response.data.stats.upcoming,
            active: response.data.stats.current,
            past: response.data.stats.past,
            pending: response.data.stats.pending,
          });
          setCurrentStay(response.data.currentStays || []);
          setUpcomingStay(response.data.upcomingStays || []);
          setPastStay(response.data.pastStays || []);
          setPendingStay(response.data.pendingStays || []);
          setDaysRemaining(response.data.daysRemaining || 0);
          setTotalAmountConfirmed(response.data.totalAmountConfirmed || 0);
        }

        const maintenanceResponse = await axios.get(
          `${baseurl}/auth/maintenance/history`,
          {
            withCredentials: true, // Automatically send cookies
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest" // Bypass tracking prevention
            },
            params: { userId, type },
          }
        );
        if (maintenanceResponse.data.success) {
          setMaintenanceHistory(maintenanceResponse.data.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const socket = io(baseurl);

  useEffect(() => {

  socket.emit("join-user-room", user?.id); 

  socket.on("update-booking-status", ({ booking }) => {
    console.log("Booking status updated:", booking);
    // Optionally update state/UI
  });

  return () => {
    socket.off("update-booking-status");
  };
}, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchAllData();
  }, [type, user, owner, user?.id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardContent
            user={userDetails}
            bookings={bookings}
            currentStay={currentStay}
            upcomingStay={upcomingStay}
            pastStay={pastStay}
            pendingStay={pendingStay}
            stats={stats}
            daysRemaining={daysRemaining}
            totalAmountConfirmed={totalAmountConfirmed}
            maintenanceHistory={maintenanceHistory}
            loading={loading}
          />
        );
      case "bookings":
        return (
          <BookingTable
            bookings={bookings}
            stats={stats}
            currentStay={currentStay}
            loading={loading}
          />
        );
      case "payments":
        return <Payments />;
      case "settings":
        return <Settings user={userDetails} />;
      case "Cart":
        return <Cart />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white shadow">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="font-semibold text-lg">Dashboard</h1>
        <div className="w-6 h-6" />
      </div>

      <aside
        className={`top-0 left-0 w-64 h-screen bg-white border-r p-4 z-40 transition-transform duration-300 transform shadow-md
          md:sticky md:translate-x-0 ${
            sidebarOpen
              ? "fixed mt-14 translate-x-0"
              : "fixed -translate-x-full"
          }`}
      >
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <ProfileHeader userName={userName} />
        <nav className="flex flex-col gap-4 mt-8">
          <SidebarButton
            icon={<Home />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => handleTabChange("dashboard")}
          />
          <SidebarButton
            icon={<CalendarCheck />}
            label="My Bookings"
            active={activeTab === "bookings"}
            onClick={() => handleTabChange("bookings")}
          />
          <SidebarButton
            icon={<CreditCard />}
            label="My Payments"
            active={activeTab === "payments"}
            onClick={() => handleTabChange("payments")}
          />
          <SidebarButton
            icon={<Gear />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => handleTabChange("settings")}
          />
          <SidebarButton
            icon={<HeartOff />}
            label="saved Pg"
            active={activeTab === "Cart"}
            onClick={() => handleTabChange("Cart")}
          />
        </nav>
        <button
          onClick={handleLogout}
          className="absolute bottom-28 md:bottom-14 flex items-center gap-3 px-4 py-2 rounded-md mt-10 text-red-600 hover:bg-red-100 transition"
        >
          <LogOutIcon className="w-4 h-4" /> Logout
        </button>
      </aside>

      <main className="flex-1 px-2 sm:px-4 pt-20 md:pt-4">
        {renderContent()}
      </main>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
        active
          ? "bg-blue-100 text-blue-600 font-semibold"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ProfileHeader({ userName }) {
  return (
    <div className="flex items-center space-x-3 mb-10">
      <svg className="w-10 h-10 rounded-full bg-gray-300" viewBox="0 0 100 100">
        <circle cx="50" cy="40" r="20" fill="#4F46E5" />
        <circle cx="50" cy="80" r="25" fill="#4F46E5" />
      </svg>
      <div>
        <h2 className="font-semibold text-lg">{userName}</h2>
        <p className="text-gray-500 text-sm">Student</p>
      </div>
    </div>
  );
}

export default NewDashboard;
