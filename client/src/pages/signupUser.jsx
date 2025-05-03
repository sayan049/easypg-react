import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signupUrl } from "../constant/urls";
import FlashMessage from "../components/flashMessage";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff } from "react-icons/fi";

function SignUpForm() {
  useEffect(() => {
    document.title = "Student Signup";
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Disable button after first click
  //const [message, setmessage] = useState({ Text: "", type: "" }); // State to manage flash message
  const [emailError, setEmailError] = useState("");


  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const signupHandler = async () => {

    if (isButtonDisabled) return;

    const jsonData = { firstName, lastName, email, address, password, pin };

    try {
      setIsSubmitting(true);
      setIsButtonDisabled(true);

      const response = await axios.post(signupUrl, jsonData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        const message = "User registration successful";
        localStorage.setItem("loginMessage", message);
        navigate("/LoginUser", { state: { message } });
      } else {
       // setmessage({ text: "Signup failed", type: "error" });
       toast.error("Signup failed. Try again."); 
      }
    } catch (error) {
      let errorMsg = "Signup failed. Try again.";
      if (error.response) {
        const res = error.response;
        if (res.data.message) errorMsg = res.data.message;
        else if (res.data.errors) errorMsg = res.data.errors.join(", ");
      } else if (error.request) {
        errorMsg = "Server not responding. Check your internet.";
      } else {
        errorMsg = "Error: " + error.message;
      }
      toast.error(errorMsg); //not working
      //setmessage({ text: errorMsg, type: "error" });

      // Re-enable button after 2s
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = async (email) => {
    const accessKey = "68a31d8b92dae4068c349d4fa31681a2";  //mailboxlayer
    const url = `https://apilayer.net/api/check?access_key=${accessKey}&email=${email}&smtp=1&format=1`;
  
    try {
      const res = await axios.get(url);
      console.log(res.data,url,accessKey);
      return true;
    } catch (err) {
      console.error("Error validating email:", err);
      return false;
    }
  };

  

  useEffect(() => {

    if (email) {
      const emailValid = /\S+@\S+\.\S+/.test(email);
      if (!emailValid) {
        setEmailError("Invalid email format.");
        return;
      } else {
        setEmailError("");

      }}

      if(!validateEmail()){
        setEmailError("Email is not valid.");

      }
   
   

    setIsFormFilled(
      firstName && lastName && email && address && password && pin
    );
  }, [firstName, lastName, email, address, password, pin ,validateEmail]);

  const isFormValid = isFormFilled && isChecked;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-custom-gradient">
      {/* <ToastContainer /> */}
      {/* Left Section */}
      <div className="flex-1 lg:w-8/12 flex items-center justify-center p-6">
      <ToastContainer position="top-center" toastClassName="!w-[300px]  mx-auto mt-4 sm:mt-0 "  />
        <div className="w-full max-w-lg p-8">
          {/* Header Section */}
          <div className="lg:absolute lg:top-6 lg:left-6 flex flex-col items-center lg:items-start space-y-2 lg:space-y-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2ca4b5]">
              Sign Up
            </h1>
            <h2 className="text-sm sm:text-lg font-normal text-center lg:text-left">
              User
            </h2>
          </div>

          {/* Create Account Text */}
          <h1 className="text-center text-lg font-semibold text-gray-700 mb-4 mt-4 lg:mt-0">
            Create Account
          </h1>

          <form className="space-y-4" autoComplete="off">
            {/* Hidden field trick to disable autofill */}
            <input
              type="text"
              name="hidden"
              style={{ display: "none" }}
              autoComplete="off"
            />

            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                autoComplete="off"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                autoComplete="off"
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-sm">{emailError}</p>)}
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a] ${
                emailError ? "border-red-500" : ""
              }`}
              autoComplete="off"
            />
            <input
              type="text"
              name="address"
              placeholder="Write your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
              autoComplete="off"
            />
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="relative flex-1">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                   {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <input
                type="text"
                name="pin"
                placeholder="Pin Code"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="flex-1 rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                autoComplete="off"
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="h-4 w-4 border-gray-300 rounded"
                disabled={!isFormFilled} // Disable checkbox until the form is filled
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Check all the Terms & Condition and Privacy Policy
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="button"
              onClick={signupHandler}
              disabled={!isFormValid || isButtonDisabled || isSubmitting}
              className={`w-full py-2 rounded-full font-semibold transition tracking-wide ${
                isFormValid && !isSubmitting
                  ? "bg-[#2ca4b5] text-white hover:bg-[#238b96]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Do you have an account?{" "}
            <Link to="/LoginUser" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex lg:w-4/12 flex-col justify-center items-center bg-new-gradient text-white p-12 relative">
        {/* Mess Mate Text */}
        <h1 className="text-xl font-bold absolute top-6 right-6">
          Mess <span className="text-blue-200">Mate</span>
        </h1>
        {/* Ellipse Image Below Mess Mate Text */}
        <img
          src="/assets/Ellipse.png"
          alt="Ellipse"
          className="absolute top-[5rem] right-6 max-w-[42%]"
          style={{ paddingTop: "10px" }}
        />

        {/* Find Your Nearest Mess Text with Gradient */}
        <p
          className="mt-2 text-lg font-bold text-[35px] text-center"
          style={{
            WebkitTextFillColor: "#0000",
            background:
              "linear-gradient(121deg, #2ca4b5 2.49%, #006d7b 59.71%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          Find Your Nearest Mess
        </p>

        {/* Log In Button */}
        <Link
          to="/LoginUser"
          className="mt-6 bg-[#2ca4b5] text-white font-bold py-2 px-6 rounded-full hover:bg-[#238b96] transition w-[12rem] text-center"
        >
          Log In
        </Link>

        {/* Bottom Ellipse Image at Left Bottom Corner */}
        <img
          src="/assets/bottom-ellipse.png"
          alt="Bottom Ellipse"
          className="absolute bottom-6 left-6 max-w-[25%]"
        />
      </div>
    </div>
  );
}

export default SignUpForm;
