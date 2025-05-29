
"use client";

import { useState, useEffect, useRef } from "react";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../designs/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfile from "../components/UserProfile";
import "../designs/UserProfile.css";
import { useAuth } from "../contexts/AuthContext";
import { LocationIqurl, fetchDetailsUrl } from "../constant/urls";
import Recommendations from "../components/Recommendations";
import {
  Home,
  Info,
  Phone,
  LogIn,
  Briefcase,
  X,
  AlertTriangle,
  CheckCircle2,
  Bell,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Map, MapPin } from "lucide-react";
import { useSocket } from "../contexts/socketContext";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLocationChanged, setIsLocationChanged] = useState(false);
  const socialIcons = {
    facebook: "https://api.iconify.design/mdi:facebook.svg?color=white",
    linkedin: "https://api.iconify.design/mdi:linkedin.svg?color=white",
    instagram: "https://api.iconify.design/mdi:instagram.svg?color=white",
  };
  const {
    userName,
    IsAuthenticated,
    handleLogout,
    logoutSuccess,
    isOwnerAuthenticated,
    ownerName,
    owner,
    loginMethod,
  } = useAuth();
  const {
    hasUnread,
    isConnected,
    data,
    setIsConnected,
    hasUnreadOwner,
    hasUnreadOwnerCancel,
  } = useSocket();
  const [menuOpen, setMenuOpen] = useState(false);
  const [nearbyMesses, setNearbyMesses] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const searchContainerRef = useRef(null);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Enhanced Alert Component
  const ProfileAlert = ({ show, onDismiss, type = "warning" }) => {
    if (!show) return null;

    const alertConfig = {
      warning: {
        bgColor: "bg-gradient-to-r from-amber-50 to-orange-50",
        borderColor: "border-amber-200",
        iconColor: "text-amber-600",
        titleColor: "text-amber-800",
        textColor: "text-amber-700",
        icon: AlertTriangle,
        glowColor: "shadow-amber-100",
      },
      success: {
        bgColor: "bg-gradient-to-r from-emerald-50 to-green-50",
        borderColor: "border-emerald-200",
        iconColor: "text-emerald-600",
        titleColor: "text-emerald-800",
        textColor: "text-emerald-700",
        icon: CheckCircle2,
        glowColor: "shadow-emerald-100",
      },
      info: {
        // bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
        // borderColor: "border-blue-200",
        // iconColor: "text-blue-600",
        // titleColor: "text-blue-800",
        // textColor: "text-blue-700",
        // icon: Bell,
        // glowColor: "shadow-blue-100",
        bgColor: "bg-gradient-to-r from-cyan-50 to-teal-50",
        borderColor: "border-teal-200",
        iconColor: "text-[#2CA4B5]",
        titleColor: "text-teal-800",
        textColor: "text-teal-700",
        icon: AlertTriangle,
        glowColor: "shadow-teal-100",
      },
    };

    const config = alertConfig[type];
    const Icon = config.icon;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.3,
          }}
          className={`absolute -top-4 -left-[27rem] z-50 w-[27rem] ${config.bgColor} ${config.borderColor} border-2 rounded-2xl shadow-2xl ${config.glowColor} backdrop-blur-sm`}
          style={{
            filter: "drop-shadow(0 20px 25px rgb(0 0 0 / 0.15))",
          }}
        >
          {/* Decorative top border */}
          {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-t-2xl"> */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2CA4B5] to-transparent rounded-t-2xl"></div>

          {/* Arrow pointing to profile */}
          {/* <div className="absolute top-6 -right-2 w-4 h-4 bg-white border-r-2 border-b-2 border-amber-200 transform rotate-45"></div> */}
          <div className="absolute top-6 -right-2 w-4 h-4 bg-white border-r-2 border-b-2 border-[#2CA4B5] transform rotate-45"></div>

          <div className="p-6">
            <div className="flex items-start space-x-4">
              {/* Animated Icon */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center border-2 ${config.borderColor}`}
              >
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
              </motion.div>

              <div className="flex-1 min-w-0">
                {/* Title with gradient */}
                <motion.h4
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`font-bold text-lg ${config.titleColor} mb-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent`}

                  // className={`font-bold text-lg ${config.titleColor} mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent`}
                >
                  Profile Update Required
                </motion.h4>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-sm ${config.textColor} leading-relaxed mb-4`}
                >
                  Complete your profile details to activate your mess listing
                  and start receiving bookings.
                </motion.p>
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDismiss}
                className={`flex-shrink-0 w-8 h-8 ${config.textColor} hover:bg-white/50 rounded-full flex items-center justify-center transition-all duration-200`}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Progress indicator */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
              className="mt-4 h-1 bg-gradient-to-r from-[#99e2e5] to-[#2CA4B5] rounded-full overflow-hidden"

              //className="mt-4 h-1 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#2CA4B5] to-transparent"

                //  className="h-full w-1/3 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  useEffect(() => {
    document.title = "MessMate - Find your nearest PG/Mess easily";
  }, []);

  useEffect(() => {
    // console.log(
    //   "data:",
    //   data,
    //   "isConnected:",
    //   isConnected,
    //   "data?.status:",
    //   data?.booking?.status
    // );
    if (isConnected) {
      if (data?.booking?.status === "rejected" || data?.status === "rejected") {
        toast.info("your booking has been rejected by the owner");
      }
      if (
        data?.booking?.status === "confirmed" ||
        data?.status === "confirmed"
      ) {
        toast.success("Your booking has been confirmed by the owner");
      }
      if (data?.booking?.status === "pending" || data?.status === "pending") {
        toast.info("You have a new booking request! valid for 24 hours");
      }
      if (data?.booking?.status === "expired" || data?.status === "expired") {
        toast.error(
          "Your booking request has expired. Please check your bookings."
        );
      }
      if (
        data?.booking?.status === "cancelled" ||
        data?.status === "cancelled"
      ) {
        if (
          data?.booking?.requestType === "pending-cancel" ||
          data?.requestType === "pending-cancel"
        ) {
          toast.info(
            `pending request has been cancelled by the user for ${data?.booking?.room}`
          );
        }
        if (
          data?.booking?.requestType === "confirmed-cancel" ||
          data?.requestType === "confirmed-cancel"
        ) {
          toast.info(
            "user cancelled your booking request. Please check your bookings."
          );
        }
      }

      setIsConnected(false);
    }
  }, [isConnected, data]);

  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "address",
    "pincode",
    "mobileNo",
    "messName",
    "aboutMess",
    "location",
    "profilePhoto",
  ];
  useEffect(() => {
    const fetchDetails = async () => {
      if (isOwnerAuthenticated && loginMethod === "google") {
        try {
          const userId = owner.type === "owner" ? owner?.id : null;
          if (!userId) return;

          const url = new URL(fetchDetailsUrl);
          url.searchParams.append("userId", userId);
          url.searchParams.append("type", owner.type);

          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch details");
          const data = await response.json();
          setUserDetails(data);
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
    };

    fetchDetails();
  }, [owner]);

  useEffect(() => {
    if (loginMethod === "google" && userDetails) {
      const missingFields = requiredFields.filter(
        (field) =>
          !userDetails[field] ||
          (typeof userDetails[field] === "string" &&
            userDetails[field].trim() === "")
      );

      if (missingFields.length > 0) {
      //  console.log("Missing fields:", missingFields);
        setShowProfileAlert(true);
        localStorage.setItem("needToUpdateProfile", "true");
      }
      else{
        setShowProfileAlert(false);
        localStorage.removeItem("needToUpdateProfile");
      }
    }
  }, [userDetails]);

  const debounceTimeout = useRef(null);

  const handleInputChange = async (event) => {
    const query = event.target.value;
    setSearchItem(query);

    if (query.length > 3) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(async () => {
        const fetchUrl = `${LocationIqurl}?input=${encodeURIComponent(query)}`;

        try {
          const response = await fetch(fetchUrl);
          const data = await response.json();
          setSuggestions(data || []);
        } catch (error) {
          console.error("Error fetching data from backend:", error);
        }
      }, 1000);
    } else {
      setSuggestions([]);
    }
  };

  const clickLogin = () => {
    navigate("/choose-role");
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchItem(suggestion.display_name);
    setSelectedLocation({
      lat: suggestion.lat,
      lng: suggestion.lng,
    });
    setSuggestions([]);

    const slug = suggestion.display_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    navigate(`/find-mess/${slug}?lat=${suggestion.lat}&lng=${suggestion.lon}`);
  };

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "About", icon: Info, path: "/about" },
    { name: "Services", icon: Briefcase, path: "/services" },
    { name: "Contact Us", icon: Phone, path: "/contact" },
    { name: "Login", icon: LogIn, path: "/choose-role" },
  ];

  const performSearch = () => {
    if (!selectedLocation) {
      toast.error("Please select a location from the suggestions!");
      return;
    }

    navigate(
      `/find-mess/${encodeURIComponent(searchItem)}/${encodeURIComponent(
        JSON.stringify(selectedLocation)
      )}`
    );

    setSearchItem("");
  };

  const handleCityClick = (cityName, coords) => {
    setSearchItem(cityName);
    setSelectedLocation(coords);
    const slug = cityName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    navigate(`/find-mess/${slug}?lat=${coords.lat}&lng=${coords.lng}`);
  };

  useEffect(() => {
    const storedMessage = localStorage.getItem("sId_message");
    if (storedMessage) {
      setMessage(location.state?.message || "");
      toast.success(storedMessage);
    }

    const timer = setTimeout(() => {
      setMessage("");
      localStorage.removeItem("sId_message");
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state?.message]);

  useEffect(() => {
    if (IsAuthenticated) {
      try {
        console.log("user name:", userName);
      } catch (error) {
        console.error("Error decoding or accessing token:", error);
      }
    } else if (isOwnerAuthenticated) {
      try {
        console.log("owner name:", ownerName);
      } catch (error) {
        console.error("Error decoding or accessing token:", error);
      }
    } else {
      // console.log("Token is not present in cookies");
    }
  }, [IsAuthenticated, userName, isOwnerAuthenticated, ownerName]);

  useEffect(() => {
    const storedLogoutStatus = localStorage.getItem("logoutStatus");
    if (storedLogoutStatus) {
      setLogoutStatus(storedLogoutStatus);
      setTimeout(() => {
        localStorage.removeItem("logoutStatus");
        setLogoutStatus("");
      }, 5000);
    }
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
  };

  const handleScroll = (event, id) => {
    event.preventDefault();
    const targetSection = document.getElementById(id);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const handleFindNearMe = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        navigate(`/find-mess/you?lat=${latitude}&lng=${longitude}`);

        setTimeout(() => {
          setIsLocating(false);
          toast.success("Found your location! Showing nearby messes.");
        }, 2000);
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = "Unknown error occurred while getting your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setLocationError(errorMessage);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // remove #
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // slight delay to ensure page renders first
      }
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>Messmate | Book PGs and Mess Easily Near You</title>
        <meta
          name="description"
          content="Messmate helps students easily find PGs and mess facilities by searching through cities or universities. PG and mess owners can also list their PGs on Messmate and rapidly grow their business with increased visibility and bookings."
        />
        <meta
          name="keywords"
          content="Messmate, PG booking, mess finder, hostel, student stay, paying guest, List PG, List mess, student accommodation, university mess"
        />
        <meta name="author" content="Messmate Team" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.messmate.co.in/" />
        <meta
          property="og:title"
          content="Messmate | Find and Book PGs or Mess Near You"
        />
        <meta
          property="og:description"
          content="Find comfortable and verified PGs or mess near your university with Messmate."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746794665/main-681df86fe504d_ltnvdn.webp"
        />
        <meta property="og:url" content="https://www.messmate.co.in/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Messmate | Find PGs and Mess" />
        <meta
          name="twitter:description"
          content="Search and book verified PGs and mess with ease. Join thousands of happy students."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746794665/main-681df86fe504d_ltnvdn.webp"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "MessMate",
            url: "https://www.messmate.co.in/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.messmate.co.in/find-mess/{search_term}",
              "query-input": "required name=search_term",
            },
            description:
              "Student accommodation platform connecting students with verified PGs and mess facilities",
            sameAs: [
              "https://facebook.com/messmate",
              "https://twitter.com/messmate",
              "https://instagram.com/messmate",
            ],
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MessMate",
            url: "https://www.messmate.co.in/",
            logo: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-7479170108",
              contactType: "customer service",
              email: "messmatecompany@gmail.com.com",
              areaServed: "India",
            },
            sameAs: [
              "https://facebook.com/messmate",
              "https://twitter.com/messmate",
              "https://instagram.com/messmate",
            ],
          })}
        </script>
      </Helmet>
      <div className="bg-white overflow-x-hidden">
        {/* Gradient Background with Overlay */}
        <div className="relative ">
          {/* Header Section */}
          <header className="sticky top-0 w-full z-50 bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-[100vw]">
              <div className="flex items-center space-x-1">
                <img
                  src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp"
                  alt="MessMate - Company Logo"
                  className="h-10 w-auto"
                  loading="lazy"
                />
                <div
                  className="text-2xl font-bold text-[#2ca4b5] mt-[10px] ml-[-1px]
"
                >
                  essMate
                </div>
              </div>

              <nav className="hidden lg:flex space-x-8">
                {["Home", "About", "Services", "Contact us"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                    className="text-gray-700 hover:text-[#2CA4B5] font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#2CA4B5] after:transition-all hover:after:w-full"
                  >
                    {item}
                  </a>
                ))}
              </nav>

              {IsAuthenticated || isOwnerAuthenticated ? (
                <div className="relative">
                  {/* Enhanced Profile Alert */}
                  <ProfileAlert
                    show={ showProfileAlert}
                    onDismiss={() => setShowProfileAlert(false)}
                    type="info"
                  />

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="imageProfile cursor-pointer relative"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <UserProfile className="h-12 w-12 ring-2 ring-[#2CA4B5] rounded-full" />

                    {/* Enhanced notification badge */}
                    {(hasUnread || hasUnreadOwner || hasUnreadOwnerCancel || showProfileAlert) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-white shadow-lg"
                      >
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          className="absolute inset-0 bg-red-400 rounded-full opacity-75"
                        />
                      </motion.span>
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <div className="py-1">
                          <Link
                            to={
                              IsAuthenticated
                                ? "/dashboard/user"
                                : "/dashboard/owner"
                            }
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#2CA4B5] hover:text-white transition-colors duration-200"
                            onClick={() => setShowDropdown(false)}
                          >
                            Profile
                          </Link>
                          <div className="border-t border-gray-200"></div>
                          <button
                            onClick={() => {
                              handleLogoutClick();
                              setShowDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#2CA4B5] hover:text-white transition-colors duration-200"
                          >
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:block rounded-full bg-white text-gray-800 px-6 py-2 border-2 border-[#2CA4B5] font-semibold text-sm hover:bg-[#2CA4B5] hover:text-white transition-colors duration-300"
                  onClick={clickLogin}
                >
                  <Link to="/choose-role">Login</Link>
                </motion.button>
              )}

              {!isOwnerAuthenticated && !IsAuthenticated && (
                <button
                  className="lg:hidden text-2xl text-gray-800 focus:outline-none"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        menuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              )}
            </div>
          </header>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 right-0 w-full h-full bg-white z-50 shadow-2xl rounded-l-2xl flex flex-col md:w-64"
              >
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-6">
                  <div className="space-y-1">
                    {menuItems.map(({ name, path, icon: Icon }) => (
                      <a
                        key={name}
                        href={`#${name.toLowerCase().replace(/\s+/g, "")}`}
                        onClick={
                          name === "Login"
                            ? clickLogin
                            : () => setMenuOpen(false)
                        }
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <Icon className="h-5 w-5 mr-4 text-[#2CA4B5]" />
                        {name}
                      </a>
                    ))}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="!max-w-[90vw] mx-auto mt-4 sm:mt-0"
          />

          {/* Hero Section */}
          <section
            id="home"
            className="relative bg-gradient-to-br from-[#2CA4B5] via-[#4db6c5] to-[#7fd4e1] py-10 lg:py-32 "
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRtMC05YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00TTI0IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center lg:text-left max-w-lg"
                >
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Find Your Perfect{" "}
                    <span className="text-yellow-200">Student Home</span> -
                    Hassle-Free!
                  </h1>
                  <p className="text-white text-lg mt-4 opacity-90">
                    The ultimate platform for students to find their ideal
                    accommodation
                  </p>
                  <div className="w-full px-0 sm:px-4" ref={searchContainerRef}>
                    <div className="max-w-full mx-auto rounded-2xl shadow-2xl overflow-hidden bg-white">
                      {/* Search Box */}
                      <div
                        className={`relative flex items-center px-3 py-2 border-b transition-all duration-300 ${
                          isSearchFocused ? "ring-2 ring-[#2CA4B5]/50" : ""
                        }`}
                      >
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 flex-shrink-0">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search city or University"
                          className="w-full py-3 pl-10 pr-8 sm:pr-12 text-sm sm:text-base bg-white text-gray-800 placeholder-gray-400 focus:outline-none min-h-[48px]"
                          value={searchItem}
                          onChange={handleInputChange}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setIsSearchFocused(false)}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (suggestions.length > 0) {
                              handleSuggestionClick(suggestions[0]);
                            } else {
                              toast.error(
                                "Pick a valid location from suggestions"
                              );
                            }
                          }}
                          className="absolute right-2 inset-y-0 my-auto h-9 w-9 bg-[#2CA4B5] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white z-10"
                          aria-label="Search"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </motion.button>
                      </div>

                      {/* Suggestions */}
                      <AnimatePresence>
                        {suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white max-h-60 overflow-y-auto w-full"
                          >
                            {suggestions.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                whileHover={{
                                  backgroundColor: "#2CA4B5",
                                  color: "white",
                                }}
                                className="p-3 cursor-pointer hover:bg-[#2CA4B5] hover:text-white transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 mr-2">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 min-w-[16px]"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                  </div>
                                  <span className="truncate text-sm sm:text-base break-words whitespace-normal">
                                    {suggestion.display_name}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFindNearMe}
                      disabled={isLocating}
                      className="group flex items-center justify-center gap-2 bg-white px-6 py-3 rounded-full font-medium shadow-md transition-colors duration-300 hover:bg-[#5FC8D3] disabled:opacity-70"
                    >
                      {isLocating ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Locating...
                        </>
                      ) : (
                        <>
                          <Map className="h-5 w-5" />
                          <p className="text-[#136b75] group-hover:text-white transition-colors duration-300">
                            Nearby PGs →
                          </p>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-lg"
                >
                  <div className="absolute -inset-3 sm:-inset-4 bg-white/20 rounded-full blur-xl"></div>
                  <img
                    src="https://s2.svgbox.net/illlustrations.svg?ic=sweet-home"
                    alt="Messmate - House illustration"
                    className="relative z-10 rounded-lg transform hover:scale-105 hover:rotate-1 transition-all duration-500 w-full h-auto"
                    loading="lazy"
                    fetchPriority="high"
                  />
                </motion.div>
              </div>
            </div>
          </section>
        </div>

        {/* Features Section */}
        <section className="py-10 bg-gradient-to-b from-[#e6f7fa] to-white relative">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Us
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-10 md:grid-cols-3 text-center"
            >
              {[
                {
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746794954/online-booking-1-681df995da284_khziqg.webp",
                  title: "Messmate - Quick and easy bookings illustration",
                  desc: "Secure your room in no time with hassle-free instant booking",
                },
                {
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746794952/choice-1-681df9990059d_av3lb9.webp",
                  title: "Messmate - The widest choice",
                  desc: "Browse verified, affordable student rooms close to university",
                },
                {
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746794947/support-1-681df9a422b6b_mcm2s3.webp",
                  title: "We're here to help",
                  desc: "Reach out to our friendly team of experts who are always on hand",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-center mb-6">
                    <motion.img
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      src={feature.img}
                      alt={feature.title}
                      className="h-24 w-auto"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Popular Cities Section */}
        <section className="py-10 bg-white" id="cities">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Explore popular student cities
              </h2>
              <div className="w-20 h-1 bg-[#2CA4B5] mx-auto"></div>
            </motion.div>

            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {[
                {
                  name: "Kolkata",
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746795199/kolkata-681dfa8eb8a88_imgdzm.webp",
                  coords: { lat: 22.5726, lng: 88.3639 },
                  PGs: 263,
                },
                {
                  name: "Bankura",
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746795204/bankura-681dfa8b39d3a_blnheh.webp",
                  coords: { lat: 23.2324, lng: 87.0712 },
                  PGs: 263,
                },
                {
                  name: "West Medinipur",
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746795213/westmed-681dfa8fb838a_j3rh3j.webp",
                  coords: { lat: 22.4211, lng: 87.3216 },
                  PGs: 263,
                },
                {
                  name: "Jhargram",
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746795210/jhargram-681dfa8d9979f_pxchzm.webp",
                  coords: { lat: 22.4526, lng: 86.9946 },
                  PGs: 263,
                },
                {
                  name: "Bardhaman",
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746795208/bardhaman-681dfa8c4e1cf_xyxupb.webp",
                  coords: { lat: 23.2333, lng: 87.8667 },
                  PGs: 263,
                },
                {
                  name: "Kalyani",
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746795215/kalyani-681dfa8e9781a_tzrkxz.webp",
                  coords: { lat: 22.9756, lng: 88.4345 },
                  PGs: 263,
                },
                {
                  name: "Durgapur",
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746795211/durgapur-681dfa8d77fbd_teigra.webp",
                  coords: { lat: 23.5204, lng: 87.3119 },
                  PGs: 263,
                },
                {
                  name: "Asansole",
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746795201/asansole-681dfa8b2b977_gyoktg.webp",
                  coords: { lat: 23.6739, lng: 86.9524 },
                  PGs: 263,
                },
                {
                  name: "Bolpur",
                  img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746795207/bolpur-681dfa8c63300_hcgghe.webp",
                  coords: { lat: 23.6688, lng: 87.6836 },
                  PGs: 263,
                },
              ].map((city, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  onClick={() => handleCityClick(city.name, city.coords)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img
                        src={city.img || "/placeholder.svg"}
                        alt={city.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        style={{ maxWidth: "100%" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="font-medium text-white">View PGs</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-[#2CA4B5] group-hover:text-teal-700 transition-colors duration-300">
                        {city.name}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* //recc */}
        <Recommendations />
        {/* About Section */}
        <section className="py-10 bg-gray-50" id="about">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className=" mx-auto"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8">About</h2>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-2xl font-bold mb-6 text-gray-800">
                  Welcome to <span className="text-[#2CA4B5]">MessMate!</span>
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We are more than just an app—we are a community committed to
                  simplifying the lives of students and working professionals.
                  At MessMate, we believe that finding a comfortable and
                  affordable place to live shouldn't be a hassle, whether you're
                  starting a new chapter in college or moving to a new city for
                  work.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-white text-gray-800 px-6 py-3 border-2 border-[#2CA4B5] hover:bg-[#2CA4B5] hover:text-white font-semibold text-sm transition-all duration-300 flex items-center"
                  onClick={() => navigate("/about")}
                >
                  See More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-10 bg-white" id="services">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl font-bold text-gray-800 mb-12"
            >
              Services
            </motion.h2>

            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex-1"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Why MessMate?
                </h3>
                <p className="text-3xl text-[#2CA4B5] font-semibold mb-6 flex items-baseline">
                  1000+
                  <span className="text-gray-700 text-xl ml-2">
                    students helped!
                  </span>
                </p>

                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">
                    How It Works:
                  </h4>
                  <ul className="space-y-6">
                    {[
                      { color: "bg-orange-500", text: "Login to messmate." },
                      {
                        color: "bg-yellow-500",
                        text: "Search for any location or university.",
                      },
                      {
                        color: "bg-green-500",
                        text: "Book, pay, and manage everything in one place.",
                      },
                    ].map((step, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex items-center"
                      >
                        <span
                          className={`h-5 w-5 ${step.color} rounded-full inline-block mr-4 flex-shrink-0`}
                        ></span>
                        <span className="text-gray-700">{step.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex-1 flex justify-center"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#2CA4B5]/10 rounded-full blur-xl"></div>
                  <img
                    src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1747245161/4167280_18775_vwpk8u.webp"
                    alt="Messmate - Business Meeting illustration"
                    className="relative  duration-300 max-w-full"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-10 bg-gray-50" id="contactus">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl font-bold text-gray-800 mb-12"
            >
              <span>Contact Us - </span>
              <span className="text-[#2CA4B5]">MessMate</span>
            </motion.h2>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="md:w-1/3 hidden md:block"
              >
                <img
                  src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746796496/13185007-5135868-681dff0240259-681dffab0a8a2_vvobkp.webp"
                  alt="Messmate - Customer Support"
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              </motion.div>

              {/* Right Contact Info Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="md:w-2/3"
              >
                <div className="bg-white border-l-4 border-[#2CA4B5] rounded-lg p-8 ">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    We are here to assist you! Reach out to us for inquiries,
                    feedback, or support. Our team is dedicated to providing the
                    best possible service.
                  </p>
                  <div className="space-y-4">
                    {[
                      { label: "Email", value: "messmatecompany@gmail.com" },
                      { label: "Phone", value: "+91-7479170108" },
                      {
                        label: "Address",
                        value:
                          "Messmate, Haringhata, Kalyani, West Bengal, India",
                      },
                    ].map((contact, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-[#2CA4B5]/10 p-2 rounded-full mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#2CA4B5]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={
                                index === 0
                                  ? "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  : index === 1
                                  ? "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  : "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              }
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {contact.label}:
                          </p>
                          <p className="text-gray-600">{contact.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex space-x-4">
                    {["instagram", "facebook", "linkedin"].map(
                      (social, index) => (
                        <motion.a
                          key={index}
                          href="#"
                          whileHover={{ y: -5 }}
                          className="bg-[#2CA4B5] text-white p-3 rounded-full hover:bg-teal-600 transition-colors duration-300"
                          aria-label={social}
                        >
                          <img
                            src={socialIcons[social] || "/placeholder.svg"}
                            alt={social}
                            className="h-5 w-5"
                            loading="lazy"
                          />
                        </motion.a>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
