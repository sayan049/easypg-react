// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Sidebar from "../components/sidebar";
// import BookingTable from "../components/BookingTable";
// import Settings from "../components/settings";
// import DashboardContent from "../components/dashboardContent";
// import { fetchDetailsUrl } from "../constant/urls";
// import { useAuth } from "../contexts/AuthContext";



// function NewDashBoard() {
//   const [activePage, setActivePage] = useState("Dashboard");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [userDetails, setUserDetails] = useState(null);
//   const {
//       userName,
//       IsAuthenticated,
//       isOwnerAuthenticated,
//       ownerName,
//       user,
//       owner,
//       type,
//     } = useAuth();

//   useEffect(() => {
//     const fetchDetails = async () => {
//      // setIsLoading(true);
//       try {
//         const userId = type === "student" ? user?.id : owner?.id;
//         if (!userId) {
//           console.error("User ID is missing");
//           return;
//         }

//         const url = new URL(fetchDetailsUrl);
//         url.searchParams.append("userId", userId);
//         url.searchParams.append("type", type);

//         const response = await fetch(url, { method: "GET" });

//         if (!response.ok) {
//           throw new Error("Failed to fetch details");
//         }

//         const data = await response.json();
//         setUserDetails(data); // Pass this to Settings
//       } catch (error) {
//         console.error("Error fetching details:", error);
//       } finally {
//       //  setIsLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [type, user, owner]);

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-800">
//       {/* Header */}
//       <header className="bg-white p-4 shadow rounded-md mb-6 flex flex-wrap items-center justify-between">
//         <div className="flex items-center flex-1 lg:flex-none">
//           <Link to="/">
//           <h1 className="text-xl lg:text-2xl font-bold text-blue-500">
//             Mess<span className="text-gray-800">Mate.</span>
//           </h1>
//           </Link>
//         </div>

//         <div className="flex justify-center w-full lg:w-auto mt-4 lg:mt-0 flex-1">
//           <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-inner w-full lg:w-96">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
//               />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search for messes, PGs, or bookings..."
//               className="bg-transparent w-full ml-2 focus:outline-none text-gray-700"
//             />
//           </div>
//         </div>

//         <div className="hidden lg:flex flex-1"></div>
//       </header>

//       <div className="max-w-7xl mx-auto p-4">
//         <header className="bg-white p-6 shadow rounded-md mb-6">
//           <h1 className="text-2xl font-bold">Welcome back, Sandip!</h1>
//           <p className="text-gray-500 mt-2">
//             Last login: 8th Jan 2025, 10:00 AM
//           </p>
//         </header>

//         {/* Main Layout */}
//         <div className="flex h-[calc(100vh-14rem)] ">
//           {/* Sidebar */}
//           <Sidebar setActivePage={setActivePage} isOpen={isSidebarOpen} />

//           {/* Right-side Content */}
//           <div className=" lg:overflow-y-auto " style={{width:'100%'}}>
//             {activePage === "My Bookings" && <BookingTable />}
//             {activePage === "Dashboard" && <DashboardContent/>}
//             {activePage === "Payments" && <div>Payments Content</div>}
//             {activePage === "Settings" && <Settings user={userDetails} />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default NewDashBoard;
import React, { useState, useEffect } from "react";
import { FaHome, FaBook, FaMoneyBill, FaCog } from "react-icons/fa";
import Sidebar from "../components/sidebar";
import BookingTable from "../components/BookingTable";
import Settings from "../components/settings";
import DashboardContent from "../components/dashboardContent";
import { fetchDetailsUrl } from "../constant/urls";
import { useAuth } from "../contexts/AuthContext";

function NewDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userDetails, setUserDetails] = useState(null);

  const {
    userName,
    user,
    owner,
    type,
  } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userId = type === "student" ? user?.id : owner?.id;
        if (!userId) return;

        const url = new URL(fetchDetailsUrl);
        url.searchParams.append("userId", userId);
        url.searchParams.append("type", type);

        const response = await fetch(url, { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch details");

        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, [type, user, owner]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "bookings":
        return <BookingTable />;
      case "payments":
        return <div>Payments Content</div>;
      case "settings":
        return <Settings user={userDetails} />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 relative">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 bg-white border-r flex-col p-4 fixed h-full">
        <ProfileHeader userName={userName} />
        <nav className="flex flex-col gap-4 mt-8">
          <SidebarButton icon={<FaHome />} label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <SidebarButton icon={<FaBook />} label="My Bookings" active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} />
          <SidebarButton icon={<FaMoneyBill />} label="My Payments" active={activeTab === "payments"} onClick={() => setActiveTab("payments")} />
          <SidebarButton icon={<FaCog />} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 pb-20">{renderContent()}</main>

      {/* Top-right profile picture for mobile */}
      <div className="md:hidden absolute top-4 right-4">
        <svg className="w-10 h-10 rounded-full bg-gray-300" viewBox="0 0 100 100">
          <circle cx="50" cy="40" r="20" fill="#4F46E5" />
          <circle cx="50" cy="80" r="25" fill="#4F46E5" />
        </svg>
      </div>

      {/* Bottom navbar for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 md:hidden">
        <BottomNavButton icon={<FaHome />} label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
        <BottomNavButton icon={<FaBook />} label="Bookings" active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} />
        <BottomNavButton icon={<FaMoneyBill />} label="Payments" active={activeTab === "payments"} onClick={() => setActiveTab("payments")} />
        <BottomNavButton icon={<FaCog />} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
      </nav>
    </div>
  );
}

// Sidebar Button (desktop)
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

// Bottom navbar Button (mobile)
function BottomNavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center text-xs ${
        active ? "text-blue-600" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </button>
  );
}

// Profile Header (sidebar)
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
