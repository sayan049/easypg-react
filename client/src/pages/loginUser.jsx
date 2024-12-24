import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { loginUrl, baseurl } from "../constant/urls";

function LoginUser() {
  useEffect(() => {
    document.title = "Student login";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecked, setIsChecked] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Disable button after first click

  useEffect(() => {
    const storedMessage = localStorage.getItem("loginMessage");
    if (storedMessage) {
      setMessage(location.state?.message || "");
    }

    const timer = setTimeout(() => {
      setMessage("");
      localStorage.removeItem("loginMessage");
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state?.message]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    const jsonData = { email, password };

    try {
      setIsSubmitting(true); // Disable button during submission
      setIsButtonDisabled(true); // Disable button immediately

      const response = await axios.post(loginUrl, jsonData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        console.log("Response:", response.data);
        // navigate('/');
        // const token =getCookie('user_token');
        const userData = response.data.user; // Extracting the user data from the response
        const message = `Welcome ${userData.name}!`;

        // localStorage.setItem('token', token);
        localStorage.setItem("sId_message", message);
        navigate("/", { state: { message: message } });
        // Cookies.set('user', token);
        console.log("succesfully logged in");
        window.location.reload();
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

  const loginwithgoogle = () => {
    window.location.href =
      `${baseurl}/auth/google?state=` +
      encodeURIComponent(JSON.stringify({ type: "student" }));
  };
  useEffect(() => {
    setIsFormFilled(email && password);
  }, [email, password]);
  const isFormValid = isFormFilled && isChecked;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-custom-gradient">
      {/* Left Section */}
      <div className="flex-1 lg:w-8/12 flex items-center justify-center p-6">
        <div className="w-full max-w-lg p-8">
          {/* Header Section */}
          <div className="lg:absolute lg:top-6 lg:left-6 flex flex-col lg:flex-row items-center mb-2rem lg:items-start justify-center lg:space-x-2 space-y-2 lg:space-y-0 lg:items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2ca4b5]">
              Log in
            </h1>
            <h2 className="text-sm sm:text-lg font-normal text-center lg:text-left">
              User
            </h2>
          </div>

          {/* Create Account Text */}
          <h1 className="text-center text-lg font-semibold text-gray-700 mb-4 mt-4 lg:mt-0">
            Welcome to MessMate
          </h1>

          <form
            className="space-y-4"
            autoComplete="off"
            onSubmit={loginHandler}
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
                  {isPasswordVisible ? "👁️" : "🙈"}
                </button>
              </div>
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
              onClick={loginwithgoogle}
              className="w-full  flex items-center justify-center  py-2 rounded-full hover:bg-[#0511121a] bg-[#116e7b1a]"
            >
              <img
                src="../assets/googleicon.png"
                alt="Google"
                className="w-6 h-6 mr-2 text-gray-600"
              />
              <p> Log in with Google</p>
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signupforUser" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex lg:w-4/12 flex-col justify-center items-center bg-[#2ca4b53b] text-white p-12 relative">
        {/* Mess Mate Text */}
        <h1 className="text-xl font-bold absolute top-6 right-6">
          Mess <span className="">Mate</span>
        </h1>
        {/* Ellipse Image Below Mess Mate Text */}
        <img
          src="/assets/Ellipse.png"
          alt="Ellipse"
          className="absolute top-[5rem] right-6 max-w-[50%]"
          style={{ paddingTop: "10px" }}
        />

        {/* Find Your Nearest Mess Text with Gradient */}
        <div
          className="mt-2 text-5xl font-extrabold text-left flex flex-col mb-40 mr-16"
          style={{
            WebkitTextFillColor: "#0000",
            background:
              "linear-gradient(121deg, #2ca4b5 2.49%, #006d7b 59.71%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          <p>Find Your</p>
          <p>Nearest</p>
          <p>Mess</p>
        </div>
      </div>
    </div>
  );
}

export default LoginUser;
