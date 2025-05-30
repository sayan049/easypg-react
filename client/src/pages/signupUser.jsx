import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signupUrl } from "../constant/urls";
import FlashMessage from "../components/flashMessage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Helmet } from "react-helmet";

function SignUpForm() {
  useEffect(() => {
    document.title = "Student Signup | Mess Mate";
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
        navigate("/login/user", { state: { message } });
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
    const accessKey = "68a31d8b92dae4068c349d4fa31681a2"; //mailboxlayer
    const url = `https://apilayer.net/api/check?access_key=${accessKey}&email=${email}&smtp=1&format=1`;

    try {
      const res = await axios.get(url);
    //  console.log(res.data, url, accessKey);
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
      }
    }

    if (!validateEmail()) {
      setEmailError("Email is not valid.");
    }

    setIsFormFilled(
      firstName && lastName && email && address && password && pin
    );
  }, [firstName, lastName, email, address, password, pin, validateEmail]);

  const isFormValid = isFormFilled && isChecked;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-custom-gradient">
      <Helmet>
        <title>Student Sign Up | Mess Mate - Find Your Nearest Mess</title>
        <meta
          name="description"
          content="Create your student account with Mess Mate to find and manage your nearest mess services."
        />
        <meta
          name="keywords"
          content="student signup, mess registration, find nearest mess, campus dining, user account"
        />
        <meta property="og:title" content="Student Sign Up | Mess Mate" />
        <meta
          property="og:description"
          content="Join Mess Mate to discover convenient meal solutions near your campus."
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://messmate.co.in/signup/user" />
        {/* Performance Hints */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </Helmet>
      
      {/* Left Section */}
      <main className="flex-1 lg:w-8/12 flex items-center justify-center p-6">
        <ToastContainer
          position="top-center"
          toastClassName="!w-[300px]  mx-auto mt-4 sm:mt-0 "
        />
        <section className="w-full max-w-lg p-8">
          {/* Header Section */}
          <header className="lg:absolute lg:top-6 lg:left-6 flex flex-col items-center lg:items-start space-y-2 lg:space-y-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2ca4b5]">
              Sign Up
            </h1>
            <h2 className="text-sm sm:text-lg font-normal text-center lg:text-left">
              User Registration
            </h2>
          </header>
          <article>
            <h1 className="text-center text-lg font-semibold text-gray-700 mb-4 mt-4 lg:mt-0">
              Create Student Account
            </h1>

            <form
              className="space-y-4"
              autoComplete="off"
              role="form"
              aria-label="Student registration form"
            >
              {/* Hidden field for autofill prevention */}
              <div style={{ display: "none" }}>
                <input type="text" name="hidden" autoComplete="off" />
              </div>

              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full">
                  <label htmlFor="first_name" className="sr-only">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                    autoComplete="given-name"
                    aria-required="true"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="last_name" className="sr-only">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                    autoComplete="family-name"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a] ${
                    emailError ? "border-red-500" : ""
                  }`}
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby="email-error"
                  aria-invalid={!!emailError}
                />
                {emailError && (
                  <p
                    id="email-error"
                    className="text-red-500 text-sm mt-1"
                    role="alert"
                  >
                    {emailError}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="address" className="sr-only">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Write your Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  autoComplete="street-address"
                  aria-required="true"
                />
              </div>

              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="relative flex-1">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                    autoComplete="new-password"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                  >
                    {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div className="flex-1">
                  <label htmlFor="pin" className="sr-only">
                    Pin Code
                  </label>
                  <input
                    id="pin"
                    type="text"
                    name="pin"
                    placeholder="Pin Code"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                    autoComplete="postal-code"
                    aria-required="true"
                  />
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
                  disabled={!isFormFilled}
                  aria-required="true"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#2ca4b5] hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#2ca4b5] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                onClick={signupHandler}
                disabled={!isFormValid || isButtonDisabled || isSubmitting}
                className={`w-full py-2 rounded-full font-semibold transition tracking-wide ${
                  isFormValid && !isSubmitting
                    ? "bg-[#2ca4b5] text-white hover:bg-[#238b96]"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                aria-label="Create student account"
              >
                {isSubmitting ? "Submitting..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login/user"
                className="text-[#2ca4b5] hover:underline"
                aria-label="Login to existing account"
              >
                Log in
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600 mt-4">
              Sign Up as a Mess Owner?{" "}
              <Link
                to="/signup/choose-role"
                className="text-[#2ca4b5] hover:underline"
                aria-label="Login to existing account"
              >
                Choose Role
              </Link>
            </p>
          </article>
        </section>
      </main>

      {/* Right Section */}
      <aside className="hidden lg:flex lg:w-4/12 flex-col justify-center items-center bg-new-gradient text-white p-12 relative">
        {/* Mess Mate Text */}
        <h1 className="text-xl font-bold absolute top-2 right-6">
          <div className="inline-flex items-center text-5xl font-bold space-x-1">
            <img
              src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp"
              alt="MessMate - company Logo"
              className="mr-[-4px]"
              loading="lazy"
            />
            <div className="text-3xl font-bold text-[#2CA4B5] mt-[20px] ml-[-10px]">
              essMate
            </div>
          </div>
        </h1>
        {/* Ellipse Image Below Mess Mate Text */}
        <img
          src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746707192/ellipse-681ca2ee22495_m87gbv.webp"
          alt="MessMate Visual Element"
          className="absolute top-[5rem] right-6 max-w-[42%]"
          style={{ paddingTop: "10px" }}
          loading="lazy"
        />

        {/* Find Your Nearest Mess Text with Gradient */}
        <p
          className="mt-2 text-2xl font-bold text-[35px] text-center"
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
          to="/login/user"
          className="mt-6 bg-[#2ca4b5] text-white font-bold py-2 px-6 rounded-full hover:bg-[#238b96] transition w-[12rem] text-center"
        >
          Log In
        </Link>

        {/* Bottom Ellipse Image at Left Bottom Corner */}
        <img
          src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746711134/bottom-ellipse-681cb24b7da9c_mughir.webp"
          alt="Messmate Visual Element"
          className="absolute bottom-6 left-6 max-w-[25%]"
          loading="lazy"
        />
      </aside>
    </div>
  );
}

export default SignUpForm;
