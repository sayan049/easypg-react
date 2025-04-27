// import React, { useState, useEffect } from "react";

// import { Link } from "react-router-dom";
// import {
//   Home,
//   CalendarCheck,
//   CreditCard,
//   Settings as Gear,
// } from "lucide-react";
// import { cn } from "../lib/utils";
// import DashboardContentOwner from "../components/dashboardContentOwner";
// import BookingStatus from "../components/BookingStatus";
// import Payments from "../components/paymentOwner";
// import SettingsOwner from "../components/settingsOwner";
// import { fetchDetailsUrl } from "../constant/urls";
// import { useAuth } from "../contexts/AuthContext";

// const navItems = [
//   { name: "Dashboard", icon: <Home />, key: "dashboard" },
//   { name: "Booking Status", icon: <CalendarCheck />, key: "booking" },
//   { name: "Payments", icon: <CreditCard />, key: "payments" },
//   { name: "Settings", icon: <Gear />, key: "settings" },
// ];

// // const Dashboard = () => <div className="p-4">Dashboard Component</div>;
// // const BookingStatus = () => <div className="p-4">Booking Status Component</div>;
// // const Payments = () => <div className="p-4">Payments Component</div>;
// // const Settings = () => <div className="p-4">Settings Component</div>;

// export default function DashboardOwner() {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const renderComponent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return <DashboardContentOwner />;
//       case "booking":
//         return <BookingStatus />;
//       case "payments":
//         return <Payments />;
//       case "settings":
//         return <SettingsOwner userDetails={userDetails} />;
//       default:
//         return null;
//     }
//   };
//   const [userDetails, setUserDetails] = useState(null);
//   const {
//     userName,
//     IsAuthenticated,
//     isOwnerAuthenticated,
//     ownerName,
//     user,
//     owner,
//     type,
//   } = useAuth();
//   useEffect(() => {
//     const fetchDetails = async () => {
//       // setIsLoading(true);
//       if (isOwnerAuthenticated) {
//         try {
//           const userId = type === "owner" ? owner?.id : user?.id;
//           if (!userId) {
//             console.error("User ID is missing");
//             return;
//           }

//           const url = new URL(fetchDetailsUrl);
//           url.searchParams.append("userId", userId);
//           url.searchParams.append("type", type);

//           const response = await fetch(url, { method: "GET" });

//           if (!response.ok) {
//             throw new Error("Failed to fetch details");
//           }

//           const data = await response.json();
//           setUserDetails(data); // Pass this to Settings
//         } catch (error) {
//           console.error("Error fetching details:", error);
//         } finally {
//           //  setIsLoading(false);
//         }
//       } else {
//         console.error("User is not authenticated as owner");
//       }
//     };

//     fetchDetails();
//   }, [type, user, owner]);

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Sidebar */}
//       <div className="hidden md:flex md:flex-col w-64 bg-white shadow  p-4 items-center sticky top-0 h-screen">
//         {/* <img
//           src="https://via.placeholder.com/80"
//           alt="Profile"
//           className="w-20 h-20 rounded-full mb-2"
//         /> */}
//         <svg
//           className="w-10 h-10 rounded-full mb-2 bg-gray-200"
//           viewBox="0 0 100 100"
//         >
//           <circle cx="50" cy="40" r="20" fill="#4F46E5" />
//           <circle cx="50" cy="80" r="25" fill="#4F46E5" />
//         </svg>

//         <div className="text-center mb-6">
//           <div className="text-base font-semibold">{ownerName}</div>

//           <div className="text-sm text-gray-500">Property Owner</div>
//         </div>
//         <nav className="flex flex-col gap-2 w-full">
//           {navItems.map((item) => (
//             <button
//               key={item.key}
//               className={cn(
//                 "flex items-center gap-2 p-2 rounded hover:bg-gray-100",
//                 activeTab === item.key && "bg-gray-100 font-medium"
//               )}
//               onClick={() => setActiveTab(item.key)}
//             >
//               {item.icon} {item.name}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 bg-gray-50 p-4 pb-[62px] md:pb-0 lg:pb-0">
//         {renderComponent()}
//       </div>

//       {/* Mobile bottom nav */}
//       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2">
//         {navItems.map((item) => (
//           <button
//             key={item.key}
//             onClick={() => setActiveTab(item.key)}
//             className="flex flex-col items-center text-sm"
//           >
//             {item.icon}
//             <span className="text-xs mt-1">{item.name}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
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
import axios from "axios";
import { baseurl } from "../constant/urls";

const navItems = [
  { name: "Dashboard", icon: <Home />, key: "dashboard" },
  { name: "Booking Status", icon: <CalendarCheck />, key: "booking" },
  { name: "Payments", icon: <CreditCard />, key: "payments" },
  { name: "Settings", icon: <Gear />, key: "settings" },
];

export default function DashboardOwner() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState({
    pending: { data: [], page: 1, total: 0 },
    confirmed: { data: [], page: 1, total: 0 },
    rejected: { data: [], page: 1, total: 0 },
  });
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState({ list: true, action: false, tabChange: false });
  const [userDetails, setUserDetails] = useState(null);
  const { user, owner, type, isOwnerAuthenticated, ownerName } = useAuth();

  const limit = 10;

  const fetchBookings = async (status, page = 1) => {
    try {
      setLoading((prev) => ({ ...prev, list: true, tabChange: status !== bookings.tab }));
      const response = await axios.get(`${baseurl}/auth/bookings/owner`, {
        params: { status, page, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      setBookings((prev) => ({
        ...prev,
        [status]: { data: response.data.bookings || [], page, total: response.data.pagination?.total || 0 },
      }));

      if (page === 1) {
        setStats((prev) => ({
          ...prev,
          [status]: response.data.pagination?.total || 0,
          total: prev.total - (prev[status] || 0) + (response.data.pagination?.total || 0),
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${status} bookings:`, error);
      setBookings((prev) => ({ ...prev, [status]: { data: [], page: 1, total: 0 } }));
    } finally {
      setLoading((prev) => ({ ...prev, list: false, tabChange: false }));
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isOwnerAuthenticated) {
        try {
          await Promise.all([fetchBookings("pending"), fetchBookings("confirmed"), fetchBookings("rejected")]);
        } catch (error) {
          console.error("Error fetching initial booking data:", error);
        }
      } else {
        console.error("User is not authenticated as owner");
      }

      // Fetch user details (Settings part)
      if (isOwnerAuthenticated) {
        const userId = type === "owner" ? owner?.id : user?.id;
        const url = new URL(fetchDetailsUrl);
        url.searchParams.append("userId", userId);
        url.searchParams.append("type", type);

        try {
          const response = await fetch(url, { method: "GET" });
          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
    };

    fetchInitialData();
  }, [type, user, owner, isOwnerAuthenticated]);

  const renderComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContentOwner />;
      case "booking":
        return (
          <BookingStatus
            bookings={bookings}
            stats={stats}
            loading={loading}
            fetchBookings={fetchBookings}
            ownerId={owner?._id}
          />
        );
      case "payments":
        return <Payments />;
      case "settings":
        return <SettingsOwner userDetails={userDetails} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-white shadow p-4 items-center sticky top-0 h-screen">
        <svg className="w-10 h-10 rounded-full mb-2 bg-gray-200" viewBox="0 0 100 100">
          <circle cx="50" cy="40" r="20" fill="#4F46E5" />
          <circle cx="50" cy="80" r="25" fill="#4F46E5" />
        </svg>

        <div className="text-center mb-6">
          <div className="text-base font-semibold">{ownerName}</div>
          <div className="text-sm text-gray-500">Property Owner</div>
        </div>
        <nav className="flex flex-col gap-2 w-full">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={cn("flex items-center gap-2 p-2 rounded hover:bg-gray-100", activeTab === item.key && "bg-gray-100 font-medium")}
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

