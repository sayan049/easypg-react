import React, { useState, useEffect } from "react";
import axios from "axios";
import { signupownerUrl } from "../constant/urls";
import { useNavigate } from "react-router-dom";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignupOwner() {
  const [image, setImage] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const maxLength = 10;
  const [imgArray, setImgArray] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  // const [location, setLocation] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIssubmitting] = useState(false);

  const amenities = [
    { id: "test1", label: "A/C", icon: "💨" },
    { id: "test2", label: "TV", icon: "📺" },
    { id: "test3", label: "Power Backup", icon: "🔋" },
    { id: "test4", label: "WiFi", icon: "📶" },
    { id: "test5", label: "Kitchen", icon: "🍴" },
    { id: "test6", label: "Tank Water", icon: "💧" },
    { id: "test7", label: "Double Bed", icon: "🛏️" },
  ];

  useEffect(() => {
    document.title = "Sign up for owner";
  }, []);

  const mapMake = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Latitude:", latitude, "Longitude:", longitude);

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
          } catch (error) {
            console.error("Error fetching location:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

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
  });

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

  const handleSubmit = async (e) => {
    // if(!FormData.profilePhoto){
    //   toast.error("upload your profile photo");
    //   return;
    // }
    if (!isFormComplete()) {
      toast.error("Please fill all fields");
      return;
    }
  
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }     

    e.preventDefault();

    try {
      setIssubmitting(true); // Set loading state
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "messPhoto") {
          formData.messPhoto.forEach((file) =>
            formDataToSend.append(key, file)
          );
        } else if (key === "roomInfo" || key === "location") {
          // Stringify roomInfo and location to send them as JSON strings
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      console.log(
        "Sending roomInfo and location:",
        formData.roomInfo,
        formData.location
      ); // Log the data being sent
      const response = await axios.post(signupownerUrl, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        console.log("Response:", response.data);

        const a = "Please verify your email to log in";
        localStorage.setItem("loginMessageOwner", a);
        navigate("/LoginOwner", { state: { message: a } });
      } else {
        console.error("Signup failed:", response.data);
      }
    } catch (error) {
      if (error.response) {
        const res = error.response;
        if (res.data.message) {
          // setForgotPasswordMessage(res.data.message); // e.g., "Invalid email or password."
          return toast.error(res.data.message);
        } else if (res.data.errors) {
          // setForgotPasswordMessage(res.data.errors.join(", ")); // Join multiple errors if present
          return toast.error(res.data.errors.join(", "));
        }
      }
      toast.error("Error creating user. Please try again.");
      console.error(
        "Error creating user:",
        error.response ? error.response.data : error.message
      );
    } finally  {
      setTimeout(() => {
        setIssubmitting(false);
      }, 5000);
    }
  };

  const toggleEye = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const isFormComplete = () => {
    console.log(formData.facility); // Log the form data to check if all fields are filled

    return (
      formData.mobileNo &&
      formData.address &&
      formData.email &&
      formData.firstName &&
      formData.lastName &&
      formData.pincode &&
      formData.messName &&
      formData.aboutMess &&
      formData.profilePhoto && // If profile photo is optional, update this condition
      formData.messPhoto.length > 0 && // Same for mess photos, update if optional
      formData.location && // Check if location is set
      formData.location.type === "Point" && // Ensure the location type is "Point"
      Array.isArray(formData.location.coordinates) && // Ensure coordinates is an array
      formData.location.coordinates.length === 2 && // Ensure coordinates have 2 values (longitude, latitude)
      formData.password &&
      formData.roomInfo.every(
        (room) =>
          room.room &&
          room.bedContains &&
          room.pricePerHead &&
          room.roomAvailable
      ) &&
      formData.gender
    );
  };

  console.log(isFormComplete());

  return (
    <div className="relative md:bg-custom-gradient bg-mobile-owner">
      <ToastContainer
        position="top-center"
        toastClassName="!w-[300px]   mx-auto mt-4 sm:mt-0  "
      />
      {/* Header text */}
      <div
        className="flex flex-col items-center w-full text-center  pt-8
             md:flex-row md:items-start md:text-left 
             md:justify-start md:items-center md:px-16"
      >
        <span className="text-[#2CA4B5]  sm:text-3xl font-bold">Sign Up</span>
        <span className="text-black lg:block sm:mt-1 mx-1">Owner</span>
      </div>
      <form
        className=" px-8 md:px-16 rounded-lg shadow-md pb-8"
        onSubmit={handleSubmit}
        method="POST"
        encType="multipart/form-data"
      >
        <div className="sm:mt-2 sm:text-3xl md:mt-16 md:mb-4 text-center md:text-left md:text-4xl md:font-semibold ">
          Create Account
        </div>

        <div className="flex flex-wrap flex-row-reverse ">
          {/* Profile Photo Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-4 md:mt-0">
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
                <img
                  src={URL.createObjectURL(image)}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover mx-auto mt-4 border-4 border-[#2ca4b5]"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-[#AAF5FF] mx-auto mt-4 flex items-center justify-center">
                  <img
                    src="/assets/homeAvatar.png" // Path to your default image
                    alt="Default"
                    className="w-20 h-20 object-cover"
                  />
                </div>
              )}

              <label
                htmlFor="file"
                className="cursor-pointer text-xl text-blue-600 text-white"
              >
                ➕
              </label>
              <input
                type="file"
                accept="image/*"
                name="profilePhoto"
                id="file"
                onChange={loadfile}
                className="hidden"
              />

              <div className="mt-2 text-gray-600">
                Upload Your Profile Photo
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row gap-0 md:gap-4">
              <div className="mb-4 w-full">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a] "
                  placeholder="First Name"
                />
              </div>
              <div className="mb-4 w-full">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="mb-4 w-full">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                placeholder="Email"
              />
            </div>
            <div className="mb-4 w-full">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                placeholder="Address"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-0 md:gap-4">
              <div className="mb-4 w-full relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  placeholder="Password"
                />
                <span
                  onClick={toggleEye}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg"
                >
                  {isPasswordVisible ? "🙈" : "👁️"}
                </span>
              </div>
              <div className="mb-4 w-full">
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div className="mb-4 w-full">
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                placeholder="Mobile No."
              />
            </div>
          </div>
        </div>

        {/* Remaining form fields and facilities section */}
        <div className="mb-6">
          <div className="bg-[#116e7b1a] w-full sm:w-[24.5%] flex justify-center items-center rounded-[44px] h-[45px] text-[#2CA4B5]">
            Check your facilities
          </div>
          <div className="grid grid-cols-2 gap-4 p-4">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={amenity.label} // Value should be the label or ID
                  checked={formData.facility.includes(amenity.label)} // Check if this facility is selected
                  onChange={handleFacilityChange}
                  className="mr-2"
                />
                <span>
                  {amenity.icon} {amenity.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mess Name and About Mess */}
        <div className="mb-4">
          <input
            type="text"
            name="messName"
            value={formData.messName}
            onChange={handleChange}
            className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
            placeholder="Mess Name"
          />
        </div>
        <div className="mb-4">
          <textarea
            name="aboutMess"
            value={formData.aboutMess}
            onChange={handleChange}
            className="w-full rounded-2xl px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
            placeholder="About your Mess"
            rows="4"
          ></textarea>
        </div>
        {/* room info */}
        <div className="mb-4">
          <p className="text-black text-[25px]">Room Information</p>
          {formData.roomInfo.map((room, index) => (
            <div
              className="flex flex-col mb-4 bg-[#116e7b1a] rounded-2xl justify-center p-4"
              key={index}
            >
              <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                <div className="flex flex-col md:w-1/4">
                  <label>Room No.</label>
                  <input
                    type="text"
                    name="room"
                    value={`RoomNo-${index + 1}`} // Display formatted room number
                    readOnly
                    className="px-4 py-2 rounded-full bg-[#116e7b1a] focus:ring focus:ring-[#2ca4b5]"
                  />
                </div>
                <div className="flex flex-col md:w-1/4">
                  <label>Bed Contains</label>
                  <select
                    name="bedContains"
                    value={room.bedContains}
                    onChange={(e) => handleRoomChange(index, e)}
                    placeholder="Select"
                    className="px-4 py-2 rounded-full bg-[#116e7b1a] focus:ring focus:ring-[#2ca4b5]"
                  >
                    <option value="">Select Option</option>
                    <option value="one">Single</option>
                    <option value="two">Double</option>
                    <option value="three">Triple</option>
                    <option value="four">Four</option>
                    <option value="five">Five</option>
                  </select>
                </div>
                <div className="flex flex-col md:w-1/4">
                  <label>Price Per Head</label>
                  <input
                    type="number"
                    name="pricePerHead"
                    value={room.pricePerHead}
                    onChange={(e) => handleRoomChange(index, e)}
                    className="px-4 py-2 rounded-full bg-[#116e7b1a] focus:ring focus:ring-[#2ca4b5]"
                  />
                </div>
                <div className="flex flex-col md:w-1/4">
                  <label>Room Available</label>
                  <select
                    name="roomAvailable"
                    value={room.roomAvailable}
                    onChange={(e) => handleRoomChange(index, e)}
                    className="px-4 py-2 rounded-full bg-[#116e7b1a] focus:ring focus:ring-[#2ca4b5]"
                  >
                    <option value="">Select Option</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-full self-center mt-4"
                onClick={() => removeRoom(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRoom}
            className="bg-[#2ca4b5] text-white px-6 py-2 rounded-md mt-4"
          >
            + Add Room
          </button>
        </div>

        {/* location and pg */}
        <div className="flex flex-col md:flex-row gap-0 md:gap-16 mb-4">
          <div className="w-full md:w-1/2 mb-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Location (latitude, longitude)"
                value={
                  formData.location.coordinates.length === 2
                    ? `${formData.location.coordinates[1]}, ${formData.location.coordinates[0]}` // Display lat, lon
                    : "Latitude, Longitude" // Display placeholder if coordinates are not set or invalid
                }
                readOnly // Makes the input non-editable
                className="block w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2ca4b5] bg-[#116e7b1a]"
              />
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-xl text-[#2ca4b5] ml-2 cursor-pointer" // Added cursor-pointer for clickable effect
                onClick={mapMake} // Call the mapMake function on click
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            {/* <label htmlFor="gender" className="block text-left text-lg mb-2">
              Mess Type:
            </label> */}
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2ca4b5]  bg-[#116e7b1a]"
            >
              <option value="">Select Option</option>
              <option value="Girls Pg">Girls Pg</option>
              <option value="Boys Pg">Boys Pg</option>
              <option value="Coed Pg">Coed Pg</option>
            </select>
          </div>
        </div>

        {/* Mess Photos Upload */}
        <div className="mb-4">
          {/* {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>} */}

          <div className="">
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              name="messPhotos"
              onChange={imgUpload}
              multiple
              className="hidden"
              id="fileInput"
            />

            {/* Display an upload icon and text when no image is selected */}
            {!imgArray.length && (
              <div
                className="inset-0 text-center cursor-pointer"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <div className="w-full h-auto p-6 rounded-lg border-2 border-dashed border-black bg-transparent text-transparent flex flex-col justify-center items-center">
                  <img
                    src="/assets/upload 1.png"
                    alt="Upload"
                    className="w-8 h-8"
                  />
                  <p className="text-black text-[25px]">
                    Upload your mess photos
                  </p>
                  <p className="text-sm text-black">
                    Maximum 5MB per photo, supported formats only
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Display selected images */}
          {imgArray.length > 0 && (
            <div className="w-full h-auto p-6 rounded-lg border-2 border-dashed border-black bg-transparent">
              <div className="flex gap-1 flex-wrap">
                {imgArray.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.src}
                      alt={img.name}
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      } // Trigger file input on image click
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 text-lg"
                      onClick={() => removeImage(index)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-center justify-center mb-6">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            disabled={!isFormComplete()}
            className="mr-2"
          />
          <label htmlFor="terms" className="text-gray-600">
            I accept the Terms and Conditions
          </label>
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center items-center">
          <button
            type="submit"
            className={`w-1/2 p-3 rounded-full text-white ${
              isFormComplete() && termsAccepted
                ? "bg-[#2ca4b5]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
           // disabled={!isFormComplete() || !termsAccepted}
           disabled={isSubmitting}
            // onClick={(e) => {
            //   if (!isFormComplete()) {
            //     e.preventDefault();
            //     toast.error("Please fill all fields");
            //   } else if (!termsAccepted) {
            //     e.preventDefault();
            //     toast.error("Please accept the terms and conditions");
            //   }
            // }}
          >
            {isSubmitting ? ( "submitting...") : "Create Account"}
           
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupOwner;
