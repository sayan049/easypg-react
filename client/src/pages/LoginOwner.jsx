import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  baseurl,
  loginOwnerUrl,
  forgotPasswordOwnerUrl,
  resetPasswordOwnerUrl,
  tokenVerifyOwnerUrl,
} from "../constant/urls";
import "../designs/loginForMessOwner.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import debounce from "lodash.debounce";

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

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [resetToken, setResetToken] = useState(""); // State for reset token
  const [tokenValid, setTokenValid] = useState(null); // State for token validity
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [resetPasswordError, setResetPasswordError] = useState(""); // Error state for reset password
  const [loading, setLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false); // State to track email sending status
  const [searchParams] = useSearchParams();
  const [isEmailVerified, setIsEmailVerified] = useState(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("resetToken");
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      verifyResetToken(tokenFromUrl);
    } else {
      setLoading(false); // Stop loading if no token
    }
  }, [searchParams]);
  const verifyResetToken = async (token) => {
    try {
      const response = await axios.get(
        tokenVerifyOwnerUrl.replace(":resetToken", token)
      );

      setTokenValid(response.status === 200);
    } catch (error) {
      console.error("Error verifying reset token:", error);
      toast.error("Invalid or expired token. Please try again.");
      setTokenValid(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if the message should be displayed based on localStorage
    const storedMessage = localStorage.getItem("loginMessageOwner");
    if (storedMessage) {
      setMessage(location.state?.message || "");
      toast.success(location.state?.message || storedMessage);
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

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const loginHandlerOwner = async (event) => {
    event.preventDefault();
    console.log("clicked");
    const jsonData = {
      email: email,
      password: password,
    };
    const deviceInfo = navigator.userAgent || "Unknown Device";
    try {
      setIsSubmitting(true); // Disable button during submission
      setIsButtonDisabled(true); // Disable button immediately
      const response = await axios.post(loginOwnerUrl, jsonData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-Device-Info": deviceInfo,
        },
      });
      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;

        // Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // const message = `Welcome ${userData.name}!`;
        // localStorage.setItem("sId_message", message);
        localStorage.setItem("sId_message", "Successfully logged in");
        // navigate("/");
        navigate("/", { state: { message: "succesfully logged in" } });

        console.log("succesfully logged in");
        window.location.reload();
      } else {
        console.error("Login failed", response.data);
        toast.error("Login failed. Please check your credentials.");
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
    } finally {
      // Re-enable the button after 5 seconds
      setTimeout(() => {
        setIsButtonDisabled(false); // Re-enable the button
        setIsSubmitting(false); // Set submitting to false after 5 seconds
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
          `${baseurl}/auth/check-email-verification-owner?email=${encodeURIComponent(
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
      const response = await axios.post(
        `${baseurl}/auth/resend-verification-owner`,
        {
          email,
        }
      );
      toast.success("Verification email sent successfully!");
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsSendingVerification(false);
    }
  };
  const loginwithgoogleOwner = () => {
    const deviceInfo = navigator.userAgent; // Capture device info (e.g., user agent)
    const state = JSON.stringify({ type: "owner", device: deviceInfo }); // Add device info in the state
    window.location.href =
      `${baseurl}/auth/google-owner?state=` + encodeURIComponent(state); // Send the state with device info
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
      setIsSendingEmail(true); // Set loading state
      const response = await axios.post(forgotPasswordOwnerUrl, {
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
      toast.error("Error sending email. Please try again.");
    } finally {
      setTimeout(() => {
        setIsSendingEmail(false); // Reset loading state after 5 seconds
      }, 5000);
    }
  };
  const submitResetPassword = async () => {
    if (!resetToken || !newPassword || newPassword !== confirmPassword) {
      setResetPasswordError("Passwords do not match or invalid token.");
      toast.error("Passwords do not match or invalid token.");
      return;
    }

    try {
      const response = await axios.post(
        resetPasswordOwnerUrl,
        { token: resetToken, password: newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Password successfully reset! Redirecting to login...");
        //toast.success("Password successfully reset! Redirecting to login...");
        setResetToken(null);
        navigate("/LoginOwner"); // Redirect to login page
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
      <ToastContainer
        position="top-center"
        toastClassName="!w-[300px]   mx-auto mt-4 sm:mt-0 "
      />
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

            <div className="relative">
              <input
                type="email"
                name="email"
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
                className="text-sm lg:text-sm text-[#2ca4b5] hover:underline whitespace-nowrap"
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
                src="/assets/googleIcon.png"
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

        <div className="h-[23rem] w-[3.5rem] bg-column-owner absolute transform rotate-[150deg] rounded-full top-[22.5rem] right-[2rem]"></div>
        <div className="h-[25.5rem] w-[3.5rem] bg-column-owner absolute transform rotate-[150deg] rounded-full top-[18rem] right-[0rem]"></div>
      </div>

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

export default LoginOwner;
