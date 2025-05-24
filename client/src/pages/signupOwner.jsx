"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { signupownerUrl } from "../constant/urls";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import { baseurl } from "../constant/urls";
import {
  MapPin,
  Eye,
  EyeOff,
  Snowflake,
  Tv,
  Power,
  Wifi,
  UtensilsCrossed,
  Droplets,
  Bed,
  Plus,
  Minus,
  Upload,
  X,
  ArrowLeft,
  Shield,
  ScrollText,
  Calendar,
  User,
  Mail,
  Home,
  Phone,
  Lock,
  MapPinned,
  Building,
  Info,
} from "lucide-react";

function SignupOwner() {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [imgArray, setImgArray] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [canResend, setCanResend] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const maxLength = 10;

  // New state for the additional fields
  const [rules, setRules] = useState([]);

  const amenities = [
    { id: "test1", label: "A/C", icon: Snowflake },
    { id: "test2", label: "TV", icon: Tv },
    { id: "test3", label: "Power Backup", icon: Power },
    { id: "test4", label: "WiFi", icon: Wifi },
    { id: "test5", label: "Kitchen", icon: UtensilsCrossed },
    { id: "test6", label: "Tank Water", icon: Droplets },
    { id: "test7", label: "Double Bed", icon: Bed },
  ];

  const predefinedRules = [
    "No alcohol consumption on premises",
    "No smoking inside rooms or common areas",
    "Return to PG before 10:00 PM",
    "No opposite gender visitors in rooms",
    "Maintain silence after 11:00 PM",
    "No loud music or parties without permission",
    "Keep rooms and common areas clean",
    "No cooking in bedrooms",
    "Conserve electricity and water",
    "No pets allowed",
    "No alteration to room structure or furniture",
    "Guests must be registered at reception",
    "Monthly rent to be paid before 5th of every month",
    "Laundry only in designated areas",
    "No illegal activities on premises",
    "Garbage must be disposed in designated bins",
    "Common kitchen to be cleaned after use",
    "No sticking posters on walls",
    "Parking only in designated areas",
    "Respect other residents' privacy",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    password: "",
    pincode: "",
    mobileNo: "",
    messName: "",
    aboutMess: "",
    location: {
      type: "Point",
      coordinates: [], // [longitude, latitude]
    },
    profilePhoto: null,
    messPhoto: [],
    facility: [],
    gender: "", // Add gender field (Girls, Boys, Coed)
    roomInfo: [
      {
        room: "RoomNo-1",
        bedContains: "",
        pricePerHead: "",
        roomAvailable: true,
      },
    ],
    // New fields
    minimumSecurityDeposit: 0,
    rulesToStay: [],
    minimumBookingDuration: "1 Month",
  });

  const sendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      setIsSendingOtp(true);
      setOtpError("");

      // In a real app, this would call your backend API
      const response = await axios.post(`${baseurl}/auth/send-otp`, {
        email: formData.email,
      });

      //  For demo, we'll simulate success
      setShowOtp(true);
      setOtpExpiry(Date.now() + 300000); // 5 minutes from now
      setCanResend(false);
      setTimeout(() => setCanResend(true), 30000); // 30 second cooldown
      setTimeLeft(300); // 5 minutes in seconds

      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setOtpError("Please enter a 4-digit OTP");
      return;
    }

    if (otpExpiry && Date.now() > otpExpiry) {
      setOtpError("OTP has expired. Please request a new one.");
      return;
    }

    try {
      setIsVerifyingOtp(true);

      // In a real app, this would call your backend API
      const response = await axios.post(`${baseurl}/auth/verify-otp`, {
        email: formData.email,
        otp: enteredOtp,
      });

      // For demo, we'll simulate success
      setIsEmailVerified(true);
      setShowOtp(false);
      toast.success("Email verified successfully");
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  useEffect(() => {
    let interval;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    document.title = "PG Owner Signup | Mess Mate";
  }, []);

  const mapMake = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Fetch address from Google Maps API (optional, if you need to display it later)
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_MAPS_API_KEY}`
            );
            const data = await response.json();

            const address =
              data.results[0]?.formatted_address || `${latitude}, ${longitude}`;

            // Update location with coordinates (longitude, latitude) and optional address
            setFormData((prevData) => ({
              ...prevData,
              location: {
                type: "Point",
                coordinates: [longitude, latitude], // Storing the coordinates as [longitude, latitude]
                // address: address, // Optional: store address if you want to display it later
              },
            }));

            toast.success("Location updated successfully");
          } catch (error) {
            console.error("Error fetching location:", error);
            toast.error("Error fetching location. Please try again.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to retrieve your location. Please try again.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loadfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      setImage(file);
    }
  };

  const handleFacilityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      // Make sure we're working with an array (defensive programming)
      const currentFacilities = Array.isArray(prevData.facility)
        ? [...prevData.facility]
        : [];

      if (checked) {
        // Add the value if it's not already present
        if (!currentFacilities.includes(value)) {
          currentFacilities.push(value);
        }
      } else {
        // Remove the value if it exists
        const index = currentFacilities.indexOf(value);
        if (index !== -1) {
          currentFacilities.splice(index, 1);
        }
      }

      return { ...prevData, facility: currentFacilities };
    });
  };

  const handleRoomChange = (index, e) => {
    const updatedRooms = formData.roomInfo.map((room, i) => {
      if (i === index) {
        return {
          ...room,
          [e.target.name]: e.target.value,
        };
      }
      return room;
    });

    setFormData({
      ...formData,
      roomInfo: updatedRooms,
    });
  };

  const addRoom = () => {
    const newRoom = {
      room: `RoomNo-${formData.roomInfo.length + 1}`, // Ensure proper room number
      bedContains: "",
      pricePerHead: "",
      roomAvailable: true,
    };

    setFormData({
      ...formData,
      roomInfo: [...formData.roomInfo, newRoom],
    });
  };

  const removeRoom = (index) => {
    const updatedRooms = formData.roomInfo
      .filter((_, i) => i !== index)
      .map((room, i) => ({
        ...room,
        room: `RoomNo-${i + 1}`, // Reassign room numbers
      }));
    setFormData({
      ...formData,
      roomInfo: updatedRooms,
    });
  };

  const removeImage = (index) => {
    setImgArray((prevArray) => prevArray.filter((_, i) => i !== index));
    setFormData((prevFormData) => ({
      ...prevFormData,
      messPhoto: prevFormData.messPhoto.filter((_, i) => i !== index),
    }));
    setErrorMessage("");
  };

  const imgUpload = (event) => {
    const filesArr = Array.from(event.target.files);
    const newMessPhotos = [];
    if (imgArray.length + filesArr.length > maxLength) {
      setErrorMessage(`You can only upload up to ${maxLength} images.`);
      toast.error(`You can only upload up to ${maxLength} images.`);
      return;
    }
    filesArr.forEach((file) => {
      if (!file.type.match("image.*")) {
        setErrorMessage("Only image files are allowed.");
        toast.error("Only image files are allowed.");
        return;
      }
      if (imgArray.length >= maxLength) {
        setErrorMessage("Maximum number of images reached.");
        toast.error("Maximum number of images reached.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImgArray((prevArray) => [
          ...prevArray,
          { src: reader.result, name: file.name },
        ]);
      };
      reader.readAsDataURL(file);
      newMessPhotos.push(file);
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      messPhoto: [...prevFormData.messPhoto, ...newMessPhotos],
    }));
  };

  const handleVerifyEmail = () => {
    setShowOtp(true);
  };

  const handleOtpSubmit = () => {
    if (otp.join("") === "1234") {
      setIsEmailVerified(true);
      setShowOtp(false);
    } else {
      alert("Invalid OTP");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      }
    }
  };

  const handleRuleChange = (index, value) => {
    let newRules = rules;

    // If first field and has commas, split and replace only that index's value
    if (value.includes(",")) {
      const splitRules = value
        .split(",")
        .map((rule) => rule.trim())
        .filter((rule) => rule !== "");

      // Replace current index with first rule and add the rest after it
      newRules.splice(index, 1, ...splitRules);
    } else {
      newRules[index] = value;
    }

    const filteredRules = newRules.filter((rule) => rule.trim() !== "");

    setRules(filteredRules);
    setFormData({
      ...formData,
      rulesToStay: filteredRules,
    });
  };

  const addRule = () => {
    setRules([...rules, ""]);
  };

  // const removeRule = (index) => {
  //   const newRules = [...rules];
  //   newRules.splice(index, 1);
  //   setRules(newRules);

  //   setFormData({
  //     ...formData,
  //     rulesToStay: newRules.filter((rule) => rule.trim() !== ""),
  //   });
  // };
  const removeRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
    setFormData({
      ...formData,
      rulesToStay: newRules.filter((rule) => rule.trim() !== ""),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormComplete()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      setIsSubmitting(true); // Set loading state
      const formDataToSend = new FormData();

      // Update rulesToStay in formData before sending
      formData.rulesToStay = rules.filter((rule) => rule.trim() !== "");

      for (const key in formData) {
        if (key === "messPhoto") {
          formData.messPhoto.forEach((file) =>
            formDataToSend.append(key, file)
          );
        } else if (key === "roomInfo" || key === "location") {
          // Stringify arrays and objects to send them as JSON strings
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      const response = await axios.post(signupownerUrl, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        // console.log("Response:", response.data);

        const a = "Please verify your email to log in";
        localStorage.setItem("loginMessageOwner", a);
        navigate("/login/owner", { state: { message: a } });
      } else {
        console.error("Signup failed:", response.data);
      }
    } catch (error) {
      if (error.response) {
        const res = error.response;
        if (res.data.message) {
          return toast.error(res.data.message);
        } else if (res.data.errors) {
          return toast.error(res.data.errors.join(", "));
        }
      }
      toast.error("Error creating user. Please try again.");
      console.error(
        "Error creating user:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);
    }
  };

  const toggleEye = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isFormComplete = () => {
    return (
      formData.mobileNo &&
      formData.address &&
      formData.email &&
      formData.firstName &&
      formData.lastName &&
      formData.pincode &&
      formData.messName &&
      formData.aboutMess &&
      formData.profilePhoto &&
      formData.messPhoto.length > 0 &&
      formData.location &&
      formData.location.type === "Point" &&
      Array.isArray(formData.location.coordinates) &&
      formData.location.coordinates.length === 2 &&
      formData.password &&
      formData.roomInfo.every(
        (room) =>
          room.room &&
          room.bedContains &&
          room.pricePerHead &&
          room.roomAvailable
      ) &&
      formData.gender &&
      // New fields validation
      formData.minimumSecurityDeposit !== undefined &&
      formData.minimumBookingDuration &&
      isEmailVerified
    );
  };

  return (
    <div className="bg-owner-gradient min-h-screen">
      <Helmet>
        <title>
          PG/Mess Owner Registration | Mess Mate - List Your PG/Hostel
        </title>
        <meta
          name="description"
          content="Register your PG or hostel with Mess Mate. Reach thousands of students looking for quality accommodation. List your mess details, facilities, and room information."
        />
        <meta
          name="keywords"
          content="PG registration, hostel registration, mess owner signup, student accommodation, list your PG"
        />
        <meta
          property="og:title"
          content="Mess Owner Registration | Mess Mate"
        />
        <meta
          property="og:description"
          content="Join Mess Mate as a partner and manage your PG/hostel listings effectively"
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://yourdomain.com/signup/owner" />

        {/* Performance Hints */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </Helmet>

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
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#2ca4b5]">
                Sign Up
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Owner Registration
              </p>
            </div>
          </div>
        </header>

        <form
          className=" p-4 sm:p-6 md:p-8"
          onSubmit={handleSubmit}
          method="POST"
          encType="multipart/form-data"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-[#2ca4b5]" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      autoComplete="off"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* otp */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-full px-4 py-2.5 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                    placeholder="your.email@example.com"
                    required
                    disabled={isEmailVerified}
                  />

                  {/* VERIFY BUTTON OR VERIFIED TEXT */}
                  {!isEmailVerified ? (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={isSendingOtp || !formData.email}
                      style={{
                        borderTopLeftRadius: "0",
                        borderBottomLeftRadius: "0",
                        borderTopRightRadius: "9999px",
                        borderBottomRightRadius: "9999px",
                      }}
                      className={`px-4 py-2 absolute right-1 top-[50%] transform -translate-y-1/2 ${
                        isSendingOtp || !formData.email
                          ? "bg-primary-default cursor-not-allowed text-white"
                          : "bg-primary-default hover:bg-primary-dark text-white"
                      }`}
                    >
                      {isSendingOtp ? "Sending..." : "Verify"}
                    </button>
                  ) : (
                    <span className="text-green-600 absolute right-1 top-[50%] transform -translate-y-1/2">
                      Verified
                    </span>
                  )}

                  {/* OTP SECTION */}
                  {showOtp && !isEmailVerified && (
                    <div className="mt-4 space-y-2">
                      <div className="flex gap-3 justify-center">
                        {[0, 1, 2, 3].map((i) => (
                          <input
                            key={i}
                            id={`otp-${i}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength="1"
                            value={otp[i] || ""}
                            onChange={(e) => handleOtpChange(e, i)}
                            onKeyDown={(e) => handleOtpKeyDown(e, i)}
                            className="w-14 h-14 text-center text-xl rounded-xl border border-primary-light focus:outline-none focus:ring-2 focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                            aria-label={`Digit ${i + 1} of OTP`}
                            disabled={isVerifyingOtp}
                          />
                        ))}
                      </div>

                      {otpError && (
                        <p className="text-red-500 text-sm text-center">
                          {otpError}
                        </p>
                      )}

                      <div className="flex justify-center gap-4 mt-2">
                        <button
                          type="button"
                          onClick={verifyOtp}
                          disabled={isVerifyingOtp || otp.join("").length !== 4}
                          className={`px-4 py-2 rounded-full ${
                            isVerifyingOtp || otp.join("").length !== 4
                              ? "bg-primary-default cursor-not-allowed text-white"
                              : "bg-primary-default hover:bg-primary-dark text-white"
                          }`}
                        >
                          {isVerifyingOtp ? "Verifying..." : "Submit OTP"}
                        </button>

                        <button
                          type="button"
                          onClick={sendOtp}
                          disabled={!canResend || isSendingOtp}
                          className="text-primary-default hover:text-primary-dark underline text-sm"
                        >
                          Resend OTP
                        </button>
                      </div>

                      {/* TIMER BELOW RESEND */}
                      {!canResend && (
                        <p className="text-sm text-gray-500 text-center">
                          Resend OTP in {Math.floor(timeLeft / 60)}:
                          {(timeLeft % 60).toString().padStart(2, "0")}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mobileNo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <Phone className="h-4 w-4 inline mr-1" />
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="mobileNo"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                    placeholder="Your mobile number"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <Home className="h-4 w-4 inline mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  placeholder="Enter your full address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                    placeholder="Enter pincode"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <Lock className="h-4 w-4 inline mr-1" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleEye}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  <MapPinned className="h-4 w-4 inline mr-1" />
                  Location
                </label>
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Click the map icon to get your location"
                    value={
                      formData.location.coordinates.length === 2
                        ? `${formData.location.coordinates[1]}, ${formData.location.coordinates[0]}`
                        : ""
                    }
                    readOnly
                    className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  />
                  <button
                    type="button"
                    onClick={mapMake}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-primary-light text-primary-dark hover:bg-primary-default transition-colors"
                    aria-label="Get current location"
                  >
                    <MapPin className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Photo */}
            <div className="flex flex-col items-center justify-start">
              <h2 className="text-xl font-semibold mb-4 ">House Photo</h2>
              <label htmlFor="file" className="cursor-pointer">
                <div className="mb-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    name="profilePhoto"
                    id="file"
                    onChange={loadfile}
                    className="hidden"
                  />
                  {image ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt="Profile"
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover mx-auto border-4 border-[#2ca4b5]"
                      />
                      <div className="absolute bottom-2 right-2 bg-[#2ca4b5] rounded-full p-2 shadow-md">
                        <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-primary-light mx-auto flex items-center justify-center border-2 border-dashed border-primary-default hover:border-primary-dark transition-colors">
                      <div className="text-center">
                        <Upload className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-[#2ca4b5]" />
                      </div>
                    </div>
                  )}
                </div>
              </label>
              <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
                Upload a photo of your house
              </p>
            </div>
          </div>

          {/* Property Information */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Building className="h-5 w-5 mr-2 text-[#2ca4b5]" />
              Property Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="messName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PG/Mess Name
                </label>
                <input
                  type="text"
                  id="messName"
                  name="messName"
                  value={formData.messName}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  placeholder="Enter your PG/Mess name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PG Type
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  required
                >
                  <option value="">Select PG Type</option>
                  <option value="Girls Pg">Girls PG</option>
                  <option value="Boys Pg">Boys PG</option>
                  <option value="Coed Pg">Co-ed PG</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="aboutMess"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Info className="h-4 w-4 inline mr-1" />
                About Your PG/Mess
              </label>
              <textarea
                id="aboutMess"
                name="aboutMess"
                value={formData.aboutMess}
                onChange={handleChange}
                className="w-full rounded-2xl px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                placeholder="Describe your PG/Mess, its unique features, and surroundings"
                rows="4"
                required
              ></textarea>
            </div>

            {/* New Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label
                  htmlFor="minimumSecurityDeposit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <Shield className="h-4 w-4 inline mr-1" />
                  Minimum Security Deposit
                </label>
                <select
                  id="minimumSecurityDeposit"
                  name="minimumSecurityDeposit"
                  value={formData.minimumSecurityDeposit}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  required
                >
                  <option value="0">No Deposit (0 months rent)</option>
                  <option value="1">1 Month Rent</option>
                  <option value="2">2 Months Rent</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="minimumBookingDuration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Minimum Booking Duration
                </label>
                <select
                  id="minimumBookingDuration"
                  name="minimumBookingDuration"
                  value={formData.minimumBookingDuration}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-2.5  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  required
                >
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 months">1 Year</option>
                </select>
              </div>
            </div>

            {/* Rules to Stay */}
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  <ScrollText className="h-4 w-4 inline mr-1" />
                  Rules to Stay
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="text-sm rounded-full focus:outline-none focus:ring focus:ring-[#2ca4b5] px-3 py-1.5 w-full sm:w-auto bg-[#116e7b1a]"
                    // onChange={(e) => {
                    //   if (e.target.value) {
                    //     setRules([...rules, e.target.value])
                    //     // Reset the select after adding
                    //     e.target.value = ""

                    //     // Update formData with non-empty rules
                    //     setFormData({
                    //       ...formData,
                    //       rulesToStay: [...rules, e.target.value].filter((rule) => rule.trim() !== ""),
                    //     })
                    //   }
                    // }}
                    onChange={(e) => {
                      const selected = e.target.value.trim();
                      if (selected && !rules.includes(selected)) {
                        const updatedRules = [...rules, selected];
                        setRules(updatedRules);
                        setFormData({
                          ...formData,
                          rulesToStay: updatedRules.filter(
                            (rule) => rule.trim() !== ""
                          ),
                        });
                      }
                      e.target.value = "";
                    }}
                  >
                    <option value="">Add predefined rule</option>
                    {predefinedRules.map((rule, idx) => (
                      <option key={idx} value={rule}>
                        {rule}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addRule}
                    className="text-[#2ca4b5] hover:text-teal-700 flex items-center text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Custom Rule
                  </button>
                </div>
              </div>

              {rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    className="flex-1 rounded-full px-4 py-2  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a] "
                    placeholder={`Rule ${index + 1}`}
                  />
                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-1">
                Add house rules that guests must follow during their stay
              </p>
            </div>
          </div>

          {/* Facilities */}
          <div className="mt-10 pt-6  border-t border-primary-light">
            <h2 className="text-xl font-semibold mb-4">Available Facilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={amenity.id}
                    value={amenity.label}
                    checked={formData.facility.includes(amenity.label)}
                    onChange={handleFacilityChange}
                    className="h-4 w-4 text-[#2ca4b5] focus:ring-[#2ca4b5] border-gray-300 rounded"
                  />
                  <label
                    htmlFor={amenity.id}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <amenity.icon className="h-4 w-4 text-[#2ca4b5] mr-1.5" />
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Room Information */}
          <div className="mt-10 pt-6 border-t border-primary-light">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-xl font-semibold">Room Information</h2>
              <button
                type="button"
                onClick={addRoom}
                className="flex items-center px-4 py-2 bg-[#2ca4b5] text-white rounded-full hover:bg-primary-dark transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Room
              </button>
            </div>

            <div className="space-y-6">
              {formData.roomInfo.map((room, index) => (
                <div
                  key={index}
                  className=" rounded-2xl p-4 border border-primary-light hover:border-primary-dark transition-colors"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">
                      Room #{index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeRoom(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={formData.roomInfo.length === 1}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bed Capacity
                      </label>
                      <select
                        name="bedContains"
                        value={room.bedContains}
                        onChange={(e) => handleRoomChange(index, e)}
                        className="w-full rounded-full px-3 py-2  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                        required
                      >
                        <option value="">Select Capacity</option>
                        <option value="one">Single (1 Bed)</option>
                        <option value="two">Double (2 Beds)</option>
                        <option value="three">Triple (3 Beds)</option>
                        <option value="four">Quad (4 Beds)</option>
                        <option value="five">Five Beds</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Per Head (₹)
                      </label>
                      <input
                        type="number"
                        name="pricePerHead"
                        value={room.pricePerHead}
                        onChange={(e) => handleRoomChange(index, e)}
                        className="w-full rounded-full px-3 py-2  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                        placeholder="Enter price"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <select
                        name="roomAvailable"
                        value={room.roomAvailable}
                        onChange={(e) => handleRoomChange(index, e)}
                        className="w-full rounded-full px-3 py-2  focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                        required
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mess Photos */}
          <div className="mt-10 pt-6 border-t border-primary-light">
            <h2 className="text-xl font-semibold mb-4">Property Photos</h2>

            <input
              type="file"
              accept="image/*"
              name="messPhotos"
              onChange={imgUpload}
              multiple
              className="hidden"
              id="fileInput"
            />

            {imgArray.length === 0 ? (
              <div
                onClick={() => document.getElementById("fileInput").click()}
                className="border-2 border-dashed border-primary-light rounded-2xl p-8 text-center cursor-pointer hover:border-primary-dark transition-colors"
              >
                <Upload className="h-10 w-10 mx-auto text-[#2ca4b5] mb-2" />
                <p className="text-gray-700 font-medium">
                  Upload Property Photos
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Click to browse or drag and drop (max {maxLength} images)
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {imgArray.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.src || "/placeholder.svg"}
                        alt={img.name}
                        className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-75 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {imgArray.length < maxLength && (
                    <div
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                      className="w-full h-24 sm:h-28 md:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#2ca4b5] transition-colors"
                    >
                      <div className="text-center">
                        <Plus className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-[#2ca4b5]" />
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Add More
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
              </div>
            )}
          </div>

          {/* Terms and Submit */}
          <div className="mt-10 pt-6 border-t border-primary-light">
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="h-4 w-4 text-[#2ca4b5] focus:ring-[#2ca4b5] border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-[#2ca4b5] hover:text-teal-700"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-[#2ca4b5] hover:text-teal-700"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || !isFormComplete() || !termsAccepted}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-white font-medium w-full sm:w-3/4 md:w-1/2 flex items-center justify-center ${
                  isSubmitting || !isFormComplete() || !termsAccepted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2ca4b5] hover:bg-teal-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                    Creating Account...
                  </>
                ) : (
                  "Create Owner Account"
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-sm font-medium text-gray-700">
              Already have an account?{" "}
              <Link
                to="/login/owner"
                className="text-[#2ca4b5] hover:text-primary-dark"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupOwner;
