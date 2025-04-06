import React, { useState, useEffect } from "react";
import ToggleSwitch from "./toggle";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../contexts/AuthContext";
import { updateDetailsUrl, resetPasswordDashboard } from "../constant/urls";
import {
  faMapMarkerAlt,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

function Settings({ user }) {
  const [image, setImage] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLocationChanged, setIsLocationChanged] = useState(false);
  const [intialData, setInitialData] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { userName, IsAuthenticated, owner, type } = useAuth();
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    pin: user?.pin || "",
    location: user?.location || { type: "Point", coordinates: [] },
    messType: user?.messType || "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
  });
  const [privacy, setPrivacy] = useState({
    profilePrivate: false,
    hideContact: false,
  });

  const [editingField, setEditingField] = useState(null);

  const handleEditClick = (field) => {
    setEditingField(editingField === field ? null : field);
    //setIsEditing(!isEditing);
    setIsEditing(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "location") return; // prevent overriding the object
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSaveChanges = async () => {
    const phone = personalInfo.phone;
    const phoneRegex = /^[0-9]{10}$/;

    if (phone && !phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return; // Exit the entire function
    }
    const formData = new FormData();
    const userId = type === "student" ? user?.id : owner?.id;
    formData.append("userId", user._id);
    console.log("userid", user._id, userId);
    formData.append("type", type);

    // Object.keys(personalInfo).forEach((key) => {
    //   if (personalInfo[key]) {
    //     console.log(key,personalInfo[key]);
    //     formData.append(key, personalInfo[key]);
    //   }
    //   setEditingField(null);
    //   setIsEditing(false);
    // });
    Object.keys(personalInfo).forEach((key) => {
      if (personalInfo[key]) {
        if (key === "location") {
          formData.append(key, JSON.stringify(personalInfo[key]));
        } else {
          formData.append(key, personalInfo[key]);
        }
        console.log("key", personalInfo[key], formData.get(key), key);
      }
    });

    try {
      const response = await fetch(updateDetailsUrl, {
        method: "POST",
        body: formData,
      });

      console.log("print data", formData);

      if (!response.ok) {
        throw new Error("Failed to update details");
      }

      const data = await response.json();
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleReset = () => {
    setPersonalInfo(intialData);
  };

  const loadfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      // setFormData({ ...formData, profilePhoto: file });
      setImage(file);
    }
  };

  // const mapMake = () => {
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(async (position) => {
  //     const { latitude, longitude } = position.coords;

  //     try {
  //       const response = await fetch(
  //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.Google_apiKey}`
  //       );
  //       const data = await response.json();

  //       const address =data.results[0]?.formatted_address || `${latitude}, ${longitude}`;
  //       setPersonalInfo((prevData) => ({
  //         ...prevData,
  //         location: address,
  //       }));
  //       setIsLocationChanged(true);
  //     } catch (error) {
  //       console.error("Error fetching location:", error);
  //     }
  //   });
  // } else {
  //   alert("Geolocation is not supported by this browser.");
  // }
  // };
  const mapMake = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      const updatedLocation = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      console.log("pers", updatedLocation);

      setPersonalInfo((prevData) => ({
        ...prevData,
        location: updatedLocation,
      }));
      setIsLocationChanged(true);
    });
  };

  const handlePasswordReset = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;
    // Validate fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required!");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const response = await fetch(resetPasswordDashboard, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: type === "student" ? user?._id : owner?._id,
          type,
          currentPassword,
          newPassword,
        }),
      });
      console.log(
        "passuse",
        type === "student" ? user?.id : owner?.id,
        user._id
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Password update failed");

      alert("Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.message);
    }
  };

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     setIsLoading(true);
  //     try {
  //       const userId = type === "student" ? user?.id : owner?.id;
  //       if (!userId) {
  //         console.error("User ID is missing");
  //         return;
  //       }

  //       const url = new URL(fetchDetailsUrl);
  //       url.searchParams.append("userId", userId);
  //       url.searchParams.append("type", type);

  //       const response = await fetch(url, { method: "GET" });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch details");
  //       }

  //       const data = await response.json();
  //       setPersonalInfo({
  //         fullName: `${data.firstName} ${data.lastName}`.trim(),
  //         email: data.email,
  //         pin: data.pin || "",
  //         phone: data.phone || "",
  //         // location: data.location || "",
  //         location: {
  //           type: "Point",
  //           coordinates: data.location?.coordinates || [0, 0],
  //         },
  //       });
  //       setInitialData({
  //         fullName: `${data.firstName} ${data.lastName}`.trim(),
  //         email: data.email,
  //         pin: data.pin || "",
  //         phone: data.phone || "",
  //         // location: data.location || "",
  //         location: {
  //           type: "Point",
  //           coordinates: data.location?.coordinates || [0, 0],
  //           address: data.location?.address || "",
  //         },
  //       });

  //       console.log("Fetched data:", data);
  //     } catch (error) {
  //       console.error("Error fetching details:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchDetails();

  //   // console.log(user?.image + "xxxx");
  // }, [type, user, owner]);
  useEffect(() => {
   // console.log("verify",user.is_verified);
    if (!user._id) {
      alert("something wnt wrong user id is null");
    }
    if (user) {
      setPersonalInfo({
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email || "",
        pin: user.pin || "",
        phone: user.phone || "",
        messType: user.messType || "", // use `gender` field as messType
        location: {
          type: "Point",
          coordinates: user.location?.coordinates || [0, 0],
        },
      });

      setInitialData({
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email || "",
        pin: user.pin || "",
        phone: user.phone || "",
        messType: user.messType || "",
        location: {
          type: "Point",
          coordinates: user.location?.coordinates || [0, 0],
          address: user.location?.address || "",
        },
      });
    }
  }, [user]);

  return (
    <div className="bg-white pb-16 pr-6 pt-6 pl-6 shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <div className="relative mb-4"></div>
      {/* Profile Picture Section (First Row) */}
      <div className="flex justify-center mb-6">
        <div className="text-center flex items-center flex-col">
          <input
            type="file"
            accept="image/*"
            name="profilePhoto"
            id="file"
            onChange={loadfile}
            className="hidden"
          />

          {IsAuthenticated ? <UserProfile className="!h-36 !w-36" /> : null}
          {/* <label
            htmlFor="file"
            className="cursor-pointer text-xl text-blue-600 text-white relative top-[-34px] left-[18px] "
          >
            ➕
          </label> */}
          <div className="mt-2 text-gray-600">Upload Your Profile Photo</div>
        </div>
      </div>

      {/* Personal Information and Password Management (Second Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4">
            Edit Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(personalInfo)
              .filter(
                ([key]) =>
                  key !== "password" && key !== "location" && key !== "messType"
              )
              .map(([key, value]) => (
                <div key={key} className="relative">
                  <input
                    type="text"
                    name={key}
                    placeholder={`Enter your ${key}`}
                    value={value}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    readOnly={editingField !== key}
                  />
                  {key === "email" ? (
                    user?.is_verified ? (
                      <button
                        onClick={() => handleEditClick(key)}
                        className="absolute top-2/4 right-3 transform -translate-y-2/4 cursor-pointer text-2xl"
                      >
                       <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                      </button>
                    )
                    :
                   ( <button
                      // onClick={() => handleEditClick(key)}
                      className="absolute top-2/4 right-3 transform -translate-y-2/4 cursor-pointer bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Verify
                    </button>)
                  ) : (
                    <button
                      onClick={() => handleEditClick(key)}
                      className="absolute top-2/4 right-3 transform -translate-y-2/4 cursor-pointer text-2xl text-blue-500"
                    >
                      <FontAwesomeIcon
                        icon={editingField === key ? faSave : faEdit}
                      />
                    </button>
                  )}

                  {/* <button
                  //   onClick={() => handleEditClick(key)}
                  //   className="absolute top-2/4 right-3 transform -translate-y-2/4 cursor-pointer text-2xl text-blue-500"
                  // >
                  //   <FontAwesomeIcon
                  //     icon={editingField === key ? faSave : faEdit}
                  //   />
                  // </button> */}
                </div>
              ))}

            <div className="relative">
              {/* <input
                type="text"
                name="location"
                placeholder={user?.location || "Add your location"}
                value={personalInfo.location}
                onChange={handleInputChange}
                disabled
                className="border border-gray-300 rounded-md p-2 w-full pr-10"
              /> */}
              <input
                type="text"
                name="location"
                placeholder="Click to get location"
                value={
                  personalInfo.location?.coordinates?.length
                    ? personalInfo.location.coordinates.join(", ")
                    : ""
                }
                onChange={handleInputChange}
                disabled
                className="border border-gray-300 rounded-md p-2 w-full pr-10"
                onClick={mapMake}
              />
              <div
                onClick={mapMake}
                className="absolute top-2/4 right-3 transform -translate-y-2/4 cursor-pointer text-2xl text-green-600"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
            </div>
            {/* New Dropdown for Mess Selection */}
            <select
              name="messType"
              value={personalInfo.messType || ""}
              onChange={(e) => {
                handleInputChange(e);
                setIsEditing(true); // this makes the Save Changes button appear
              }}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="" disabled>
                Select Mess Type
              </option>
              <option value="Boys Pg">Boys PG</option>
              <option value="Girls Pg">Girls PG</option>
              <option value="Coed Pg">Co-ed PG</option>
            </select>
          </div>
          {(isEditing || isLocationChanged) && (
            <button
              onClick={handleSaveChanges}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          )}
        </section>

        {/* Password Management Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Password Management</h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handlePasswordReset}
          >
            Update Password
          </button>
        </section>
      </div>

      {/* Notification Preferences */}
      {/* Notification Preferences */}
      {/* <section className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2">
          
            <ToggleSwitch isChecked={isChecked} setIsChecked={setIsChecked} />
            <span>Email Notifications</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={() => handleToggle("notifications", "sms")}
            />
            <span>SMS Notifications</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={() => handleToggle("notifications", "push")}
            />
            <span>App Push Notifications</span>
          </label>
        </div>
      </section> */}

      {/* Privacy Settings */}
      {/* <section className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={privacy.profilePrivate}
              onChange={() => handleToggle("privacy", "profilePrivate")}
            />
           
            <span>Make Profile Private</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={privacy.hideContact}
              onChange={() => handleToggle("privacy", "hideContact")}
            />
          
            <span>Hide Contact Information</span>
          </label>
        </div>
      </section> */}

      {/* Account Management */}
      {/* <section className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Account Management</h3>
        <div className="flex space-x-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md">
            Logout
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md">
            Delete Account
          </button>
        </div>
      </section> */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-md w-full max-w-md">
            {/* Cross Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-4 flex justify-center">
              Account Management
            </h3>
            {/* <div className="flex justify-center">
            <img
                src="/assets/delete 1.png" // Path to your default image
                alt="Default"
              />
            </div> */}
            <div className="flex space-x-4 justify-center">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                Logout
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex pb-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Account Management
        </button>
      </div>
      <div className="flex justify-end">
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
          onClick={handleReset}
        >
          Reset to Default
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleSaveChanges}
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;
