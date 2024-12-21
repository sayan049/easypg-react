import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import "../designs/provider-seeker-page.css";
// import "../designs/footerstyle.css";

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
          <h2 className="text-4xl font-bold text-cyan-500 mb-4">Sign Up</h2>
          <h3 className="text-xl mb-6">Who are you?</h3>
          <div className="flex flex-col items-center  space-y-4">
            <Link
              to="/LoginUser"
              className="bg-cyan-500 text-white px-6 py-3 rounded-full shadow hover:bg-cyan-600"
            >
              Mess Seeker
            </Link>
            <Link
              to="/LandingPage"
              className="border-3 border-cyan-500 text-cyan-500 px-6 py-3 rounded-full shadow hover:bg-cyan-500 hover:text-white"
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
      <footer className="bg-cyan-400 text-white py-10 text-xs">
        <div className="container mx-auto grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Easy <span className="font-bold">Pg</span></h3>
            {/* <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus nobis
              sequi expedita possimus vel reprehenderit nulla, atque reiciendis ex fugit quod.
            </p> */}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Company</h2>
            <ul className="space-y-2">
              {['Careers', 'About Us', 'For Partners', 'Terms', 'Privacy Policy', 'Contact Us'].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Support</h2>
            <ul className="space-y-2">
              {['FAQe', 'Contact Us'].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Link</h2>
            <ul className="space-y-2">
              {['Terms', 'Privacy Policy'].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-sm">Copyright 2024 - All Right Reserved by <span className="font-bold">Easypg.pv.ltd</span></p>
        </div>
      </footer>
    </div>
  );
}

export default ProviderSeeker;
