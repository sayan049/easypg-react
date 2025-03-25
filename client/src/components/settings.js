import React, { useState } from "react";
import ToggleSwitch from "./toggle";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../contexts/AuthContext";
import UserProfile from "../components/UserProfile";
import { fetchDetailsUrl, updateDetailsUrl } from "../constant/urls";

function Settings() {
  const [image, setImage] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    pincode: "",
    location: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleToggle = (section, field) => {
    if (section === "notifications") {
      setNotifications({ ...notifications, [field]: !notifications[field] });
    } else if (section === "privacy") {
      setPrivacy({ ...privacy, [field]: !privacy[field] });
    }
  };

  const loadfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      // setFormData({ ...formData, profilePhoto: file });
      setImage(file);
    }
  };

  const mapMake = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.Google_apiKey}`
          );
          const data = await response.json();

          const address =
            data.results[0]?.formatted_address || `${latitude}, ${longitude}`;
          setPersonalInfo((prevData) => ({
            ...prevData,
            location: address,
          }));
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }









    const {
        userName,
        IsAuthenticated,
        isOwnerAuthenticated,
        ownerName,
        user,
        owner,
        type,
      } = useAuth();
      const [isLoading, setIsLoading] = useState(true);
      const [isEditable, setIsEditable] = useState({});
      const [hasChanges, setHasChanges] = useState(false);
      const [updatedUserDetails, setUpdatedUserDetails] = useState({
        address: owner?.address || "",
        pin: owner?.pincode || "",
        mobileNo: owner?.mobileNo || "",
        facility: owner?.facility || "",
        messName: owner?.messName || "",
        aboutMess: owner?.aboutMess || "",
        location: owner?.location || "",
        profilePhoto: owner?.profilePhoto || "",
        messPhoto: owner?.messPhoto || [],
      });
    
  };


    useEffect(() => {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const userId = type === "student" ? user?.id : owner?.id;
          if (!userId) {
            console.error("User ID is missing");
            return;
          }
  
          const url = new URL(fetchDetailsUrl);
          url.searchParams.append("userId", userId);
          url.searchParams.append("type", type);
  
          const response = await fetch(url, {
            method: "GET",
            // Remove Content-Type for GET requests
            headers: {
              // No Content-Type header needed for GET requests
            },
          });
  
          if (!response.ok) {
            throw new Error("Failed to fetch details");
          }
  
          const data = await response.json();
          // Assuming the data contains image URLs or paths
          setUpdatedUserDetails(data || {});
          console.log("fetched data:", data);
        } catch (error) {
          console.error("Error fetching details:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      if (currentView === "profile") {
        fetchDetails();
      } else {
        setIsLoading(false);
      }
    }, [currentView, type, user, owner]);

  return (
    <div className="bg-white pb-16 pr-6 pt-6 pl-6 shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      {/* Profile Picture Section (First Row) */}
      <div className="flex justify-center mb-6">
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            name="profilePhoto"
            id="file"
            onChange={loadfile}
            className="hidden"
          />
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover mx-auto mt-4 border-4 border-[#2ca4b5]"
            />
          ) : (
            <div className="w-36 h-36 rounded-full mx-auto mt-4 flex items-center justify-center">
              <img
                src="/assets/Component 2.png" // Path to your default image
                alt="Default"
                className="w-40 h-[13rem] object-cover relative top-[34px]"
              />
            </div>
          )}
          <label
            htmlFor="file"
            className="cursor-pointer text-xl text-blue-600 text-white relative top-[-34px] left-[54px] opacity-0"
          >
            ➕
          </label>
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
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={personalInfo.fullName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input
              type="email"
              name="email"
              placeholder={user?.email || "Add your Email"}
              value={personalInfo.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={personalInfo.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input
              type="text"
              name="pincode"
              placeholder="pincode"
              value={personalInfo.pincode}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <div className="relative">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={personalInfo.location}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full pr-10"
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
      onChange={handleInputChange}
      className="border border-gray-300 rounded-md p-2 w-full"
    >
      <option value="" disabled>Select Mess Type</option>
      <option value="boys">Boys Mess</option>
      <option value="girls">Girls Mess</option>
      <option value="co-ed">Co-ed Mess</option>
    </select>
          </div>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
            Save Changes
          </button>
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
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
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

            <h3 className="text-xl font-semibold mb-4 flex justify-center">Account Management</h3>
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
        
        <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2">
          Reset to Default
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Save All Changes
        </button>
      </div>

      
    </div>

    
  );
}

export default Settings;
