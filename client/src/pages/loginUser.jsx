import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  loginUrl,
  forgotPasswordUserUrl,
  resetPasswordUserUrl,
  tokenVerifyUserUrl,
  baseurl,
} from "../constant/urls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

function LoginUser() {
  useEffect(() => {
    document.title = "User Login | Messmate";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecked, setIsChecked] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [resetToken, setResetToken] = useState(""); // State for reset token
  const [tokenValid, setTokenValid] = useState(null); // State for token validity
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [resetPasswordError, setResetPasswordError] = useState(""); // Error state for reset password
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [isEmailVerified, setIsEmailVerified] = useState(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const {setCurrentAccessToken}=useAuth

  const messageLoc = location.state?.message;


  useEffect(() => {
    toast.success(messageLoc);
    const tokenFromUrl = searchParams.get("resetToken");
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      verifyResetToken(tokenFromUrl);
    } else {
      setLoading(false); // Stop loading if no token
    }
  }, [searchParams, messageLoc]);

  const verifyResetToken = async (token) => {
    try {
      const response = await axios.get(
        tokenVerifyUserUrl.replace(":resetToken", token)
      );

      setTokenValid(response.status === 200);
    } catch (error) {
      console.error("Error verifying reset token:", error);
      setTokenValid(false);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    const jsonData = { email, password };
    const deviceInfo = navigator.userAgent || "Unknown Device";
    if (isEmailVerified === false) {
      toast.error("Please verify your email before logging in");
      return;
    }
    try {
      setIsSubmitting(true);
      setIsButtonDisabled(true);

      // Make login request with credentials (no need for cookies anymore)
      const response = await axios.post(loginUrl, jsonData, {
        headers: {
          "Content-Type": "application/json",
          "X-Device-Info": deviceInfo,
        },
        withCredentials: true, // ✅ Important: send cookies!
      });

      if (response.status === 200) {
        const userData = response.data.user;
        const { accessToken, refreshToken } = response.data;

        // Store tokens in localStorage
        // localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);
        // ✅ Store accessToken in memory (state)
        setCurrentAccessToken(accessToken); // e.g., using React state, Redux, etc.

        // Optionally store user info in state or localStorage if needed

        // const message = Welcome ${userData.name}!;
        // Navigate to homepage or another page after successful login
        localStorage.setItem("sId_message", "Successfully logged in");
        // navigate("/");
        navigate("/", { state: { message: "succesfully logged in" } });
        window.location.reload();
      }
    } catch (error) {
      console.log("Error sending JSON data:", error);
      let errorMsg = "Login failed. Please try again.";

      // Check if the error response exists and handle specific cases
      if (error.response) {
        const res = error.response;

        // Check for specific error messages from the backend
        if (res.data.message) {
          errorMsg = res.data.message; // e.g., "Invalid email or password."
        } else if (res.data.errors) {
          errorMsg = res.data.errors.join(", "); // Join multiple errors if present
        }
      } else if (error.request) {
        errorMsg = "Server not responding. Check your internet.";
      } else {
        errorMsg = "Error: " + error.message; // Default error message
      }

      // Log the error and show the toast
      console.error("Error details:", error);
      toast.error(errorMsg);
      console.log("Error:", error.response?.data?.message, errorMsg);
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
        setIsSubmitting(false);
      }, 5000);
    }
  };
  const checkEmailVerification = useCallback(
    debounce(async (email) => {
      if (!email) {
        setIsEmailVerified(null);
        return;
      }

      try {
        setIsCheckingVerification(true);
        const response = await axios.get(
          `${baseurl}/auth/check-email-verification?email=${encodeURIComponent(
            email
          )}`
        );
        setIsEmailVerified(response.data.verified);
      } catch (error) {
        console.error("Error checking email verification:", error);
        setIsEmailVerified(null);
      } finally {
        setIsCheckingVerification(false);
      }
    }, 500),
    []
  );

  // Single optimized effect for all verification checks
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "verificationCompleted" && e.newValue === "true") {
        const storedEmail = localStorage.getItem("verificationEmail");
        if (storedEmail === email) {
          // Immediately update UI and clear storage
          setIsEmailVerified(true);
          localStorage.removeItem("verificationCompleted");
          localStorage.removeItem("verificationEmail");
          // Optionally verify with server if needed
          checkEmailVerification(email);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Initial check when email changes
    if (email) {
      checkEmailVerification(email);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      checkEmailVerification.cancel();
    };
  }, [email, checkEmailVerification]);

  const resendVerificationEmail = async () => {
    try {
      setIsSendingVerification(true);
      localStorage.setItem("verificationEmail", email);
      const response = await axios.post(`${baseurl}/auth/resend-verification`, {
        email,
      });
      toast.success("Verification email sent successfully!");
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsSendingVerification(false);
    }
  };

  const loginwithgoogle = () => {
    const deviceInfo = navigator.userAgent; // You can capture any other device info as needed
    const state = JSON.stringify({ type: "student", device: deviceInfo });
    window.location.href = `${baseurl}/auth/google?state=${encodeURIComponent(
      state
    )}`;
  };

  const openForgotPassword = () => {
    setIsForgotPasswordOpen(true);
  };

  const closeForgotPassword = () => {
    setIsForgotPasswordOpen(false);
    setForgotPasswordMessage("");
  };

  const submitForgotPassword = async () => {
    try {
      setIsSendingEmail(true);
      const response = await axios.post(forgotPasswordUserUrl, {
        email: forgotEmail,
      });
      if (response.status === 200) {
        setForgotPasswordMessage("Password reset email sent!");
        toast.success("Password reset email sent!");
        setIsForgotPasswordOpen(false);
      } else {
        setForgotPasswordMessage("Error sending email. Please try again.");
        toast.error("Error sending email. Please try again.");
      }
    } catch (error) {
      setForgotPasswordMessage("Error sending email. Please try again.");
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
      toast.error("Error sending email. Please try again.");
    } finally {
      setTimeout(() => {
        setIsSendingEmail(false);
      }, 5000);
    }
  };

  // Function to submit the reset password
  const submitResetPassword = async () => {
    if (!resetToken || !newPassword || newPassword !== confirmPassword) {
      setResetPasswordError("Passwords do not match or invalid token.");
      toast.error("Passwords do not match or invalid token.");
      return;
    }

    try {
      const response = await axios.post(
        resetPasswordUserUrl,
        { token: resetToken, password: newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Password successfully reset! Redirecting to login...");
        setResetToken(null);
        navigate("/login/user"); // Redirect to login page
      } else {
        setResetPasswordError("Error resetting password. Please try again....");
        toast.error("Error resetting password. Please try again.");
      }
    } catch (error) {
      setResetPasswordError("Error resetting password. Please try again.");
      toast.error("Error resetting password. Please try again.");
    }
  };

  useEffect(() => {
    setIsFormFilled(email && password);
  }, [email, password]);

  const isFormValid = isFormFilled && isChecked;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-custom-gradient">
      <Helmet>
        <html lang="en-IN" />
        <title>User Login | Messmate</title>

        {/* Basic Meta */}
        <meta
          name="description"
          content="Securely access your MessMate user account. Log in to access your Messmate dashboard and manage bookings and profile. Official user portal for MessMate users."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.messmate.co.in/login/user" />

        {/* Open Graph (for link sharing previews) */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.messmate.co.in/login/user"
        />
        <meta property="og:title" content="User Login | Messmate" />
        <meta
          property="og:description"
          content="Log in to your MessMate account and manage bookings, profile, and more. Secure portal for students and users."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/og-login.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@MessMate" />
        <meta name="twitter:title" content="User Login | Messmate" />
        <meta
          name="twitter:description"
          content="Securely log in to your MessMate account to manage bookings and your profile."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/og-login.jpg"
        />

        {/* Performance Hints */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </Helmet>

      <ToastContainer
        position="top-center"
        toastClassName="!w-[300px]  mx-auto mt-4 sm:mt-0 "
      />

      {/* Left Section */}
      <div className="flex-1 lg:w-8/12 flex items-center justify-center p-6">
        <div className="w-full max-w-lg p-8">
          {/* Header Section */}
          <div className="lg:absolute lg:top-6 lg:left-6 flex flex-col lg:flex-row items-center mb-2rem lg:items-start justify-center lg:space-x-2 space-y-2 lg:space-y-0 lg:items-center">
            <main>
              <h1 className="text-3xl font-bold text-[#2ca4b5] text-center sm:text-left">
                User Login
              </h1>

              <h2 className="text-sm sm:text-lg font-normal flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2ca4b5]" />
                Secure Account Access
              </h2>
            </main>
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

            <div className="relative">
              <input
                type="email"
                name="email"
                aria-label="Enter your email address"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a] pr-24 sm:pr-32" // Added padding-right
                autoComplete="off"
              />
              {isCheckingVerification && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
              {!isCheckingVerification && isEmailVerified === false && (
                <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline text-red-500 text-xs whitespace-nowrap">
                    Unverified
                  </span>
                  <button
                    type="button"
                    onClick={resendVerificationEmail}
                    disabled={isSendingVerification}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300 whitespace-nowrap"
                  >
                    {isSendingVerification ? "Sending..." : "Verify"}
                  </button>
                </div>
              )}

              {!isCheckingVerification && isEmailVerified === true && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
                  <span className="text-green-500 text-xs flex items-center">
                    Verified{" "}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="relative flex-1">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  aria-label="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
                  autoComplete="new-password"
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
            </div>
            <div className="flex items-center justify-between mt-4">
              {/* Remember Me Checkbox */}
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4  border-gray-600 " />
                <span className="text-sm lg:text-sm text-gray-600 whitespace-nowrap">
                  Remember me
                </span>
              </label>

              {/* Forgot Password Link */}
              <a
                className="text-sm lg:text-sm text-[#2ca4b5] hover:underline whitespace-nowrap "
                onClick={openForgotPassword}
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
                src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746707078/googleicon-681ca27c6648e_u81c8k.webp"
                alt="Log in with Google Account - MessMate user login Portal"
                className="w-6 h-6 mr-2 text-gray-600"
                loading="lazy"
              />
              <p> Log in with Google</p>
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup/user" className="text-[#2ca4b5] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <aside className="hidden lg:flex lg:w-4/12 flex-col justify-center items-center bg-[#2ca4b53b] text-white p-12 relative">
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
          className="absolute top-[5rem] right-6 max-w-[50%]"
          style={{ paddingTop: "10px" }}
          fetchpriority="high"
          loading="lazy"
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
      </aside>
      {isForgotPasswordOpen && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl w-[22rem] p-6">
            <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
            />
            <button
              onClick={submitForgotPassword}
              disabled={!forgotEmail || isSendingEmail}
              className={`w-full bg-[#2ca4b5] text-white py-2 rounded-full mt-4 ${
                !forgotEmail ? "bg-gray-300 cursor-not-allowed" : ""
              }`}
            >
              {isSendingEmail ? "Sending..." : "Send Reset Email"}
            </button>
            <p className="text-center text-sm text-gray-600 mt-2">
              {/* {forgotPasswordMessage} */}
            </p>
            <button
              onClick={closeForgotPassword}
              className="w-full bg-gray-300 text-black py-2 rounded-full mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Form */}
      {resetToken && tokenValid && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl w-[22rem] p-6">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

            {/* New Password Input */}
            <div className="relative">
              <input
                type={isNewPasswordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full rounded-full px-4 py-2 mb-4 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-4 top-[37%] transform -translate-y-1/2 text-gray-500"
              >
                {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full rounded-full px-4 py-2 mb-4 focus:outline-none focus:ring focus:ring-[#2ca4b5] bg-[#116e7b1a]"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-[37%] transform -translate-y-1/2 text-gray-500"
              >
                {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {resetPasswordError && (
              <p className="text-red-500 text-sm mb-4">{resetPasswordError}</p>
            )}

            <button
              onClick={submitResetPassword}
              className={`w-full bg-[#2ca4b5] text-white py-2 rounded-full mt-4 ${
                !newPassword || !confirmPassword
                  ? "bg-gray-300 cursor-not-allowed"
                  : ""
              }`}
            >
              Reset Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginUser;
