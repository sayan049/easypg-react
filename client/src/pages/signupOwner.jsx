import React, { useState, useEffect } from "react";
import axios from "axios";
import { signupownerUrl } from "../constant/urls";
import { useNavigate } from "react-router-dom";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



function SignupOwner() {
  const [image, setImage] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const maxLength = 10;
  const [imgArray, setImgArray] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  // const [location, setLocation] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
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
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.Google_apiKey}`
          );
          const data = await response.json();
  
          const address =
            data.results[0]?.formatted_address ||
            `${latitude}, ${longitude}`;
            
          setFormData((prevData) => ({
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
    location: "",
    profilePhoto: null,
    messPhoto: [],
    facility: [],
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
      const facilities = checked
        ? [...prevData.facility, value]
        : prevData.facility.filter((facility) => facility !== value);

      return { ...prevData, facility: facilities };
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
      return;
    }
    filesArr.forEach((file) => {
      if (!file.type.match("image.*")) {
        setErrorMessage("Only image files are allowed.");
        return;
      }
      if (imgArray.length >= maxLength) {
        setErrorMessage("Maximum number of images reached.");
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
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "messPhoto") {
          formData.messPhoto.forEach((file) =>
            formDataToSend.append(key, file)
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

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
      console.error(
        "Error creating user:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const toggleEye = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isFormComplete = () => {
    console.log(formData); // Log the form data to check if all fields are filled
    return (
      formData.mobileNo &&
      formData.address &&
      formData.email &&
      formData.firstName &&
      formData.lastName &&
      formData.pincode &&
      formData.facility.length > 0 &&
      formData.messName &&
      formData.aboutMess &&
      formData.profilePhoto &&
      formData.messPhoto.length > 0 &&
      formData.location
    );
  };
console.log(isFormComplete());  
  
  return (
    <div className="relative md:bg-custom-gradient bg-mobile-owner" >
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

            <div className="mt-2 text-gray-600">Upload Your Profile Photo</div>
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
                className="w-full rounded-full p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a] "
                placeholder="First Name"
              />
            </div>
            <div className="mb-4 w-full">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-full p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
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
              className="w-full rounded-full p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
              placeholder="Email"
            />
          </div>
          <div className="mb-4 w-full">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-full p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
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
                className="w-full rounded-full p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
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
                className="w-full rounded-full p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
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
              className="w-full rounded-full p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
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
          className="w-full rounded-full p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
          placeholder="Mess Name"
        />
      </div>
      <div className="mb-4">
        <textarea
          name="aboutMess"
          value={formData.aboutMess}
          onChange={handleChange}
          className="w-full rounded-2xl p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
          placeholder="About your Mess"
          rows="4"
        ></textarea>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={formData.location}
          onChange={handleChange}
          className="w-full rounded-full p-3 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
          placeholder="Location (Latitude, Longitude)"
          readOnly required
        />
        <div
          onClick={mapMake}
          className="ml-2 cursor-pointer text-2xl text-green-600"
        >
           <FontAwesomeIcon icon={faMapMarkerAlt} />
        </div>
      </div>

      {/* Mess Photos Upload */}
      <div className="mb-4">
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}

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
            onClick={() => document.getElementById('fileInput').click()}
          >
            <div className="w-full h-auto p-6 rounded-lg border-2 border-dashed border-black bg-transparent text-transparent flex flex-col justify-center items-center">
              <img src="/assets/upload 1.png" alt="Upload" className="w-8 h-8" />
              <p className="text-black text-[25px]">Upload your mess photos</p>
              <p className="text-sm text-black">Maximum 5MB per photo, supported formats only</p>
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
                  onClick={() => document.getElementById('fileInput').click()} // Trigger file input on image click
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
          disabled={!isFormComplete() }
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
        disabled={!isFormComplete() || !termsAccepted}
      >
        Create Account
      </button></div>
    </form>
    </div>
  );
}

export default SignupOwner;
