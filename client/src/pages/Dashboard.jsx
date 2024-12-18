import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useAuth } from "../contexts/AuthContext";
import UserProfile from "../components/UserProfile";
import { fetchDetailsUrl, updateDetailsUrl } from "../constant/urls";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const UserDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    address: user?.address || owner?.address || "",
    pin: user?.pin || "",
    pincode: owner?.pincode || "",
    mobileNo: owner?.mobileNo || "",
    facility: owner?.facility || "",
    messName: owner?.messName || "",
    aboutMess: owner?.aboutMess || "",
    location: owner?.location || "",
    profilePhoto: owner?.profilePhoto || null,
    messPhoto: owner?.messPhoto || null,
  });

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

        console.log("Fetching details with URL:", url.toString());

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch details");
        }

        const data = await response.json();
        setUpdatedUserDetails(data || {});
        console.log("Fetched data:", data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserDetails((prevState) => {
      const updatedDetails = { ...prevState, [name]: value };
      setHasChanges(
        JSON.stringify(updatedDetails) !== JSON.stringify(prevState)
      );
      return updatedDetails;
    });
  };

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      if (field === "messPhoto") {
        setUpdatedUserDetails((prevState) => ({
          ...prevState,
          messPhoto: fileArray.map((file) => URL.createObjectURL(file)), // Preview files
        }));
      } else {
        const file = files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setUpdatedUserDetails((prevState) => ({
            ...prevState,
            [field]: fileReader.result,
          }));
        };
        fileReader.readAsDataURL(file);
      }
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    Object.keys(updatedUserDetails).forEach((key) => {
      if (key === "profilePhoto" || key === "messPhoto") {
        const fileInput = document.querySelector(`input[name=${key}]`);
        if (fileInput && fileInput.files.length > 0) {
          Array.from(fileInput.files).forEach((file) => {
            formData.append(key, file);
          });
        }
      } else {
        formData.append(key, updatedUserDetails[key]);
      }
    });

    try {
      const url = updateDetailsUrl;
      const payload = {
        ...updatedUserDetails,
        userId: type === "student" ? user?.id : owner?.id,
        type,
      };

      console.log("Payload being sent:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update details");
      }

      const data = await response.json();
      console.log("Update Response:", data);
      alert("Changes saved successfully!");
    }  catch (error) {
      console.error(error);
      alert("Failed to save changes");
    }
  };
  const toggleEdit = (field) => {
    setIsEditable((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Hotels/PGs Booked",
        data: [3, 2, 5, 4, 6, 3, 7, 5, 4, 6, 8, 5],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "rgba(75, 192, 192, 1)",
        fill: true,
      },
      {
        label: "Payments Made (in ₹)",
        data: [
          15000, 10000, 25000, 20000, 30000, 15000, 35000, 25000, 20000, 30000,
          40000, 25000,
        ],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        pointBackgroundColor: "rgba(255, 159, 64, 1)",
        pointBorderColor: "rgba(255, 159, 64, 1)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Booking Trends and Payments (Monthly)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count / Amount (₹)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-teal-500 p-2 rounded-full"
      >
        <img src="/assets/hamburger.svg" alt="Menu" className="h-6 w-6" />
      </button>

      <div
        className={`fixed md:static top-0 left-0 h-full bg-cyan-500 md:w-1/6 transition-transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <div className="flex flex-col items-center py-6">
          <div className="text-teal-700 text-3xl font-bold">
            Easy<span className="text-blue-900">Pg</span>
          </div>
          <hr className="border-white w-full my-4" />
          <div
            onClick={() => setCurrentView("profile")}
            className="flex items-center cursor-pointer space-x-2"
          >
            {IsAuthenticated || isOwnerAuthenticated ? <UserProfile /> : null}
            <span className="text-white font-medium">
              {IsAuthenticated ? userName : ownerName}
            </span>
          </div>
          <hr className="border-white w-full my-4" />
          <div
            onClick={() => setCurrentView("dashboard")}
            className="flex items-center cursor-pointer space-x-2"
          >
            <img
              src="/assets/dashboard.png"
              alt="Dashboard Icon"
              className="h-7"
            />
            <span className="text-white font-medium">Dashboard</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {currentView === "dashboard" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <Line data={data} options={options} />
          </div>
        )}
        {currentView === "profile" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-center text-teal-500 font-bold text-xl mb-4">
              Update Your Details
            </h2>
            <p>
              <strong>Name:</strong>{" "}
              {type === "student" ? user?.name : owner?.name}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {type === "student" ? user?.email : owner?.email}
            </p>

            {type === "student" ? (
              <>
                <div>
                  <strong>Address:</strong>
                  <div className="flex items-center">
                    <input
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                      name="address"
                      value={updatedUserDetails.address}
                      onChange={handleChange}
                      disabled={!isEditable.address}
                      placeholder={user?.address || "Add your address"}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("address")}
                      className="ml-2 text-teal-500"
                    >
                      {isEditable.address ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div>
                  <strong>Pin:</strong>
                  <div className="flex items-center">
                    <input
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                      name="pin"
                      value={updatedUserDetails.pin}
                      onChange={handleChange}
                      disabled={!isEditable.pin}
                      placeholder={user?.pin || "Add your PIN"}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("pin")}
                      className="ml-2 text-teal-500"
                    >
                      {isEditable.pin ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>Profile Photo:</strong>
                  <input
                    type="file"
                    name="profilePhoto"
                    onChange={(e) => handleFileChange(e, "profilePhoto")}
                    disabled={!isEditable.profilePhoto}
                  />
                  {updatedUserDetails.profilePhoto && (
                    <img
                      src={updatedUserDetails.profilePhoto}
                      alt="Profile Preview"
                      className="h-20 mt-2"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => toggleEdit("profilePhoto")}
                    className="ml-2 text-teal-500"
                  >
                    {isEditable.address ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div>
                  <strong>Address:</strong>
                  <div className="flex items-center">
                    <input
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                      name="address"
                      value={updatedUserDetails.address}
                      onChange={handleChange}
                      disabled={!isEditable.address}
                      placeholder={owner?.address || "Add address"}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("address")}
                      className="ml-2 text-teal-500"
                    >
                      {isEditable.address ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div>
                  <strong>Pin:</strong>
                  <div className="flex items-center">
                    <input
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                      name="pincode"
                      value={updatedUserDetails.pincode}
                      onChange={handleChange}
                      disabled={!isEditable.pincode}
                      placeholder={owner?.pincode || "Add PINCODE"}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("pincode")}
                      className="ml-2 text-teal-500"
                    >
                      {isEditable.pincode ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div>
                  <strong>Mobile No:</strong>
                  <div className="flex items-center">
                    <input
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                      name="mobileNo"
                      value={updatedUserDetails.mobileNo}
                      onChange={handleChange}
                      disabled={!isEditable.mobileNo}
                      placeholder={owner?.mobileNo || "Add mobile number"}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("mobileNo")}
                      className="ml-2 text-teal-500"
                    >
                      {isEditable.mobileNo ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div>
                  <strong>Facility:</strong>
                  <div className="flex items-center">
                    <input
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                      name="facility"
                      value={updatedUserDetails.facility}
                      onChange={handleChange}
                      disabled={!isEditable.facility}
                      placeholder={owner?.facility || "Add facility details"}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("facility")}
                      className="ml-2 text-teal-500"
                    >
                      {isEditable.facility ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div>
                  <strong>Mess Name:</strong>
                  <div className="flex items-center">
                    <input
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                      name="messName"
                      value={updatedUserDetails.messName}
                      onChange={handleChange}
                      disabled={!isEditable.messName}
                      placeholder={owner?.messName || "Add mess name"}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("messName")}
                      className="ml-2 text-teal-500"
                    >
                      {isEditable.messName ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div>
                  <strong>About Mess:</strong>
                  <div className="flex items-center">
                    <textarea
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                      name="aboutMess"
                      value={updatedUserDetails.aboutMess}
                      onChange={handleChange}
                      disabled={!isEditable.aboutMess}
                      placeholder={owner?.aboutMess || "Add about mess"}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("aboutMess")}
                      className="ml-2 text-teal-500"
                    >
                      {isEditable.aboutMess ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div>
                  <strong>Location:</strong>
                  <div className="flex items-center">
                    <input
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                      name="location"
                      value={updatedUserDetails.location}
                      onChange={handleChange}
                      disabled={!isEditable.location}
                      placeholder={owner?.location || "Add location"}
                    />
                    <button
                      type="button"
                      onClick={() => toggleEdit("location")}
                      className="ml-2 text-teal-500"
                    >
                      {isEditable.location ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>

                <div>
                  <strong>Mess Photo:</strong>
                  <input
                    type="file"
                    name="messPhoto"
                    multiple // Allow multiple file selection
                    onChange={(e) => handleFileChange(e, "messPhoto")}
                    disabled={!isEditable.messPhoto}
                  />
                  {updatedUserDetails.messPhoto &&
                    updatedUserDetails.messPhoto.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Mess Preview ${index}`}
                        className="h-20 mt-2"
                      />
                    ))}
                  <button
                    type="button"
                    onClick={() => toggleEdit("messPhoto")}
                    className="ml-2 text-teal-500"
                  >
                    {isEditable.messPhoto ? "Cancel" : "Edit"}
                  </button>
                </div>
              </>
            )}

            {hasChanges && (
              <button
                onClick={handleSaveChanges}
                className="mt-4 bg-teal-500 text-white p-2 rounded"
              >
                Save Changes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
