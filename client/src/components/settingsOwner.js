import React, { useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Plus, Minus, ScrollText } from "lucide-react";
import {
  updateDetailsUrl,
  updatePasswordDashboardOwner,
} from "../constant/urls";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const input =
  "border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-text-bg bg-clip-text text-transparent";

const SettingsOwner = ({ userDetails, loginMethod }) => {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    mobileNo: "",
    address: "",
    pincode: "",
    messName: "",
    location: { type: "Point", coordinates: [] },
    aboutMess: "",
    gender: "",
    facility: [],
    roomInfo: [], // not an object
    profilePhoto: null,
    messPhoto: [],
    rulesToStay: [], // Initialize as empty array
    minimumSecurityDeposit: 0,
    minimumBookingDuration: "1 Month",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [rules, setRules] = useState([]);
  const [customRuleInput, setCustomRuleInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength((strength / 4) * 100);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      calculatePasswordStrength(value);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("All fields are required");
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const response = await fetch(updatePasswordDashboardOwner, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: userDetails._id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(response.error.data.message || "Failed to update password");
        throw new Error(data.error || "Failed to update password");
      }

      setPasswordSuccess(true);
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
      setPasswordError(err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  // Add profile photo handling functions
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDetails((prev) => ({
        ...prev,
        profilePhoto: file,
      }));
    }
  };

  const removeProfilePhoto = () => {
    setDetails((prev) => ({
      ...prev,
      profilePhoto: null,
    }));
  };
  useEffect(() => {
    if (userDetails) {
      setDetails((prev) => ({
        ...prev,
        name: userDetails?.firstName + " " + userDetails?.lastName || "",
        email: userDetails?.email || "",
        mobileNo: userDetails?.mobileNo || "",
        address: userDetails?.address || "",
        pincode: userDetails?.pincode || "",
        messName: userDetails?.messName || "",
        location: userDetails?.location || { type: "Point", coordinates: [] },
        aboutMess: userDetails?.aboutMess || "",
        gender: userDetails?.gender || "",
        facility: Array.isArray(userDetails?.facility)
          ? userDetails.facility
          : [],

        roomInfo: Array.isArray(userDetails?.roomInfo)
          ? userDetails.roomInfo
          : [],
        profilePhoto: userDetails.profilePhoto || null,
        messPhoto: userDetails?.messPhoto || [],
        rulesToStay: Array.isArray(userDetails?.rulesToStay)
          ? userDetails.rulesToStay
          : [],
        minimumSecurityDeposit: userDetails?.minimumSecurityDeposit || 0,
        minimumBookingDuration:
          userDetails?.minimumBookingDuration || "1 Month",
      }));
    }
  }, [userDetails]);
  // console.log(details);
  // Inside your component
  const renumberRooms = (rooms) => {
    return rooms.map((room, index) => ({
      ...room,
      room: `RoomNo-${index + 1}`, // Always use current index + 1
    }));
  };
  const handleAddRoom = () => {
    setDetails((prev) => {
      const newRoom = {
        room: `RoomNo-${prev.roomInfo.length + 1}`,
        bedContains: "",
        pricePerHead: 0,
        roomAvailable: false,
      };
      return {
        ...prev,
        roomInfo: [...prev.roomInfo, newRoom],
      };
    });
  };
  const handleRemoveRoom = (indexToRemove) => {
    setDetails((prev) => {
      const newRooms = prev.roomInfo.filter(
        (_, index) => index !== indexToRemove
      );
      return {
        ...prev,
        roomInfo: renumberRooms(newRooms), // Renumber after removal
      };
    });
  };
  const handleUpdate = async () => {
    if (isUpdating) return; // guard against double-clicks
    setIsUpdating(true);
    const formData = new FormData();

    const existingUrls = details.messPhoto
      .filter((photo) => typeof photo === "string")
      .map((photo) => photo);

    const newFiles = details.messPhoto.filter((photo) => photo instanceof File);

    // Append new files
    newFiles.forEach((file) => {
      formData.append("messPhoto", file); // Field name must match multer config
    });
    if (details.profilePhoto instanceof File) {
      formData.append("profilePhoto", details.profilePhoto);
    }

    // Required identifiers
    formData.append("type", "owner");
    formData.append("userId", userDetails._id);

    // Append editable fields
    formData.append("address", details.address);
    formData.append("pincode", details.pincode);
    formData.append("mobileNo", details.mobileNo);
    formData.append("messName", details.messName);
    formData.append("aboutMess", details.aboutMess);
    formData.append("facility", details.facility.join(","));
    formData.append("location[type]", details.location.type);
    formData.append(
      "location[coordinates][0]",
      details.location.coordinates[0]
    );
    formData.append(
      "location[coordinates][1]",
      details.location.coordinates[1]
    );
    formData.append("gender", details.gender);
    formData.append("roomInfo", JSON.stringify(details.roomInfo));
    formData.append("existingPhotoUrls", JSON.stringify(existingUrls)); // this is important

    formData.append("rulesToStay", details.rulesToStay.join(","));
    formData.append("minimumSecurityDeposit", details.minimumSecurityDeposit);
    formData.append("minimumBookingDuration", details.minimumBookingDuration);

    // Optional: Append profile photo if changed
    // example: details.profilePhoto (set this if you're letting them update it)
    // formData.append("profilePhoto", details.profilePhoto);

    // Append mess photos (only newly added File objects)

    try {
      const res = await fetch(updateDetailsUrl, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Details updated successfully.");
        // alert("Updated successfully!");
        // console.log(result.data);
      } else {
        toast.error(result.error || result.message || "Update failed.");
        // alert(result.error || result.message || "Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(
        err.response?.data?.message || "An error occurred during update."
      );
      // alert("An error occurred during update.");
    } finally {
      setIsUpdating(false); // ✅ always reset the flag
    }
  };

  // Rules management functions
  const addPredefinedRule = (e) => {
    const rule = e.target.value.trim();
    if (rule && !details.rulesToStay.includes(rule)) {
      setDetails((prev) => ({
        ...prev,
        rulesToStay: [...prev.rulesToStay, rule],
      }));
    }
    e.target.value = "";
  };

  const addCustomRule = () => {
    const rule = customRuleInput.trim();
    if (rule && !details.rulesToStay.includes(rule)) {
      setDetails((prev) => ({
        ...prev,
        rulesToStay: [...prev.rulesToStay, rule],
      }));
      setCustomRuleInput("");
      setShowCustomInput(false);
    }
  };

  const updateRule = (index, newValue) => {
    const rule = newValue.trim();
    if (rule) {
      const updatedRules = [...details.rulesToStay];
      updatedRules[index] = rule;
      setDetails((prev) => ({
        ...prev,
        rulesToStay: updatedRules,
      }));
    }
  };

  const removeRule = (index) => {
    const updatedRules = details.rulesToStay.filter((_, i) => i !== index);
    setDetails((prev) => ({
      ...prev,
      rulesToStay: updatedRules,
    }));
  };
  {
    isUpdating && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="bg-white px-6 py-4 rounded-lg shadow-xl text-center animate-pulse">
          <p className="text-lg font-semibold text-gray-800">Updating…</p>
          <div className="mt-3 h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <ToastContainer
        position="top-center"
        toastClassName="!w-[300px]   mx-auto mt-4 sm:mt-0  "
      />
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={
              details.profilePhoto instanceof File
                ? URL.createObjectURL(details.profilePhoto)
                : details.profilePhoto || "/default-avatar.png"
            }
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            alt="Profile"
          />
          <label
            htmlFor="profilePhotoInput"
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <input
              type="file"
              id="profilePhotoInput"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePhotoChange}
            />
          </label>
          {details.profilePhoto && (
            <button
              type="button"
              onClick={removeProfilePhoto}
              className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
            >
              <Minus className="h-4 w-4" />
            </button>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold">Profile Photo</h2>
          <p className="text-sm text-gray-500">
            Click the + to upload a new photo
            {details.profilePhoto instanceof File && (
              <span className="text-green-600 ml-2">(New photo selected)</span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Owner Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Owner Details</h3>
          <input
            type="text"
            placeholder="Name"
            className={input}
            readOnly
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className={input}
            readOnly
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className={input}
            value={details.mobileNo}
            onChange={(e) =>
              setDetails({ ...details, mobileNo: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Address"
            className={input}
            value={details.address}
            onChange={(e) =>
              setDetails({ ...details, address: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Pincode"
            className={input}
            value={details.pincode}
            onChange={(e) =>
              setDetails({ ...details, pincode: e.target.value })
            }
          />
        </div>

        {/* Update Password */}
        {loginMethod === "local" ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Update Password</h3>

            {/* Error/Success Messages */}
            {/* {passwordError && (
      <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
        {passwordError}
      </div>
    )} */}

            {/* {passwordSuccess && (
      <div className="p-2 bg-green-100 text-green-700 rounded-md text-sm">
        Password updated successfully!
      </div>
    )} */}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                className={input}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                className={input}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={8}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={input}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />

              {/* Password Strength Meter */}
              <div>
                <label className="text-sm text-gray-500">
                  Password Strength
                </label>
                <div className="h-1 w-full bg-gray-300 rounded">
                  <div
                    className={`h-1 ${getStrengthColor()} rounded`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
                {passwordData.newPassword && (
                  <p className="text-xs mt-1 text-gray-500">
                    {passwordStrength < 30
                      ? "Weak"
                      : passwordStrength < 70
                      ? "Moderate"
                      : "Strong"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Mess Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Mess Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Mess Name"
            className={input}
            value={details.messName}
            onChange={(e) =>
              setDetails({ ...details, messName: e.target.value })
            }
          />
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Latitude, Longitude"
              className={`${input} bg-gray-100 cursor-not-allowed`}
              readOnly
              value={
                details.location?.coordinates?.length === 2
                  ? `${details.location.coordinates[1]}, ${details.location.coordinates[0]}`
                  : ""
              }
            />
            <button
              type="button"
              onClick={() => {
                if (!navigator.geolocation) {
                  alert("Geolocation is not supported by your browser.");
                  return;
                }

                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    setDetails((prev) => ({
                      ...prev,
                      location: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                      },
                    }));
                  },
                  (error) => {
                    console.error("Location error:", error);
                    // alert(
                    //   "Unable to fetch location. Please allow location access."
                    // );
                    toast.error(
                      "Unable to fetch location. Please allow location access."
                    );
                  }
                );
              }}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              title="Get Current Location"
            >
              <FaMapMarkerAlt />
            </button>
          </div>
        </div>
        <textarea
          placeholder="About Mess"
          className={input}
          value={details.aboutMess}
          onChange={(e) =>
            setDetails({ ...details, aboutMess: e.target.value })
          }
        ></textarea>
        <div className="space-x-4">
          <label>
            <input
              type="radio"
              name="pgType"
              value="Girls Pg"
              checked={details.gender === "Girls Pg"}
              onChange={(e) =>
                setDetails({ ...details, gender: e.target.value })
              }
            />{" "}
            Girls
          </label>
          <label>
            <input
              type="radio"
              name="pgType"
              value="Boys Pg"
              checked={details.gender === "Boys Pg"}
              onChange={(e) =>
                setDetails({ ...details, gender: e.target.value })
              }
            />{" "}
            Boys
          </label>
          <label>
            <input
              type="radio"
              name="pgType"
              value="Coed Pg"
              checked={details.gender === "Coed Pg"}
              onChange={(e) =>
                setDetails({ ...details, gender: e.target.value })
              }
            />{" "}
            Co-ed
          </label>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Amenities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            "A/C",
            "TV",
            "Power Backup",
            "WiFi",
            "Kitchen",
            "Tank Water",
            "Double Bed",
          ].map((item, idx) => (
            <label key={idx} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={details?.facility?.includes(item)}
                onChange={(e) => {
                  const newFacilities = e.target.checked
                    ? [...details.facility, item]
                    : details.facility.filter((f) => f !== item);

                  setDetails({
                    ...details,
                    facility: newFacilities,
                  });
                }}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Room Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Room Information</h3>

        {/* Add Room Button */}
        <button
          type="button"
          onClick={handleAddRoom}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Room
        </button>

        {Array.isArray(details.roomInfo) && details.roomInfo.length > 0 ? (
          details.roomInfo.map((room, index) => (
            <div
              key={index}
              className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 border p-4 rounded bg-white shadow-sm"
            >
              {/* Room No (readonly and auto-generated) */}
              <input
                type="text"
                placeholder="Room No."
                className={input}
                value={`RoomNo-${index + 1}`} // Always show current position
                readOnly
              />

              {/* Bed Contains */}
              <select
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 bg-white"
                value={room.bedContains}
                onChange={(e) => {
                  const updatedRooms = [...details.roomInfo];
                  updatedRooms[index].bedContains = e.target.value;
                  setDetails({ ...details, roomInfo: updatedRooms });
                }}
              >
                <option value="">Select Bed Count</option>
                <option value="one">Single</option>
                <option value="two">Double</option>
                <option value="three">Triple</option>
                <option value="four">Four</option>
                <option value="five">Five</option>
              </select>

              {/* Price per head */}
              <input
                type="number"
                placeholder="Price per head"
                className={input}
                value={room.pricePerHead}
                onChange={(e) => {
                  const updatedRooms = [...details.roomInfo];
                  updatedRooms[index].pricePerHead =
                    parseInt(e.target.value) || 0;
                  setDetails({ ...details, roomInfo: updatedRooms });
                }}
              />

              {/* Room Available */}
              <label className="inline-flex items-center space-x-2  mt-2">
                <input
                  type="checkbox"
                  checked={room.roomAvailable}
                  onChange={(e) => {
                    const updatedRooms = [...details.roomInfo];
                    updatedRooms[index].roomAvailable = e.target.checked;
                    setDetails({ ...details, roomInfo: updatedRooms });
                  }}
                />
                <span>Room Available</span>
              </label>
              {/* Remove Room Button */}
              <button
                type="button"
                onClick={() => handleRemoveRoom(index)}
                className={
                  "border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-red-600 text-white rounded hover:bg-red-700 mt-2"
                }
              >
                Remove Room
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No room data available.</p>
        )}
      </div>

      {/* Rules to Stay Section */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
          <label className="block text-sm font-medium text-gray-700">
            <ScrollText className="h-4 w-4 inline mr-1" />
            Rules to Stay
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 px-3 py-1.5 w-full sm:w-auto"
              onChange={addPredefinedRule}
            >
              <option value="">Add predefined rule</option>
              {predefinedRules.map((rule, idx) => (
                <option
                  key={idx}
                  value={rule}
                  disabled={details.rulesToStay.includes(rule)}
                >
                  {rule}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="text-teal-600 hover:text-teal-700 flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Custom Rule
            </button>
          </div>
        </div>

        {showCustomInput && (
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={customRuleInput}
              onChange={(e) => setCustomRuleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomRule()}
              className="flex-1 rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter custom rule"
              autoFocus
            />
            <button
              type="button"
              onClick={addCustomRule}
              disabled={!customRuleInput.trim()}
              className="p-2 text-teal-500 hover:text-teal-700 rounded-full hover:bg-teal-50 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-50"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        )}

        {details.rulesToStay.map((rule, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={rule}
              onChange={(e) => updateRule(index, e.target.value)}
              className="flex-1 rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder={`Rule ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeRule(index)}
              className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        ))}

        {details.rulesToStay.length === 0 && !showCustomInput && (
          <p className="text-sm text-gray-500 py-2">
            No rules added yet. Add rules to specify guest requirements.
          </p>
        )}

        <p className="text-xs text-gray-500 mt-1">
          Add house rules that guests must follow during their stay
        </p>
      </div>

      {/* Booking Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Minimum Security Deposit */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Minimum Security Deposit</h3>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2].map((value) => (
              <label
                key={value}
                className={`px-4 py-2 border rounded cursor-pointer ${
                  details.minimumSecurityDeposit === value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="securityDeposit"
                  value={value}
                  checked={details.minimumSecurityDeposit === value}
                  onChange={() =>
                    setDetails({ ...details, minimumSecurityDeposit: value })
                  }
                  className="hidden"
                />
                {value === 0 ? "None" : value === 1 ? "1 Month" : "2 Months"}
              </label>
            ))}
          </div>
        </div>

        {/* Minimum Booking Duration */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Minimum Booking Duration</h3>
          <select
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 bg-white"
            value={details.minimumBookingDuration}
            onChange={(e) =>
              setDetails({ ...details, minimumBookingDuration: e.target.value })
            }
          >
            {["1 Month", "3 Months", "6 Months", "1 Year"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mess Photos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex justify-between items-center">
          Mess Photos
          <span className="text-sm text-gray-500">
            {details.messPhoto.length}/10 uploaded
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Add Photo Box */}
          {details.messPhoto.length < 10 && (
            <div
              className="flex items-center justify-center h-24 border rounded bg-gray-100 cursor-pointer hover:bg-gray-200 relative"
              onClick={() => document.getElementById("photoInput").click()}
            >
              <span className="text-xl font-bold text-gray-600">+</span>
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const currentCount = details.messPhoto.length;

                  if (currentCount >= 10) {
                    toast.error("Maximum 10 photos allowed.");
                    e.target.value = "";
                    return;
                  }

                  const remainingSlots = 10 - currentCount;
                  const filesToAdd = files.slice(0, remainingSlots);

                  if (files.length > remainingSlots) {
                    toast.error(
                      `You can only upload ${remainingSlots} more photo${
                        remainingSlots > 1 ? "s" : ""
                      }.`
                    );
                  }

                  setDetails((prev) => ({
                    ...prev,
                    messPhoto: [...prev.messPhoto, ...filesToAdd],
                  }));

                  e.target.value = "";
                }}
              />
            </div>
          )}

          {/* Render Photos */}
          {details.messPhoto.length > 0 ? (
            details.messPhoto.map((photo, idx) => {
              const isFileObject = photo instanceof File;
              const imageUrl = isFileObject
                ? URL.createObjectURL(photo)
                : photo;

              return (
                <div key={idx} className="relative">
                  <img
                    className="h-24 w-full object-cover rounded"
                    src={imageUrl}
                    alt={`Mess ${idx + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...details.messPhoto];
                      updated.splice(idx, 1);
                      setDetails((prev) => ({
                        ...prev,
                        messPhoto: updated,
                      }));
                    }}
                    className="absolute top-1 right-1 bg-white rounded-full text-red-500 hover:text-red-700 px-1.5"
                  >
                    ×
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 col-span-3 sm:col-span-3">
              No photos uploaded yet.
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <button
        disabled={isUpdating}
        onClick={handleUpdate}
        className={`px-4 py-2 rounded text-white transition
              ${
                isUpdating
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
      >
        {isUpdating ? "Updating…" : "Update Settings"}
      </button>
    </div>
  );
};

export default SettingsOwner;
