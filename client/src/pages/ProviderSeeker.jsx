import React, { useEffect, useState } from "react";
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
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className="bg-gray-100">
      {/* Main Container */}
      <div className="bg-custom-gradient flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 md:px-8 lg:px-20">
        {/* Left Container */}
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
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import Footer from "../components/footer";

// const ProviderSeeker = () => {
//   const [selectedButton, setSelectedButton] = useState("messSeeker");
//   const [hoveredButton, setHoveredButton] = useState(null);

//   const handleButtonClick = (buttonName) => {
//     setSelectedButton(buttonName);
//   };

//   return (
//     <div className="bg-gray-100">
//       {/* Main Container */}
//       <div className="bg-custom-gradient flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 md:px-8 lg:px-20">
//         {/* Left Container */}
//         <div className="w-full lg:w-1/2 text-center flex flex-col items-center justify-center">
//           <h2 className="text-4xl font-bold text-[#2CA4B5] mb-4">Sign Up</h2>
//           <h3 className="text-xl mb-6 text-gray-500">
//             Please choose your role to proceed:
//           </h3>
//           <div className="flex flex-row items-center space-x-4">
//             {/* Mess Seeker Button */}
//             <Link
//               to="/LoginUser"
//               onClick={() => handleButtonClick("messSeeker")}
//               onMouseEnter={() => setHoveredButton("messSeeker")}
//               onMouseLeave={() => setHoveredButton(null)}
//               className={`border-[3px] px-6 py-3 rounded-full transition-all duration-300 ${
//                 (selectedButton === "messSeeker" && hoveredButton !== "messSeeker") || hoveredButton === "messOwner"
//                   ? "bg-[#2CA4B5] text-white"
//                   : "border-[#2CA4B5] text-[#2CA4B5]"
//               }`}
//             >
//               Mess Seeker
//             </Link>

//             {/* Mess Owner Button */}
//             <Link
//               to="/LandingPage"
//               onClick={() => handleButtonClick("messOwner")}
//               onMouseEnter={() => setHoveredButton("messOwner")}
//               onMouseLeave={() => setHoveredButton(null)}
//               className={`border-[3px] px-6 py-3 rounded-full transition-all duration-300 ${
//                 (selectedButton === "messOwner" && hoveredButton !== "messOwner") || hoveredButton === "messSeeker"
//                   ? "bg-[#2CA4B5] text-white"
//                   : "border-[#2CA4B5] text-[#2CA4B5]"
//               }`}
//             >
//               Mess Owner
//             </Link>
//           </div>
//         </div>

//         {/* Right Container */}
//         <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0">
//           <img
//             src="./assets/image.png"
//             alt="sweet-home"
//             className="max-w-full h-auto"
//           />
//         </div>
//       </div>

//       {/* Footer Section */}
//       <Footer />
//     </div>
//   );
// };

// export default ProviderSeeker;









