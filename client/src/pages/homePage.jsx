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
import { LocationIqurl } from "../constant/urls";
import Recommendations from "../components/Recommendations";

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
  const {
    userName,
    IsAuthenticated,
    handleLogout,
    logoutSuccess,
    isOwnerAuthenticated,
    ownerName,
  } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [nearbyMesses, setNearbyMesses] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    document.title = "MessMate - Find your nearest paying guest";
  }, []);

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

  const handleSuggestionClick = (suggestion) => {
    setSearchItem(suggestion.display_name);
    setSelectedLocation({
      lat: suggestion.lat,
      lng: suggestion.lng,
    });
    const coords = { lat: suggestion.lat, lng: suggestion.lon };

    setSuggestions([]);

    // navigate(
    //   `/MessFind?userLocation=${encodeURIComponent(
    //     JSON.stringify(coords)
    //   )}&item=${encodeURIComponent(suggestion.display_name)}`
    // );
    navigate(
      `/MessFind/${encodeURIComponent(
        suggestion.display_name
      )}/${encodeURIComponent(JSON.stringify(coords))}`
    );
  };

  const performSearch = () => {
    if (!selectedLocation) {
      toast.error("Please select a location from the suggestions!");
      return;
    }

    // navigate("/MessFind", {
    //   state: { userLocation: selectedLocation, item: searchItem },
    // });
    navigate(
      `/MessFind/${encodeURIComponent(searchItem)}/${encodeURIComponent(
        JSON.stringify(selectedLocation)
      )}`
    );

    setSearchItem("");
  };

  const handleCityClick = (cityName, coords) => {
    setSearchItem(cityName);
    setSelectedLocation(coords);
    // navigate("/MessFind", {
    //   state: { userLocation: coords, item: cityName },
    // });
    navigate(
      `/MessFind/${encodeURIComponent(cityName)}/${encodeURIComponent(
        JSON.stringify(coords)
      )}`
    );
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
      console.error("Token is not present in cookies");
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

        navigate(
          `/MessFind/you/${encodeURIComponent(
            JSON.stringify({ lat: latitude, lng: longitude })
          )}`
        );

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

  // const nearMe = () => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const { latitude, longitude } = position.coords;
  //     setPersonalInfo((prev) => ({
  //       ...prev,
  //       location: {
  //         type: "Point",
  //         coordinates: [longitude, latitude],
  //       },
  //     }));
  //     setIsLocationChanged(true);
  //   });
  // };

  return (
    <div className="font-sans bg-white">
      {/* Gradient Background with Overlay */}
      <div className="relative">
        {/* Header Section */}
        <header className="sticky top-0 w-full z-50 bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <img
                src="./assets/companylogo.png"
                alt="MessMate Logo"
                className="h-10"
              />
              <div className="text-2xl font-bold bg-gradient-to-r from-[#2CA4B5] to-teal-600 bg-clip-text text-transparent">
                MessMate
              </div>
            </div>

            <nav className="hidden lg:flex space-x-8">
              {["Home", "About", "Service", "Contact us"].map((item) => (
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="imageProfile cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <UserProfile className="h-12 w-12 ring-2 ring-[#2CA4B5] rounded-full" />
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
                              ? "/newDashboard"
                              : "/DashboardOwner"
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
              >
                <Link to="/choose-role">House Owner / Student</Link>
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
              className="fixed top-0 right-0 w-64 h-full bg-white z-50 shadow-2xl rounded-l-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Close menu"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <nav className="flex-1 px-6 py-4">
                  <motion.div
                    variants={staggerChildren}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {["Home", "About", "Services", "Contact Us"].map(
                      (item, index) => (
                        <motion.div key={index} variants={fadeInUp}>
                          <Link
                            to={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                            className="block text-lg font-medium text-gray-800 hover:text-[#2CA4B5] transition duration-300"
                            onClick={(e) => {
                              handleScroll(
                                e,
                                item.toLowerCase().replace(/\s+/g, "")
                              );
                              setMenuOpen(false);
                            }}
                          >
                            {item}
                          </Link>
                        </motion.div>
                      )
                    )}
                    <motion.div variants={fadeInUp}>
                      <Link
                        to="/choose-role"
                        className="block text-lg font-medium text-[#2CA4B5] hover:text-teal-700 transition duration-300"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                  </motion.div>
                </nav>
              </div>
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
          toastClassName="!w-[300px] mx-auto mt-4 sm:mt-0"
        />

        {/* Hero Section */}
        <section
          id="home"
          className="relative bg-gradient-to-br from-[#2CA4B5] via-[#4db6c5] to-[#7fd4e1] py-10 lg:py-32 overflow-hidden"
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
                <div className="mt-8 relative" ref={searchContainerRef}>
                  <div
                    className={`flex border-3 rounded-full border-white transition-all duration-300 ${
                      isSearchFocused ? "ring-4 ring-white/30" : ""
                    }`}
                  >
                    <div className="absolute left-4 top-4 text-gray-400">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search city or University"
                      className="w-full py-4 px-12 rounded-full shadow-lg flex-1 outline-none bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
                      value={searchItem}
                      onChange={handleInputChange}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute top-2 right-3 h-10 w-10 text-white bg-[#2CA4B5] rounded-full flex items-center justify-center shadow-md"
                      onClick={(e) => {
                        if (suggestions.length > 0) {
                          handleSuggestionClick(suggestions[0]);
                        } else {
                          toast.error("Pick a valid location from suggestions");
                        }
                      }}
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

                  {/* Suggestions Dropdown - Moved outside the input container */}
                  {/* <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute w-full mt-2 z-[9999] bg-white shadow-xl rounded-lg overflow-hidden"
                      >
                        {suggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            whileHover={{
                              backgroundColor: "#2CA4B5",
                              color: "white",
                            }}
                            className="p-3 cursor-pointer hover:bg-[#2CA4B5] hover:text-white transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="truncate">
                                {suggestion.display_name}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence> */}
                </div>
                <div className="mt-4 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFindNearMe}
                    disabled={isLocating}
                    className="flex items-center justify-center gap-2 bg-white text-[#2CA4B5] px-6 py-3 rounded-full font-medium shadow-md hover:bg-[#2CA4B5] hover:text-white transition-colors duration-300 disabled:opacity-70"
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Find Near Me
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
                className="max-w-sm lg:max-w-md relative"
              >
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
                <img
                  src="assets/vecteezy_home-png-with-ai-generated_33504402 1.png"
                  alt="House"
                  className="relative z-10 rounded-lg transform hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="py-10 bg-gradient-to-b from-[#e6f7fa] to-white relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-10 md:grid-cols-3 text-center"
          >
            {[
              {
                img: "./assets/online-booking 1.png",
                title: "Quick and easy bookings",
                desc: "Secure your room in no time with hassle-free instant booking",
              },
              {
                img: "./assets/choice 1.png",
                title: "The widest choice",
                desc: "Browse verified, affordable student rooms close to university",
              },
              {
                img: "./assets/support 1.png",
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
                img: "assets/kolkata.png",
                coords: { lat: 22.5726, lng: 88.3639 },
                properties: 263,
              },
              {
                name: "Bankura",
                img: "assets/bankura.png",
                coords: { lat: 23.2324, lng: 87.0712 },
                properties: 263,
              },
              {
                name: "West Medinipur",
                img: "assets/westMed.png",
                coords: { lat: 22.4211, lng: 87.3216 },
                properties: 263,
              },
              {
                name: "Jhargram",
                img: "assets/jhargram.png",
                coords: { lat: 22.4526, lng: 86.9946 },
                properties: 263,
              },
              {
                name: "Bardhaman",
                img: "assets/bardhaman.png",
                coords: { lat: 23.2333, lng: 87.8667 },
                properties: 263,
              },
              {
                name: "Kalyani",
                img: "assets/kalyani.png",
                coords: { lat: 22.9756, lng: 88.4345 },
                properties: 263,
              },
              {
                name: "Durgapur",
                img: "assets/durgapur.png",
                coords: { lat: 23.5204, lng: 87.3119 },
                properties: 263,
              },
              {
                name: "Asansole",
                img: "assets/asansole.png",
                coords: { lat: 23.6739, lng: 86.9524 },
                properties: 263,
              },
              {
                name: "Bolpur",
                img: "assets/bolpur.png",
                coords: { lat: 23.6688, lng: 87.6836 },
                properties: 263,
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
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="font-medium">View properties</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#2CA4B5] group-hover:text-teal-700 transition-colors duration-300">
                      {city.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {city.properties} properties
                    </p>
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
                simplifying the lives of college students. At MessMate, we
                believe that finding a comfortable and affordable place to live
                shouldn't be a hassle, especially for students starting a new
                chapter away from home.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-white text-gray-800 px-6 py-3 border-2 border-[#2CA4B5] hover:bg-[#2CA4B5] hover:text-white font-semibold text-sm transition-all duration-300 flex items-center"
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
                    { color: "bg-orange-500", text: "Download the app." },
                    {
                      color: "bg-yellow-500",
                      text: "Search for accommodation or services.",
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
                  src="assets/gettyimages-1029403636-2048x2048 1.png"
                  alt="Business Meeting"
                  className="relative rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-full"
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
                src="assets/kolkata.png"
                alt="Customer Support"
                className="w-full h-auto rounded-lg shadow-lg"
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
              <div className="bg-white border-l-4 border-[#2CA4B5] rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  We are here to assist you! Reach out to us for inquiries,
                  feedback, or support. Our team is dedicated to providing the
                  best possible service.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Email", value: "info@messmate.com" },
                    { label: "Phone", value: "+91-XXXXXXXXXX" },
                    {
                      label: "Address",
                      value: "MessMate Pvt. Ltd., Chaitali Ray, khabar kolkata",
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
                  {["facebook", "twitter", "instagram"].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ y: -5 }}
                      className="bg-[#2CA4B5] text-white p-3 rounded-full hover:bg-teal-600 transition-colors duration-300"
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
                          d={
                            social === "facebook"
                              ? "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                              : social === "twitter"
                              ? "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                              : "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 7.5h9m-9 9h9M3 3h18v18H3z"
                          }
                        />
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
