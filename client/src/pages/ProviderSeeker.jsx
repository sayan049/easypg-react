import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import "../designs/provider-seeker-page.css";
// import "../designs/footerstyle.css";
import Footer from "../components/footer";

const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get("error");

if (error === "auth_failed") {
  alert("Google authentication failed. Please try again.");
} else if (error === "login_failed") {
  alert("Login failed. Please try again.");
}

if (error) {
  alert(`Authentication failed: ${error}`); // Show a user-friendly error message
}

function ProviderSeeker() {
  useEffect(() => {
    document.title = "Choose your role";
  }, []);

  return (
    <div className="bg-gray-100">
      {/* Main Container */}
      <div className="bg-custom-gradient flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 md:px-8 lg:px-20">
        {/* Left Container */}
        <div className="w-full lg:w-1/2 text-center ">
          <h2 className="text-4xl font-bold text-[#2CA4B5] mb-4">Sign Up</h2>
          <h3 className="text-xl mb-6">Who are you?</h3>
          <div className="flex flex-col items-center  space-y-4">
            <Link
              to="/LoginUser"
              className="border-[3px] border-transparent bg-[#2CA4B5] text-white px-6 py-3 rounded-full hover:bg-transparent hover:text-[#2CA4B5] hover:border-[3px] hover:border-[#2CA4B5] "
            >
              Mess Seeker
            </Link>
            <Link
              to="/LandingPage"
              className=" border-[3px] border-[#2CA4B5] text-[#2CA4B5] px-6 py-3 rounded-full hover:bg-[#2CA4B5] hover:text-white"
            >
              Mess Owner
            </Link>
          </div>
        </div>

        {/* Right Container */}
        <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <img
            src="./assets/image.png"
            alt="sweet-home"
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default ProviderSeeker;
