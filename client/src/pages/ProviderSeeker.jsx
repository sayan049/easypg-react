import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../components/footer";

function ProviderSeeker() {
  const location = useLocation();
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error === "auth_failed") {
      alert("Google authentication failed. Please try again.");
    } else if (error === "login_failed") {
      alert("Login failed. Please try again.");
    } else if (error) {
      alert(`Authentication failed: ${error}`);
    }

    document.title = "Choose Your Role | Messmate";
  }, [location.search]);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className="bg-gray-100">
      {/* SEO Metadata */}
      <Helmet>
        <title>Choose Your Role | Messmate</title>
        <meta
          name="description"
          content="Select your role to continue with Messmate - whether you're a mess owner or a student seeking PG/Mess services."
        />
        <link rel="canonical" href="https://messmate.com/choose-role" />
        <meta property="og:title" content="Choose Your Role | Messmate" />
        <meta
          property="og:description"
          content="Join Messmate and select your role as either a student or a mess owner to proceed."
        />
        <meta property="og:url" content="https://messmate.com/choose-role" />
        <meta property="og:image" content="https://messmate.com/assets/image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Main Container */}
      <div className="bg-custom-gradient flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 md:px-8 lg:px-20">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 text-center flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-[#2CA4B5] mb-4">Sign Up</h2>
          <h3 className="text-xl mb-6 text-gray-500">
            Please choose your role to proceed:
          </h3>
          <div className="flex flex-row items-center space-x-4">
            <Link
              to="/LoginUser"
              onClick={() => handleButtonClick("messSeeker")}
              className={`border-[3px] px-6 py-3 rounded-full ${
                selectedButton === "messSeeker"
                  ? "bg-[#2CA4B5] text-white hover:bg-transparent hover:text-[#2CA4B5] hover:border-[#2CA4B5]"
                  : "border-[#2CA4B5] text-[#2CA4B5] hover:bg-[#2CA4B5] hover:text-white hover:border-[#2CA4B5]"
              }`}
            >
              Mess Seeker
            </Link>
            <Link
              to="/LandingPage"
              onClick={() => handleButtonClick("messOwner")}
              className={`border-[3px] px-6 py-3 rounded-full ${
                selectedButton === "messOwner"
                  ? "bg-[#2CA4B5] text-white hover:bg-transparent hover:text-[#2CA4B5] hover:border-[#2CA4B5]"
                  : "border-[#2CA4B5] text-[#2CA4B5] hover:bg-[#2CA4B5] hover:text-white hover:border-[#2CA4B5]"
              }`}
            >
              Mess Owner
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <img
            src="/assets/image.png"
            alt="Illustration of students choosing between mess and PG roles"
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ProviderSeeker;
