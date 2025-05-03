import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../contexts/AuthContext";
import { updateDetailsUrl, resetPasswordDashboard } from "../constant/urls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faMapMarkerAlt,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

function Settings({ user }) {
  const { IsAuthenticated, owner, type, handleLogout } = useAuth();
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLocationChanged, setIsLocationChanged] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    pin: user?.pin || "",
    location: user?.location || { type: "Point", coordinates: [] },
    messType: user?.messType || "",
  });
  const [editingField, setEditingField] = useState(null);

  // Handlers
  const handleEditClick = (field) => {
    setEditingField(editingField === field ? null : field);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "location") return;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSaveChanges = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (personalInfo.phone && !phoneRegex.test(personalInfo.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("type", type);

    Object.keys(personalInfo).forEach((key) => {
      if (personalInfo[key]) {
        formData.append(
          key,
          key === "location"
            ? JSON.stringify(personalInfo[key])
            : personalInfo[key]
        );
      }
    });

    try {
      const response = await fetch(updateDetailsUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update details");
      await response.json();
      toast.success("Profile details updated!");
      setIsEditing(false);
      setEditingField(null);
    } catch (error) {
      toast.error(error.message);
      return;
    }

    // Handle password change if any field is filled
    const { currentPassword, newPassword, confirmPassword } = passwords;
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("All password fields are required!");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Passwords don't match!");
        return;
      }

      try {
        const passResponse = await fetch(resetPasswordDashboard, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: type === "student" ? user?._id : owner?._id,
            type,
            currentPassword,
            newPassword,
          }),
        });

        if (!passResponse.ok) throw new Error("Password update failed");

        toast.success("Password updated successfully!");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // const handleSaveChanges = async () => {
  //   const phoneRegex = /^[0-9]{10}$/;
  //   if (personalInfo.phone && !phoneRegex.test(personalInfo.phone)) {
  //     toast.error("Please enter a valid 10-digit phone number");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("userId", user._id);
  //   formData.append("type", type);

  //   Object.keys(personalInfo).forEach((key) => {
  //     if (personalInfo[key]) {
  //       formData.append(
  //         key,
  //         key === "location"
  //           ? JSON.stringify(personalInfo[key])
  //           : personalInfo[key]
  //       );
  //     }
  //   });

  //   try {
  //     const response = await fetch(updateDetailsUrl, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) throw new Error("Failed to update details");
  //     await response.json();
  //     toast.success("Changes saved successfully!");
  //     setIsEditing(false);
  //     setEditingField(null);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const handleReset = () => {
    setPersonalInfo(initialData);
    toast.success("Reset to default settings!");
  };

  // const handlePasswordReset = async () => {
  //   const { currentPassword, newPassword, confirmPassword } = passwords;

  //   if (!currentPassword || !newPassword || !confirmPassword) {
  //     toast.error("All fields are required!");
  //     return;
  //   }
  //   if (newPassword.length < 6) {
  //     toast.error("Password must be at least 6 characters");
  //     return;
  //   }
  //   if (newPassword !== confirmPassword) {
  //     toast.error("Passwords don't match!");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(resetPasswordDashboard, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userId: type === "student" ? user?._id : owner?._id,
  //         type,
  //         currentPassword,
  //         newPassword,
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Password update failed");

  //     toast.success("Password updated successfully!");
  //     setPasswords({
  //       currentPassword: "",
  //       newPassword: "",
  //       confirmPassword: "",
  //     });
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const mapMake = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setPersonalInfo((prev) => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      }));
      setIsLocationChanged(true);
    });
  };

  useEffect(() => {
    if (user) {
      const initial = {
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email || "",
        pin: user.pin || "",
        phone: user.phone || "",
        messType: user.messType || "",
        location: {
          type: "Point",
          coordinates: user.location?.coordinates || [0, 0],
        },
      };
      setPersonalInfo(initial);
      setInitialData(initial);
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <ToastContainer
        position="top-center"
        toastClassName="!w-full max-w-xs !text-sm"
        autoClose={3000}
      />

      <h2 className="text-xl sm:text-2xl font-bold mb-4">Profile Settings</h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-6">
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            id="profileUpload"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="profileUpload" className="cursor-pointer">
            {IsAuthenticated && (
              <UserProfile className="!h-24 !w-24 sm:!h-32 sm:!w-32" />
            )}
            {/* <div className="mt-2 text-sm text-gray-600">Click to upload photo</div> */}
          </label>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>

          {Object.entries(personalInfo)
            .filter(([key]) => !["location", "messType"].includes(key))
            .map(([key, value]) => (
              <div key={key} className="relative">
                <input
                  type={key === "email" ? "email" : "text"}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={`Your ${key.replace(/([A-Z])/g, " $1")}`}
                  readOnly={editingField !== key}
                  className="w-full p-2 border rounded text-sm pr-10"
                />
                {key !== "email" && (
                  <button
                    onClick={() => handleEditClick(key)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500"
                  >
                    <FontAwesomeIcon
                      icon={editingField === key ? faSave : faEdit}
                      size="sm"
                    />
                  </button>
                )}
              </div>
            ))}

          <div className="relative">
            <input
              type="text"
              value={personalInfo.location?.coordinates?.join(", ") || ""}
              readOnly
              onClick={mapMake}
              placeholder="Click to set location"
              className="w-full p-2 border rounded text-sm pr-10 cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600"
              size="sm"
            />
          </div>

          <select
            name="messType"
            value={personalInfo.messType}
            onChange={(e) => {
              handleInputChange(e);
              setIsEditing(true);
            }}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="" disabled>
              Select Mess Type
            </option>
            <option value="Boys Pg">Boys PG</option>
            <option value="Girls Pg">Girls PG</option>
            <option value="Coed Pg">Co-ed PG</option>
          </select>

          {/* {(isEditing || isLocationChanged) && (
            <button
              onClick={handleSaveChanges}
              className="mt-2 bg-blue-500 text-white px-3 py-1.5 rounded text-sm"
            >
              Save Changes
            </button>
          )} */}
        </section>

        {/* Password Management */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Password</h3>

          {["currentPassword", "newPassword", "confirmPassword"].map(
            (field) => (
              <input
                key={field}
                type="password"
                name={field}
                value={passwords[field]}
                onChange={handlePasswordChange}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className="w-full p-2 border rounded text-sm"
              />
            )
          )}

          {/* <button
            onClick={handlePasswordReset}
            className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm"
          >
            Update Password
          </button> */}
        </section>
      </div>

      {/* Account Management */}
      <div className="mt-8 flex   justify-between items-center gap-4">
        {/* <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Account Options
        </button> */}

        {/* <div className="flex gap-5"> */}
        <button
          onClick={handleReset}
          className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm"
        >
          Reset to default
        </button>
        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm"
        >
          Save All changes
        </button>
        {/* </div> */}
      </div>

      {/* Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Account Management</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded text-sm">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
