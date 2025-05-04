// // import React, { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import Sidebar from "../components/sidebar";
// // import BookingTable from "../components/BookingTable";
// // import Settings from "../components/settings";
// // import DashboardContent from "../components/dashboardContent";
// // import { fetchDetailsUrl } from "../constant/urls";
// // import { useAuth } from "../contexts/AuthContext";

// // function NewDashBoard() {
// //   const [activePage, setActivePage] = useState("Dashboard");
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //   const [userDetails, setUserDetails] = useState(null);
// //   const {
// //       userName,
// //       IsAuthenticated,
// //       isOwnerAuthenticated,
// //       ownerName,
// //       user,
// //       owner,
// //       type,
// //     } = useAuth();

// //   useEffect(() => {
// //     const fetchDetails = async () => {
// //      // setIsLoading(true);
// //       try {
// //         const userId = type === "student" ? user?.id : owner?.id;
// //         if (!userId) {
// //           console.error("User ID is missing");
// //           return;
// //         }

// //         const url = new URL(fetchDetailsUrl);
// //         url.searchParams.append("userId", userId);
// //         url.searchParams.append("type", type);

// //         const response = await fetch(url, { method: "GET" });

// //         if (!response.ok) {
// //           throw new Error("Failed to fetch details");
// //         }

// //         const data = await response.json();
// //         setUserDetails(data); // Pass this to Settings
// //       } catch (error) {
// //         console.error("Error fetching details:", error);
// //       } finally {
// //       //  setIsLoading(false);
// //       }
// //     };

// //     fetchDetails();
// //   }, [type, user, owner]);

// //   return (
// //     <div className="min-h-screen bg-gray-100 text-gray-800">
// //       {/* Header */}
// //       <header className="bg-white p-4 shadow rounded-md mb-6 flex flex-wrap items-center justify-between">
// //         <div className="flex items-center flex-1 lg:flex-none">
// //           <Link to="/">
// //           <h1 className="text-xl lg:text-2xl font-bold text-blue-500">
// //             Mess<span className="text-gray-800">Mate.</span>
// //           </h1>
// //           </Link>
// //         </div>

// //         <div className="flex justify-center w-full lg:w-auto mt-4 lg:mt-0 flex-1">
// //           <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-inner w-full lg:w-96">
// //             <svg
// //               xmlns="http://www.w3.org/2000/svg"
// //               className="w-5 h-5 text-gray-400"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth="2"
// //                 d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
// //               />
// //             </svg>
// //             <input
// //               type="text"
// //               placeholder="Search for messes, PGs, or bookings..."
// //               className="bg-transparent w-full ml-2 focus:outline-none text-gray-700"
// //             />
// //           </div>
// //         </div>

// //         <div className="hidden lg:flex flex-1"></div>
// //       </header>

// //       <div className="max-w-7xl mx-auto p-4">
// //         <header className="bg-white p-6 shadow rounded-md mb-6">
// //           <h1 className="text-2xl font-bold">Welcome back, Sandip!</h1>
// //           <p className="text-gray-500 mt-2">
// //             Last login: 8th Jan 2025, 10:00 AM
// //           </p>
// //         </header>

// //         {/* Main Layout */}
// //         <div className="flex h-[calc(100vh-14rem)] ">
// //           {/* Sidebar */}
// //           <Sidebar setActivePage={setActivePage} isOpen={isSidebarOpen} />

// //           {/* Right-side Content */}
// //           <div className=" lg:overflow-y-auto " style={{width:'100%'}}>
// //             {activePage === "My Bookings" && <BookingTable />}
// //             {activePage === "Dashboard" && <DashboardContent/>}
// //             {activePage === "Payments" && <div>Payments Content</div>}
// //             {activePage === "Settings" && <Settings user={userDetails} />}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default NewDashBoard;
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   Home,
//   CalendarCheck,
//   CreditCard,
//   Settings as Gear,
// } from "lucide-react";
// import axios from "axios";
// import { baseurl, fetchDetailsUrl } from "../constant/urls";
// import { toast } from "react-toastify";
// // import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Sidebar from "../components/sidebar";
// import BookingTable from "../components/BookingTable";
// import Settings from "../components/settings";
// import DashboardContent from "../components/dashboardContent";

// function NewDashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [userDetails, setUserDetails] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({
//     upcoming: 0,
//     active: 0,
//     past: 0,
//   });
//   const [currentStay, setCurrentStay] = useState(null);
//   const [upcomingStay, setUpcomingStay] = useState(null);
//   const [pastStay, setPastStay] = useState(null);
//   const [daysRemaining, setDaysRemaining] = useState(0);
//   const [totalAmountConfirmed, setTotalAmountConfirmed] = useState(0);
//   const [maintenanceHistory, setMaintenanceHistory] = useState([]);


//   const { userName, user, owner, type } = useAuth();

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const userId = type === "student" ? user?.id : owner?.id;
//       if (!userId) return;

//       // Fetch user details
//       const detailsUrl = new URL(fetchDetailsUrl);
//       detailsUrl.searchParams.append("userId", userId);
//       detailsUrl.searchParams.append("type", type);

//       const detailsResponse = await fetch(detailsUrl, { method: "GET" });
//       if (!detailsResponse.ok) throw new Error("Failed to fetch user details");
//       const detailsData = await detailsResponse.json();
//       setUserDetails(detailsData);

//       // Only fetch bookings if user is a student
//       if (type === "student") {
//         const token = localStorage.getItem("accessToken");
//         const response = await axios.get(`${baseurl}/auth/bookings/user`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Bookings response:", response.data);
//         if (response.data && response.data.success) {
//           const now = new Date();
//           const bookingsData = response.data.bookings || [];

//           // Process bookings with end dates
//           const bookingsWithDates = bookingsData.map((booking) => {
//             const endDate = new Date(booking.period.startDate);
//             endDate.setMonth(
//               endDate.getMonth() + booking.period.durationMonths
//             );

//             return {
//               ...booking,
//               period: {
//                 ...booking.period,
//                 endDate,
//               },
//             };
//           });

//           setBookings(bookingsWithDates);

//           // Filter only confirmed bookings for stats
//           const confirmedBookings = bookingsWithDates.filter(
//             (b) => b.status === "confirmed"
//           );

//           // // Calculate stats
//           // const upcoming = confirmedBookings.filter(
//           //   (b) => new Date(b.period.startDate) > now
//           // ).length;

//           // const active = confirmedBookings.filter(
//           //   (b) =>
//           //     new Date(b.period.startDate) <= now &&
//           //     now <= new Date(b.period.endDate)
//           // ).length;

//           // const past = bookingsWithDates.filter(
//           //   (b) => new Date(b.period.endDate) < now
//           // ).length;

//           setStats({
//             upcoming: response.data.stats.upcoming,
//             active: response.data.stats.current, 
//             past: response.data.stats.past,
//           });

//           // Set stays arrays from backend
//     setCurrentStay(response.data.currentStays || []);
//     setUpcomingStay(response.data.upcomingStays || []);
//     setPastStay(response.data.pastStays || []);
//     setDaysRemaining(response.data.daysRemaining || 0);
//     setTotalAmountConfirmed(response.data.totalAmountConfirmed || 0);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error(error.response?.data?.message || "Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.id) {
//       fetchAllData();
//     }
//   }, [type, user, owner, user?.id]);

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       );
//     }

//     switch (activeTab) {
//       case "dashboard":
//         return (
//           <DashboardContent
//           user={userDetails}
//           bookings={bookings}
//           currentStay={currentStay}
//           upcomingStay={upcomingStay}
//           pastStay={pastStay}
//           stats={stats}
//           daysRemaining={daysRemaining}
//           totalAmountConfirmed={totalAmountConfirmed}
//           loading={loading}
//         />
//         );
//       case "bookings":
//         return (
//           <BookingTable
//             bookings={bookings}
//             stats={stats}
//             currentStay={currentStay}
//             loading={loading}
//           />
//         );
//       case "payments":
//         return <div>Payments Content</div>;
//       case "settings":
//         return <Settings user={userDetails} />;
//       default:
//         return (
//           <DashboardContent
//           user={userDetails}
//           bookings={bookings}
//           currentStay={currentStay}
//           upcomingStay={upcomingStay}
//           pastStay={pastStay}
//           stats={stats}
//           daysRemaining={daysRemaining}
//           totalAmountConfirmed={totalAmountConfirmed}
//           loading={loading}
//         />
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 relative">
//       {/* Sidebar for desktop */}
//       <aside className="hidden md:flex md:w-64 bg-white border-r flex-col p-4 fixed h-full">
//         <ProfileHeader userName={userName} />
//         <nav className="flex flex-col gap-4 mt-8">
//           <SidebarButton
//             icon={<Home />}
//             label="Dashboard"
//             active={activeTab === "dashboard"}
//             onClick={() => setActiveTab("dashboard")}
//           />
//           <SidebarButton
//             icon={<CalendarCheck />}
//             label="My Bookings"
//             active={activeTab === "bookings"}
//             onClick={() => setActiveTab("bookings")}
//           />
//           <SidebarButton
//             icon={<CreditCard />}
//             label="My Payments"
//             active={activeTab === "payments"}
//             onClick={() => setActiveTab("payments")}
//           />
//           <SidebarButton
//             icon={<Gear />}
//             label="Settings"
//             active={activeTab === "settings"}
//             onClick={() => setActiveTab("settings")}
//           />
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 md:ml-64 p-2 pb-20">{renderContent()}</main>

//       {/* Top-right profile picture for mobile */}
//       {/* <div className="md:hidden absolute top-4 right-4">
//         <svg className="w-10 h-10 rounded-full bg-gray-300" viewBox="0 0 100 100">
//           <circle cx="50" cy="40" r="20" fill="#4F46E5" />
//           <circle cx="50" cy="80" r="25" fill="#4F46E5" />
//         </svg>
//       </div> */}

//       {/* Bottom navbar for mobile */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 md:hidden">
//         <BottomNavButton
//           icon={<Home />}
//           label="Dashboard"
//           active={activeTab === "dashboard"}
//           onClick={() => setActiveTab("dashboard")}
//         />
//         <BottomNavButton
//           icon={<CalendarCheck />}
//           label="Bookings"
//           active={activeTab === "bookings"}
//           onClick={() => setActiveTab("bookings")}
//         />
//         <BottomNavButton
//           icon={<CreditCard />}
//           label="Payments"
//           active={activeTab === "payments"}
//           onClick={() => setActiveTab("payments")}
//         />
//         <BottomNavButton
//           icon={<Gear />}
//           label="Settings"
//           active={activeTab === "settings"}
//           onClick={() => setActiveTab("settings")}
//         />
//       </nav>
//     </div>
//   );
// }

// // Sidebar Button (desktop)
// function SidebarButton({ icon, label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
//         active
//           ? "bg-blue-100 text-blue-600 font-semibold"
//           : "text-gray-700 hover:bg-gray-100"
//       }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

// // Bottom navbar Button (mobile)
// function BottomNavButton({ icon, label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex flex-col items-center justify-center text-xs ${
//         active ? "text-blue-600" : "text-gray-500"
//       }`}
//     >
//       {icon}
//       <span className="text-[10px]">{label}</span>
//     </button>
//   );
// }

// // Profile Header (sidebar)
// function ProfileHeader({ userName }) {
//   return (
//     <div className="flex items-center space-x-3 mb-10">
//       <svg className="w-10 h-10 rounded-full bg-gray-300" viewBox="0 0 100 100">
//         <circle cx="50" cy="40" r="20" fill="#4F46E5" />
//         <circle cx="50" cy="80" r="25" fill="#4F46E5" />
//       </svg>
//       <div>
//         <h2 className="font-semibold text-lg">{userName}</h2>
//         <p className="text-gray-500 text-sm">Student</p>
//       </div>
//     </div>
//   );
// }

// export default NewDashboard;
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   Home,
//   CalendarCheck,
//   CreditCard,
//   Settings as Gear,
// } from "lucide-react";
// import axios from "axios";
// import { baseurl, fetchDetailsUrl } from "../constant/urls";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import Sidebar from "../components/sidebar";
// import BookingTable from "../components/BookingTable";
// import Settings from "../components/settings";
// import DashboardContent from "../components/dashboardContent";

// function NewDashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [userDetails, setUserDetails] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({ upcoming: 0, active: 0, past: 0,pending:0 });
//   const [currentStay, setCurrentStay] = useState(null);
//   const [upcomingStay, setUpcomingStay] = useState(null);
//   const [pastStay, setPastStay] = useState(null);
//   const [pendingStay, setPendingStay] = useState(null);
//   const [daysRemaining, setDaysRemaining] = useState(0);
//   const [totalAmountConfirmed, setTotalAmountConfirmed] = useState(0);
//   const [maintenanceHistory, setMaintenanceHistory] = useState([]);

//   const { userName, user, owner, type , handleLogout } = useAuth();

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const userId = type === "student" ? user?.id : owner?.id;
//       if (!userId) return;

//       // 1. Fetch user details
//       const detailsUrl = new URL(fetchDetailsUrl);
//       detailsUrl.searchParams.append("userId", userId);
//       detailsUrl.searchParams.append("type", type);
//       const detailsResponse = await fetch(detailsUrl, { method: "GET" });
//       if (!detailsResponse.ok) throw new Error("Failed to fetch user details");
//       const detailsData = await detailsResponse.json();
//       setUserDetails(detailsData);

//       // 2. Fetch bookings (for students only)
//       if (type === "student") {
//         const token = localStorage.getItem("accessToken");
//         const response = await axios.get(`${baseurl}/auth/bookings/user`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Bookings response:", response.data);
//         if (response.data && response.data.success) {
//           const now = new Date();
//           const bookingsData = response.data.bookings || [];

//           const bookingsWithDates = bookingsData.map((booking) => {
//             const endDate = new Date(booking.period.startDate);
//             endDate.setMonth(endDate.getMonth() + booking.period.durationMonths);
//             return { ...booking, period: { ...booking.period, endDate } };
//           });

//           setBookings(bookingsWithDates);

//           setStats({
//             upcoming: response.data.stats.upcoming,
//             active: response.data.stats.current,
//             past: response.data.stats.past,
//             pending: response.data.stats.pending,

//           });

//           setCurrentStay(response.data.currentStays || []);
//           setUpcomingStay(response.data.upcomingStays || []);
//           setPastStay(response.data.pastStays || []);
//           setPendingStay(response.data.pendingStays || []);
//           setDaysRemaining(response.data.daysRemaining || 0);
//           setTotalAmountConfirmed(response.data.totalAmountConfirmed || 0);
//         }

//         // 3. Fetch maintenance history
//         const maintenanceResponse = await axios.get(
//           `${baseurl}/auth/maintenance/history`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             params: {
//               userId,
//               type,
//             },
//           }
//         );
        
//         console.log("Maintenance response:", maintenanceResponse.data);
//         if (maintenanceResponse.data.success) {
//           setMaintenanceHistory(maintenanceResponse.data.data || []);
//         } else {
//           console.warn("Maintenance fetch failed:", maintenanceResponse.data.message);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error(error.response?.data?.message || "Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   useEffect(() => {
//     if (user?.id) {
//       fetchAllData();
//     }
//   }, [type, user, owner, user?.id]);

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       );
//     }

//     switch (activeTab) {
//       case "dashboard":
//         return (
//           <DashboardContent
//             user={userDetails}
//             bookings={bookings}
//             currentStay={currentStay}
//             upcomingStay={upcomingStay}
//             pastStay={pastStay}
//             pendingStay={pendingStay}
//             stats={stats}
//             daysRemaining={daysRemaining}
//             totalAmountConfirmed={totalAmountConfirmed}
//             maintenanceHistory={maintenanceHistory}
//             loading={loading}
//           />
//         );
//       case "bookings":
//         return (
//           <BookingTable
//             bookings={bookings}
//             stats={stats}
//             currentStay={currentStay}
//             loading={loading}
//           />
//         );
//       case "payments":
//         return <div>Payments Content</div>;
//       case "settings":
//         return <Settings user={userDetails} />;
//       default:
//         return <DashboardContent />;
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 relative">
//       {/* Sidebar for desktop */}
//       <aside className="hidden md:flex md:w-64 bg-white border-r flex-col p-4 fixed h-full">
//         <ProfileHeader userName={userName} />
//         <nav className="flex flex-col gap-4 mt-8">
//           <SidebarButton
//             icon={<Home />}
//             label="Dashboard"
//             active={activeTab === "dashboard"}
//             onClick={() => setActiveTab("dashboard")}
//           />
//           <SidebarButton
//             icon={<CalendarCheck />}
//             label="My Bookings"
//             active={activeTab === "bookings"}
//             onClick={() => setActiveTab("bookings")}
//           />
//           <SidebarButton
//             icon={<CreditCard />}
//             label="My Payments"
//             active={activeTab === "payments"}
//             onClick={() => setActiveTab("payments")}
//           />
//           <SidebarButton
//             icon={<Gear />}
//             label="Settings"
//             active={activeTab === "settings"}
//             onClick={() => setActiveTab("settings")}
//           />
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 md:ml-64 p-2 pb-20">{renderContent()}</main>

//       {/* Bottom navbar for mobile */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 md:hidden">
//         <BottomNavButton
//           icon={<Home />}
//           label="Dashboard"
//           active={activeTab === "dashboard"}
//           onClick={() => setActiveTab("dashboard")}
//         />
//         <BottomNavButton
//           icon={<CalendarCheck />}
//           label="Bookings"
//           active={activeTab === "bookings"}
//           onClick={() => setActiveTab("bookings")}
//         />
//         <BottomNavButton
//           icon={<CreditCard />}
//           label="Payments"
//           active={activeTab === "payments"}
//           onClick={() => setActiveTab("payments")}
//         />
//         <BottomNavButton
//           icon={<Gear />}
//           label="Settings"
//           active={activeTab === "settings"}
//           onClick={() => setActiveTab("settings")}
//         />
//       </nav>
//     </div>
//   );
// }

// function SidebarButton({ icon, label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
//         active
//           ? "bg-blue-100 text-blue-600 font-semibold"
//           : "text-gray-700 hover:bg-gray-100"
//       }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

// function BottomNavButton({ icon, label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex flex-col items-center justify-center text-xs ${
//         active ? "text-blue-600" : "text-gray-500"
//       }`}
//     >
//       {icon}
//       <span className="text-[10px]">{label}</span>
//     </button>
//   );
// }

// function ProfileHeader({ userName }) {
//   return (
//     <div className="flex items-center space-x-3 mb-10">
//       <svg className="w-10 h-10 rounded-full bg-gray-300" viewBox="0 0 100 100">
//         <circle cx="50" cy="40" r="20" fill="#4F46E5" />
//         <circle cx="50" cy="80" r="25" fill="#4F46E5" />
//       </svg>
//       <div>
//         <h2 className="font-semibold text-lg">{userName}</h2>
//         <p className="text-gray-500 text-sm">Student</p>
//       </div>
//     </div>
//   );
// }

// export default NewDashboard;
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

function NewDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ upcoming: 0, active: 0, past: 0, pending: 0 });
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
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.success) {
          const bookingsData = response.data.bookings || [];
          const bookingsWithDates = bookingsData.map((booking) => {
            const endDate = new Date(booking.period.startDate);
            endDate.setMonth(endDate.getMonth() + booking.period.durationMonths);
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
            headers: { Authorization: `Bearer ${token}` },
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
        return <BookingTable bookings={bookings} stats={stats} currentStay={currentStay} loading={loading} />;
      case "payments":
        return <div className="px-4">Payments Content</div>;
      case "settings":
        return <Settings user={userDetails} />;
      case "Cart":
         return <Cart/>;
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
            sidebarOpen ? "fixed mt-14 translate-x-0" : "fixed -translate-x-full"
          }`}
      >
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <ProfileHeader userName={userName} />
        <nav className="flex flex-col gap-4 mt-8">
          <SidebarButton icon={<Home />} label="Dashboard" active={activeTab === "dashboard"} onClick={() => handleTabChange("dashboard")} />
          <SidebarButton icon={<CalendarCheck />} label="My Bookings" active={activeTab === "bookings"} onClick={() => handleTabChange("bookings")} />
          <SidebarButton icon={<CreditCard />} label="My Payments" active={activeTab === "payments"} onClick={() => handleTabChange("payments")} />
          <SidebarButton icon={<Gear />} label="Settings" active={activeTab === "settings"} onClick={() => handleTabChange("settings")} />
          <SidebarButton icon={<HeartOff/>} label="saved Pg" active={activeTab === "Cart"} onClick={() => handleTabChange("Cart")} />
        </nav>
        <button onClick={handleLogout} className="absolute bottom-28 md:bottom-14 flex items-center gap-3 px-4 py-2 rounded-md mt-10 text-red-600 hover:bg-red-100 transition">
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
        active ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100"
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
