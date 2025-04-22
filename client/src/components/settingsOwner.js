import React, { useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import { FaMapMarkerAlt } from "react-icons/fa";
import { updateDetailsUrl,updatePasswordDashboardOwner } from "../constant/urls";
const input =
  "border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-text-bg bg-clip-text text-transparent";

const SettingsOwner = ({ userDetails }) => {
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

    messPhoto: [],
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
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
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
          confirmPassword: passwordData.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
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
        messPhoto: userDetails?.messPhoto || [],
      }));
    }
  }, [userDetails]);
  console.log(details);
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
    const formData = new FormData();

    const existingUrls = details.messPhoto
      .filter((photo) => typeof photo === "string")
      .map((photo) => photo);

    const newFiles = details.messPhoto.filter((photo) => photo instanceof File);

    // Append new files
    newFiles.forEach((file) => {
      formData.append("messPhoto", file); // Field name must match multer config
    });

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
        alert("Updated successfully!");
        console.log(result.data);
      } else {
        alert(result.error || "Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred during update.");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <UserProfile className="w-24 h-24 rounded-full" readOnly />
        <h2 className="text-lg font-semibold">Owner</h2>
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
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Update Password</h3>

          {/* Error/Success Messages */}
          {passwordError && (
            <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="p-2 bg-green-100 text-green-700 rounded-md text-sm">
              Password updated successfully!
            </div>
          )}

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
              <label className="text-sm text-gray-500">Password Strength</label>
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
                    alert(
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
                checked={details.facility?.includes(item)}
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
                className={input}
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

      {/* Mess Photos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Mess Photos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Add Photo Box (only show if less than 10 photos) */}
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
                  if (files.length) {
                    const updatedPhotos = [
                      ...details.messPhoto,
                      ...files,
                    ].slice(0, 10);
                    setDetails((prev) => ({
                      ...prev,
                      messPhoto: updatedPhotos,
                    }));
                    e.target.value = ""; // reset input
                  }
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
      <div className="flex justify-end space-x-4">
        {/* <button className="px-4 py-2 border rounded">Reset</button> */}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleUpdate}
        >
          Update Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsOwner;
