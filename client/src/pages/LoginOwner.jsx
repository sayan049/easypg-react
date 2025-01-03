import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { loginOwnerUrl } from "../constant/urls";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../constant/urls";
import axios from "axios";

import "../designs/loginForMessOwner.css";

function LoginOwner() {
  useEffect(() => {
    document.title = "Pg owner login";
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Disable button after first click
  useEffect(() => {
    // Check if the message should be displayed based on localStorage
    const storedMessage = localStorage.getItem("loginMessageOwner");
    if (storedMessage) {
      setMessage(location.state?.message || "");
    }

    // Remove the message after 5 seconds
    const timer = setTimeout(() => {
      setMessage("");
      localStorage.removeItem("loginMessageOwner");
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state?.message]);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const loginHandlerOwner = async (event) => {
    event.preventDefault();
    console.log("clicked");
    const jsonData = {
      email: email,
      password: password,
    };
    try {
      setIsSubmitting(true); // Disable button during submission
      setIsButtonDisabled(true); // Disable button immediately
      const response = await axios.post(loginOwnerUrl, jsonData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        console.log("Response:", response.data);
        const userData = response.data.user;
        const message = `Welcome ${userData.name}!`;
        localStorage.setItem("sId_message", message);
        navigate("/", { state: { message: message } });

        console.log("succesfully logged in");
        window.location.reload();
      } else {
        console.error("Login failed", response.data);
      }
    } catch (error) {
      console.log("Error sending JSON data:", error);
    } finally {
      // Re-enable the button after 5 seconds
      setTimeout(() => {
        setIsButtonDisabled(false); // Re-enable the button
        setIsSubmitting(false); // Set submitting to false after 5 seconds
      }, 5000);
    }
  };

  const loginwithgoogleOwner = () => {
    window.location.href =
      `${baseurl}/auth/google-owner?state=` +
      encodeURIComponent(JSON.stringify({ type: "owner" }));
  };
  useEffect(() => {
    setIsFormFilled(email && password);
  }, [email, password]);
  const isFormValid = isFormFilled && isChecked;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-custom-gradient">
      {/* Left Section */}
      <div className="flex-1 lg:w-8/12 flex items-center justify-center p-6 flex-col">
        <div className="w-full max-w-lg p-8">
          {/* Header Section */}
          <div className="lg:absolute lg:top-6 lg:left-6 flex flex-col lg:flex-row items-center mb-2rem lg:items-start justify-center lg:space-x-2 space-y-2 lg:space-y-0 lg:items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2ca4b5] mobile-login-title">
              Log in
            </h1>
            <h2 className="text-sm sm:text-lg font-normal text-center lg:text-left">
              Owner
            </h2>
          </div>

          {/* Create Account Text */}
          <h1 className="text-center text-lg font-semibold text-gray-700 mb-4 mt-12 lg:mt-0">
            Grow your Business
          </h1>

          <form
            className="space-y-4"
            autoComplete="off"
            onSubmit={loginHandlerOwner}
          >
            {/* Hidden field trick to disable autofill */}
            <input
              type="text"
              name="hidden"
              style={{ display: "none" }}
              autoComplete="off"
            />

            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                  {isPasswordVisible ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              {/* Remember Me Checkbox */}
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4  border-gray-300 " />
                <span className="text-sm lg:text-sm text-gray-600 whitespace-nowrap">
                  Remember me
                </span>
              </label>

              {/* Forgot Password Link */}
              <a
                href="/forgot-password"
                className="text-sm lg:text-sm text-[#2ca4b5] hover:underline whitespace-nowrap"
              >
                Forgot Password?
              </a>
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
                I accept the Terms and Conditions
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={!isFormValid || isButtonDisabled || isSubmitting}
              className={`w-full py-2 rounded-full font-semibold transition tracking-wide ${
                isFormValid && !isSubmitting
                  ? "bg-[#2ca4b5] text-white hover:bg-[#238b96]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
            <div className="flex items-center justify-center text-gray-600 font-bold">
              Or
            </div>
            {/* google button */}
            <button
              type="button"
              onClick={loginwithgoogleOwner}
              className="w-full  flex items-center justify-center  py-2 rounded-full hover:bg-[#0511121a] bg-[#116e7b1a]"
            >
              <img
                src="../assets/googleicon.png"
                alt="Google"
                className="w-6 h-6 mr-2 text-gray-600"
              />
              <p> Log in with Google</p>
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link
                to="/signupOwner"
                className="text-[#2ca4b5] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex lg:w-4/12 flex-col justify-center items-center bg-login-owner text-white p-12 relative overflow-hidden">
        {/* Mess Mate Text */}
        <h1 className="text-xl font-bold absolute top-6 right-6">
          Mess <span className="">Mate</span>
        </h1>
        <h1 className="text-[13px] text-black  absolute top-11 right-[4.6rem]">
          Business
        </h1>

        {/* Find Your Nearest Mess Text with Gradient */}
        <div
          className="mt-2 text-5xl font-extrabold text-left flex flex-col mb-80 mr-16"
          style={{
            WebkitTextFillColor: "#0000",
            background:
              "linear-gradient(121deg, #2ca4b5 2.49%, #006d7b 59.71%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          <p>Grow Your</p>
          <p>Business</p>
          <p>With US</p>
        </div>
       
  <div className="h-[20rem] w-[3.5rem] bg-column-owner absolute transform rotate-[150deg] rounded-full top-[34rem] right-[0rem]"></div>



        <div  className="h-[23rem] w-[3.5rem] bg-column-owner absolute transform rotate-[150deg] rounded-full top-[22.5rem] right-[2rem]"></div>
        <div  className="h-[25.5rem] w-[3.5rem] bg-column-owner absolute transform rotate-[150deg] rounded-full top-[18rem] right-[0rem]"></div>
      </div>
    </div>
  );
}

export default LoginOwner;
