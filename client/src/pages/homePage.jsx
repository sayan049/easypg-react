// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// import "../designs/style.css";
// import FlashMessage from "../components/flashMessage";
// import UserProfile from "../components/UserProfile";
// import "../designs/UserProfile.css";

// import { useAuth } from "../contexts/AuthContext";

// function HomePage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [message, setMessage] = useState("");
//   const [searchItem, setSearchItem] = useState("");
//   // const [IsAuthenticated, setIsAuthenticated] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [logoutStatus, setLogoutStatus] = useState("");
//   const { userName, IsAuthenticated, handleLogout, logoutSuccess,isOwnerAuthenticated,ownerName } = useAuth();
 

//   useEffect(() => {
//     document.title = "Find your nearest paying guest";
//   }, []);

//   const performSearch = () => {
//     alert("Searching for: " + searchItem);
//     navigate("/MessFind");
//   };

//   useEffect(() => {
//     const storedMessage = localStorage.getItem("sId_message");
//     if (storedMessage) {
//       setMessage(location.state?.message || "");
//     }

//     const timer = setTimeout(() => {
//       setMessage("");
//       localStorage.removeItem("sId_message");
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [location.state?.message]);

//   useEffect(() => {
//     if (IsAuthenticated ) {
//       try {
//         // Decode token

//         console.log("user name:", userName);
//       }
//        catch (error) {
//         console.error("Error decoding or accessing token:", error);
//       }
//     }else if(isOwnerAuthenticated){
//       try {
//         // Decode token

//         console.log("user name:", ownerName);
       
//       }
//        catch (error) {
//         console.error("Error decoding or accessing token:", error);
//       }
//     }
//      else {
//       console.error("Token is not present in cookies");
//     }
//   }, [IsAuthenticated, userName,isOwnerAuthenticated,ownerName]);
//   useEffect(() => {
//     const storedLogoutStatus = localStorage.getItem("logoutStatus");
//     if (storedLogoutStatus) {
//       setLogoutStatus(storedLogoutStatus);
//       setTimeout(() => {
//         localStorage.removeItem("logoutStatus");
//         setLogoutStatus(""); // Clear the state as well
//       }, 5000);
//     }
//   }, []);
//   const handleLogoutClick = () => {
//     handleLogout();
//   };

//   return (
//     <body>
//       <section className="first-section">
//         <header>
//           <div className="Container">
//             <div className="easypg">
//               Easy<span className="nunu">Pg</span>
//             </div>
//             <div className="mid_div">
//               <div className="home">Home</div>
//               <div className="about">About</div>
//               <div className="service">Service</div>
//               <div className="contact_us">Contact us</div>
//             </div>
//             {IsAuthenticated || isOwnerAuthenticated ? (
//               <>
//                 <div
//                   className="imageProfile"
//                   onClick={() => setShowDropdown(!showDropdown)}
//                 >
//                   <UserProfile />

//                   <div className="dropdown-content">
//                     <p className=""  > <Link  style={{fontSize:"16  px"}} to="/UserDashboard">Profile</Link></p>
//                     <hr className="HR" />
//                     <p className="logoutuser" onClick={handleLogoutClick}>
//                       Log Out
//                     </p>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="login-box">
//                 <p className="login-text">
//                   {" "}
//                   <Link
//                     style={{
//                       textDecoration: "none",
//                       color: "white",
//                       fontSize: "14px",
//                     }}
//                     to="/ProviderSeeker"
//                   >
//                     Login
//                   </Link>
//                 </p>
//               </div>
//             )}
//           </div>
//         </header>
//         <div
//           style={{
//             position: "absolute",
//             textAlign: "center",
//             height: "auto",
//             width: "100%",
//           }}
//         >
//           {message && (
//             <div style={{ color: "green", fontSize: "20px" }}>
//               <p>
//                 <FlashMessage message={message} />
//               </p>
//             </div>
//           )}
//         </div>
//         <div
//           style={{
//             position: "absolute",
//             textAlign: "center",
//             height: "auto",
//             width: "100%",
//           }}
//         >
//           {logoutSuccess && (
//             <div style={{ color: "green", fontSize: "20px" }}>
//               Successfully logged out!
//             </div>
//           )}
//         </div>
//         <div
//           style={{
//             position: "absolute",
//             textAlign: "center",
//             height: "auto",
//             width: "100%",
//           }}
//         >
//           {logoutStatus && (
//             <div style={{ color: "green", fontSize: "20px" }}>
//               {logoutStatus}
//             </div>
//           )}
//         </div>

//         <div className="body_container">
//           <div>
//             <div>
//               <p>Find Mess Near Your University</p>
//             </div>
//             <div className="searchbox">
//               <input
//                 type="search"
//                 id="search"
//                 placeholder="Enter Location"
//                 value={searchItem}
//                 onChange={(e) => setSearchItem(e.target.value)}
//               />
//               <input type="submit" value="&rarr;" onClick={performSearch} />
//               {/* <Link
//                 style={{
//                   textDecoration: "none",
//                   color: "white",
//                   fontSize: "13px",
//                 }}
//                 to="/MessFind"
//               >
//                 Login
//               </Link> */}
//             </div>
//           </div>
//           <div className="image_container">
//             <img src="/assets/home.png" alt="logo" />
//           </div>
//         </div>
//       </section>
//       <section className="about-section">
//         <div className="about-us-container">
//           <div className="about-us-text">About us</div>
//           <div className="abouttt">
//             <div className="about-us">
//               Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
//               enim similique aperiam aliquam incidunt sunt cupiditate nihil quo
//               blanditiis doloribus, tempora harum, fugit consectetur dolorem
//               asperiores? Modi libero perspiciatis magni?
//             </div>
//             <div className="learn-more">Learn More &rarr;</div>
//           </div>
//           <div className="about-image">
//             <img src="/assets/About_image.png" alt="idk" />
//           </div>
//         </div>
//       </section>

//       <section className="last-section">
//         <div className="last-section-container">
//           <div className="col1">
//             <ul>
//               <li className="footereasypg">
//                 Easy <span className="nunu">Pg</span>
//               </li>
//               <li>
//                 Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//                 Temporibus nobis sequi expedita possimus vel reprehenderit
//                 nulla, atque reiciendis ex fugit quod. Dicta, consectetur?
//                 Tempora sunt delectus aperiam sed soluta atque.
//               </li>
//             </ul>
//           </div>
//           <div className="col2">
//             <ul>
//               <li className="first-item">Company</li>
//               <li>Careers</li>
//               <li>About Us</li>
//               <li>For Partners</li>
//               <li>Terms</li>
//               <li>Privacy Policy</li>
//               <li>Contact Us</li>
//             </ul>
//           </div>
//           <div className="col2">
//             <ul>
//               <li className="first-item">SUPPORT</li>
//               <li>FAQe</li>
//               <li>Contact Us</li>
//             </ul>
//           </div>
//           <div className="col2">
//             <ul>
//               <li className="first-item">QUICK LINK</li>
//               <li>Terms</li>
//               <li>Privacy Policy</li>
//             </ul>
//           </div>
//           <div className="footer-text">
//             copyright 2024 - All Right Reserved by{" "}
//             <span className="Easyp-pv-ltd">Easypg.pv.ltd</span>
//           </div>
//         </div>
//       </section>
//     </body>
//   );
// }

// export default HomePage;
import React,{useState,useEffect} from "react";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "../designs/style.css";
import FlashMessage from "../components/flashMessage";
import UserProfile from "../components/UserProfile";
import "../designs/UserProfile.css";

import { useAuth } from "../contexts/AuthContext";
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [searchItem, setSearchItem] = useState("");
  // const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState("");
  const { userName, IsAuthenticated, handleLogout, logoutSuccess,isOwnerAuthenticated,ownerName } = useAuth();



    useEffect(() => {
    document.title = "Find your nearest paying guest";
  }, []);

  const performSearch = () => {
    alert("Searching for: " + searchItem);
    navigate("/MessFind");
  };

  useEffect(() => {
    const storedMessage = localStorage.getItem("sId_message");
    if (storedMessage) {
      setMessage(location.state?.message || "");
    }

    const timer = setTimeout(() => {
      setMessage("");
      localStorage.removeItem("sId_message");
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state?.message]);

  useEffect(() => {
    if (IsAuthenticated ) {
      try {
        // Decode token

        console.log("user name:", userName);
      }
       catch (error) {
        console.error("Error decoding or accessing token:", error);
      }
    }else if(isOwnerAuthenticated){
      try {
        // Decode token

        console.log("user name:", ownerName);
       
      }
       catch (error) {
        console.error("Error decoding or accessing token:", error);
      }
    }
     else {
      console.error("Token is not present in cookies");
    }
  }, [IsAuthenticated, userName,isOwnerAuthenticated,ownerName]);
  useEffect(() => {
    const storedLogoutStatus = localStorage.getItem("logoutStatus");
    if (storedLogoutStatus) {
      setLogoutStatus(storedLogoutStatus);
      setTimeout(() => {
        localStorage.removeItem("logoutStatus");
        setLogoutStatus(""); // Clear the state as well
      }, 5000);
    }
  }, []);
  const handleLogoutClick = () => {
    handleLogout();
  };
  return (
    <div className="font-sans">
      <div className="bg-gradient-to-r from-[#2CA4B5] to-white min-h-screen flex flex-col">
        {/* Header Section */}
        <header className="w-full flex justify-between items-center py-4 px-6 lg:px-10 bg-white shadow-sm">
          <div className="text-2xl font-bold text-teal-700">MessMate</div>
          <nav className="hidden lg:flex space-x-8">
            <a href="#home" className="text-gray-800 hover:text-teal-600">
              Home
            </a>
            <a href="#about" className="text-gray-800 hover:text-teal-600">
              About
            </a>
            <a href="#services" className="text-gray-800 hover:text-teal-600">
              Service
            </a>
            <a href="#contact" className="text-gray-800 hover:text-teal-600">
              Contact us
            </a>
          </nav>

           {IsAuthenticated || isOwnerAuthenticated ? (
              <>
                <div
                  className="imageProfile"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <UserProfile />

                  <div className="dropdown-content">
                    <p className=""  > <Link  style={{fontSize:"16  px"}} to="/UserDashboard">Profile</Link></p>
                    <hr className="HR" />
                    <p className="logoutuser" onClick={handleLogoutClick}>
                      Log Out
                    </p>
                  </div>
                </div>
              </>
            ) : (


<button className="hidden lg:block rounded-full bg-white text-black px-6 py-2 border border-black hover:bg-gray-100  ">
            
            <Link to="/ProviderSeeker" className="font-semibold text-xs">House Owner / Student</Link>
          </button>
          
             )}


<button className="lg:hidden text-2xl text-gray-800">☰</button>
          
        </header>



        <div
          style={{
            position: "absolute",
            textAlign: "center",
            height: "auto",
            width: "100%",
          }}
        >
          {message && (
            <div style={{ color: "green", fontSize: "20px" }}>
              <p>
                <FlashMessage message={message} />
              </p>
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            height: "auto",
            width: "100%",
          }}
        >
          {logoutSuccess && (
            <div style={{ color: "green", fontSize: "20px" }}>
              Successfully logged out!
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            height: "auto",
            width: "100%",
          }}
        >
          {logoutStatus && (
            <div style={{ color: "green", fontSize: "20px" }}>
              {logoutStatus}
            </div>
          )}
        </div>



        {/* Main Section */}
        <main className="flex-grow flex flex-col lg:flex-row items-center justify-between px-6 lg:px-36 py-16">
          {/* Left Content */}
          <div className="text-center lg:text-left max-w-lg">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Find Your Perfect Student Home -{" "}
              <span className="text-[#2CA4B5] lg:text-white">Hassle-Free!</span>
            </h1>
            <p className="text-black lg:text-white mt-4">
              Search for Student Accommodation Website
            </p>
            <div className="mt-6 relative ">
              <div className="flex border-2 rounded-full  border-[#2CA4B5]">
                <input
                  type="text"
                  placeholder="Search city or University"
                  className="w-full py-4 px-5 rounded-full shadow-lg flex-1 outline-none bg-white text-black placeholder-[#CCCCCC] focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button className="absolute top-2 right-3 h-11 w-11 text-white bg-teal-600 rounded-full flex items-center justify-center" onClick={performSearch}></button>
            </div>
          </div>

          {/* Right Image */}
          <div className="max-w-sm lg:max-w-md mt-10 lg:mt-0 lg:order-2">
            <img
              src="assets/sweetHome.png"
              alt="House"
              className="rounded-lg"
            />
          </div>
        </main>
      </div>

      {/* Features Section */}
      <section className="bg-[#09E1FF] bg-opacity-25 py-12">
        <div className="container mx-auto grid gap-8 md:grid-cols-3 text-center px-24">
          <div>
            <div className=" flex justify-center ">
              <img
                src="./assets/online-booking 1.png"
                alt="sweet-home"
                className="max-w-48 h-auto"
              />
            </div>
            <h3 className="mt-8 text-xl font-semibold">
              Quick and easy bookings
            </h3>
            <p className="mt-2 text-[#606060] px-10">
              Secure your room in no time with hassle-free instant booking
            </p>
          </div>
          <div>
            <div className="flex justify-center">
              <img
                src="./assets/choice 1.png"
                alt="sweet-home"
                className="max-w-48 h-auto"
              />
            </div>

            <h3 className="mt-8 text-xl font-semibold">The widest choice</h3>
            <p className="mt-2 text-[#606060] px-10">
              Browse verified, affordable student rooms close to university
            </p>
          </div>
          <div>
            <div className=" flex justify-center ">
              <img
                src="./assets/support 1.png"
                alt="sweet-home"
                className="max-w-48 h-auto"
              />
            </div>
            <h3 className="mt-8 text-xl font-semibold">We’re here to help</h3>
            <p className="mt-2 text-[#606060] px-10">
              Reach out to our friendly team of experts who are always on hand
            </p>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="py-12">
        <div className="container  mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Explore popular student cities
          </h2>
          <div className="grid gap-x-0 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 px-24">
            <div className="flex justify-center group">
              <div>
                <img
                  src="assets/kolkata.png"
                  alt="kolkata"
                  className="max-w-auto h-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <p className="text-[#2CA4B5] font-semibold text-2xl">Kolkata</p>
                <p className="text-black">263 properties</p>
              </div>
            </div>
            <div className="flex justify-center group">
              <div>
                <img
                  src="assets/bankura.png"
                  alt="bankura"
                  className="max-w-auto h-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <p className="text-[#2CA4B5] font-semibold text-2xl">Bankura</p>
                <p className="text-black">263 properties</p>
              </div>
            </div>
            <div className="flex justify-center group">
              <div>
                <img
                  src="assets/westMed.png"
                  alt="west mednipur"
                  className="max-w-auto h-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <p className="text-[#2CA4B5] font-semibold text-2xl">
                  West Mednipur
                </p>
                <p className="text-black">263 properties</p>
              </div>
            </div>
            <div className="flex justify-center group">
              <div>
                <img
                  src="assets/jhargram.png"
                  alt="jhargram"
                  className="max-w-auto h-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <p className="text-[#2CA4B5] font-semibold text-2xl">
                  Jhargram
                </p>
                <p className="text-black">263 properties</p>
              </div>
            </div>
            <div className="flex justify-center group">
              <div>
                <img
                  src="assets/bardhaman.png"
                  alt="bardhaman"
                  className="max-w-auto h-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <p className="text-[#2CA4B5] font-semibold text-2xl">
                  Bardhaman
                </p>
                <p className="text-black">263 properties</p>
              </div>
            </div>
            <div className="flex justify-center group">
              <div>
                <img
                  src="assets/kalyani.png"
                  alt="kalyani"
                  className="max-w-auto h-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <p className="text-[#2CA4B5] font-semibold text-2xl">Kalyani</p>
                <p className="text-black">263 properties</p>
              </div>
            </div>
            <div className="flex justify-center group">
              <div>
                <img
                  src="assets/durgapur.png"
                  alt="durgapur"
                  className="max-w-auto h-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <p className="text-[#2CA4B5] font-semibold text-2xl">
                  Durgapur
                </p>
                <p className="text-black">263 properties</p>
              </div>
            </div>
            <div className="flex justify-center group">
              <div>
                <img
                  src="assets/asansole.png"
                  alt="asansole"
                  className="max-w-auto h-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <p className="text-[#2CA4B5] font-semibold text-2xl">
                  Asansole
                </p>
                <p className="text-black">263 properties</p>
              </div>
            </div>
            <div className="flex justify-center group">
              <div>
                <img
                  src="assets/bolpur.png"
                  alt="bolpur"
                  className="max-w-auto h-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <p className="text-[#2CA4B5] font-semibold text-2xl">Bolpur</p>
                <p className="text-black">263 properties</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto text-start px-24">
          <h2 className="text-3xl font-bold">About</h2>
          <p className="text-2xl font-bold py-10 text-black">
            <span className="text-black">Welcome to </span>
            <span className="text-[#2CA4B5]">MessMate!</span>
          </p>
          <p className="mt-4 text-black">
            We are more than just an app—we are a community committed to
            simplifying the lives of college students. At MessMate, we believe
            that finding a comfortable and affordable place to live shouldn’t be
            a hassle, especially for students starting a new chapter away from
            home.
          </p>
          <button className="rounded-full bg-white text-black px-4 py-2 border border-black hover:bg-gray-100 mt-4 font-semibold text-xs">
            See More <span className="ml-2 text-black">→</span>
          </button>
        </div>
      </section>

      <div className="bg-gray-50 min-h-screen px-24 py-10">
        {/* Services Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-6">Services</h2>

          <div className="flex flex-col lg:flex-row items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-black mb-4">
                Why MessMate?
              </h3>
              <p className="text-3xl text-teal-600 font-semibold mb-6">
                1000+
                <span className="text-black text-xl"> students helped!</span>
              </p>

              <h4 className="text-xl font-semibold text-black mb-4">
                How It Works:
              </h4>
              <ul className="space-y-4 px-4">
                <li className="flex items-center">
                  <span className="h-4 w-4 bg-orange-500 rounded-full inline-block mr-3"></span>
                  <span>Download the app.</span>
                </li>
                <li className="flex items-center">
                  <span className="h-4 w-4 bg-yellow-500 rounded-full inline-block mr-3"></span>
                  <span>Search for accommodation or services.</span>
                </li>
                <li className="flex items-center">
                  <span className="h-4 w-4 bg-green-500 rounded-full inline-block mr-3"></span>
                  <span>Book, pay, and manage everything in one place.</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 flex justify-center mt-10 lg:mt-0">
              <div className="relative">
                <img
                  src="assets/kolkata.png"
                  alt="Business Meeting"
                  className="w-80 h-56 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="container">
          <h2 className="text-4xl font-bold text-black mb-6">
            Contact Us - MessMate App
          </h2>

          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            {/* Left Image Section */}
            <div className="hidden lg:flex flex-1 justify-center">
              <img
                src="assets/kolkata.png"
                alt="Customer Support"
                className="w-80 h-56 rounded-lg shadow-lg"
              />
            </div>

            {/* Right Contact Info Section */}
            <div className="flex-1 mt-10 lg:mt-0 lg:ml-0 border-2 border-teal-500 rounded-lg p-6">
              <p className="text-gray-800 mb-4">
                We are here to assist you! Reach out to us for inquiries,
                feedback, or support. Our team is dedicated to providing the
                best possible service.
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>Email:</strong> info@messmate.com
                </li>
                <li>
                  <strong>Phone:</strong> +91-XXXXXXXXXX
                </li>
                <li>
                  <strong>Address:</strong> MessMate Pvt. Ltd., Chaitali Ray,
                  khabar kolkata
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;

