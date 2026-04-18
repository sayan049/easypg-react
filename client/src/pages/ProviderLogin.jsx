import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../components/footer";

function ProviderSeekerLogin() {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
        
        <html lang="en-IN" />
        <title>Choose Your Role | Messmate - Find or List PG/Mess</title>
        <meta
          name="description"
          content="Choose your role to get started with Messmate — India's smart platform for students to find PG/Mess and owners to list accommodations easily."
        />
        <link rel="canonical" href="https://www.messmate.co.in/login/choose-role" />

        {/* Open Graph (Facebook, LinkedIn, etc.) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Messmate" />
        <meta
          property="og:title"
          content="Choose Your Role | Messmate - Find or List PG/Mess"
        />
        <meta
          property="og:description"
          content="Select whether you're a student searching for PG/Mess or an owner listing your accommodation. Messmate makes it seamless."
        />
        <meta
          property="og:url"
          content="https://www.messmate.co.in/login/choose-role"
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746794665/main-681df86fe504d_ltnvdn.webp"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Choose Your Role | Messmate" />
        <meta
          name="twitter:description"
          content="Start your Messmate journey by selecting your role — student or PG/Mess owner."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746794665/main-681df86fe504d_ltnvdn.webp"
        />
        {/* Performance Hints */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </Helmet>

      {/* Main Container */}
      <div className="bg-custom-gradient flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 md:px-8 lg:px-20">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 text-center flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-[#2CA4B5] mb-4">Log In</h2>
          <h3 className="text-xl mb-6 text-gray-500">
            Please choose your role to proceed:
          </h3>
          <div className="flex flex-row items-center space-x-4">
            <Link
              to="/login/user"
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
              to="/login/owner"
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
            src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748606537/ChatGPT_Image_May_30__2025__05_23_25_PM-removebg-preview_yhd5hj.png"
            alt="Illustration of students choosing between mess and PG roles"
            className="max-w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ProviderSeekerLogin;
