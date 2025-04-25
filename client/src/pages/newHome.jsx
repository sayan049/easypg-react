import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/footer";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NewHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const {
    userName,
    IsAuthenticated,
    handleLogout,
    logoutSuccess,
    isOwnerAuthenticated,
    ownerName,
  } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Find your nearest paying guest";
  }, []);

  const performSearch = () => {
    alert("Searching for: " + searchItem);
    navigate("/newMessFind");
  };

  useEffect(() => {
    const storedMessage = localStorage.getItem("sId_message");
    const stateMessage = location.state?.message || "";
    if (storedMessage) {
      setMessage(location.state?.message || "");
     
    }
    if (stateMessage) {
    toast.success(stateMessage);}
    console.log("State message:", stateMessage);
    const timer = setTimeout(() => {
      setMessage("");
      localStorage.removeItem("sId_message");
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state?.message]);

  useEffect(() => {
    const storedLogoutStatus = localStorage.getItem("logoutStatus");
    if (storedLogoutStatus) {
      setLogoutStatus(storedLogoutStatus);
      setTimeout(() => {
        localStorage.removeItem("logoutStatus");
        setLogoutStatus("");
      }, 5000);
    }
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <div className="text-gray-800">
       <ToastContainer
              position="top-center"
              toastClassName="!w-[300px]   mx-auto mt-4 sm:mt-0  "
            />
      {/* Header Section */}
      <header className="bg-white shadow-md sticky top-0 z-10 lg:pl-24 lg:pr-24 md:pl-16 md:pr-16 sm:pl-4 sm:pr-4">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-[#2CA4B5]">MessMate</div>
          </div>
          <nav className="hidden md:flex space-x-6">
          <a href="#home" className="hover:text-blue-600">
             Home
              </a>
            <a href="#about" className="hover:text-blue-600">
              About
            </a>
            <a href="#services" className="hover:text-blue-600">
              Services
            </a>
            <a href="#contact" className="hover:text-blue-600">
              Contact Us
            </a>
          </nav>
          <Link to="/ProviderSeeker">
  <button className="hidden md:block border-2 border-black px-4 py-2 rounded-full text-black hover:bg-gray-100">
    Login
  </button>
</Link>

          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } absolute top-16 left-0 w-full bg-white shadow-md md:hidden`}
          >
            <nav className="flex flex-col space-y-2 p-4">
            <a href="#home" className="hover:text-blue-600">
             Home
              </a>
              <a href="#about" className="hover:text-blue-600">
                About
              </a>
              <a href="#services" className="hover:text-blue-600">
                Services
              </a>
              <a href="#contact" className="hover:text-blue-600">
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="  pt-28 lg:pl-24 lg:pr-24 md:pl-16 md:pr-16 sm:pl-4 sm:pr-4">
        <div className="grid sm:grid-cols-2 items-center gap-8">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4">
              Find Your Perfect Student Home -{" "}
              <span className="text-[#2CA4B5]">Hassle-Free!</span>
            </h1>
            <p className="text-gray-600 mb-6">
              Search for Student Accommodation Website
            </p>
            <div className="relative max-w-lg mx-auto sm:mx-0 pl-[2rem] pr-[2rem]">
                <img src="./assets/Map_Pin.png" alt="q" className="absolute h-[19px] top-[16px] left-[37px]"/>
              <input
                type="text"
                placeholder="Search city or University"
                className="w-full border border-gray-300 rounded-full py-3 px-6 pr-20 focus:outline-none focus:ring-2 focus:ring-[#2CA4B5]"
              />
              <button className="absolute bg-[#2CA4B5] rounded-full h-[35px] w-[35px] top-[7px] right-[41px]"></button>
            </div>
          </div>
          {/* Image */}
          <div className="flex justify-center">
            <img
              src="/assets/home.png"
              alt="Student"
              className="w-full max-w-sm rounded-md"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" py-16 bg-fuck-bg">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center lg:pl-24 lg:pr-24 md:pl-16 md:pr-16 sm:pl-4 sm:pr-4">
          <div>
            <img
              src="/assets/online-booking 1.png"
              alt="Easy Booking"
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">Quick & easy bookings</h3>
            <p className="text-gray-500">
              Secure your room in no time with hassle-free instant booking
            </p>
          </div>
          <div>
            <img
              src="/assets/choice 1.png"
              alt="Trusted Listings"
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">The widest choice</h3>
            <p className="text-gray-500">
              Browse verified, affordable student rooms close to university
            </p>
          </div>
          <div>
            <img
              src="/assets/support 1.png"
              alt="24/7 Support"
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">We’re here to help</h3>
            <p className="text-gray-500">
              Reach out to our friendly team of experts who are always on hand
            </p>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className=" py-16 lg:pl-24 lg:pr-24 md:pl-16 md:pr-16 sm:pl-4 sm:pr-4">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Explore Popular Student Cities
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              "Mumbai",
              "Pune",
              "Bangalore",
              "Delhi",
              "Kolkata",
              "Hyderabad",
              "Chennai",
              "Ahmedabad",
            ].map((city) => (
              <div
                key={city}
                className="bg-white shadow-md rounded-md p-4 text-center"
              >
                <img
                  src={`/images/cities/${city.toLowerCase()}.jpg`}
                  alt={city}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold">{city}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className=" py-16 lg:pl-24 lg:pr-24 md:pl-16 md:pr-16 sm:pl-4 sm:pr-4">
        <div className="container mx-auto px-4 text-center bg-[#D9D9D9] rounded p-8">
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
            About
          </h2>
          <h3 className="text-2xl font-bold mb-4 mt-16 text-center md:text-left ">
            Welcome to <span className="text-[#2CA4B5]">MessMate!</span>
          </h3>
          <p className="text-gray-600 mb-6  mt-8 text-center md:text-left ">
            We are more than just an app—we are a community committed to
            simplifying the lives of college students. At MessMate, we believe
            that finding a comfortable and affordable place to live shouldn’t be
            a hassle, especially for students starting a new chapter away from
            home.
          </p>
          <button className="flex items-center justify-center md:block border-2 border-black px-4 py-2 rounded-full text-black hover:bg-gray-100 ">
            <span>Learn more</span>
            <img src="/assets/Vector 13.png" alt="Arrow" className="ml-2 h-5 w-[4.25rem]" />
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className=" py-16 lg:pl-24 lg:pr-24 md:pl-16 md:pr-16 sm:pl-4 sm:pr-4">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg">Why MesaMate?</h3>
              <ul className="list-disc pl-6 text-gray-600">
                <li>1000+ Listings</li>
                <li>Reliable accommodations</li>
                <li>Easy to use platform</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg">How It Works</h3>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Search for a property</li>
                <li>Contact the landlord</li>
                <li>Book your stay</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section id="contact" className=" py-16 lg:pl-24 lg:pr-24 md:pl-16 md:pr-16 sm:pl-4 sm:pr-4">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Contact Us - MesaMate App</h2>
          <p className="text-gray-600 mb-4">
            Have questions or need assistance? Get in touch with us via the app
            or email.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
            Download App
          </button>
        </div>
      </section> */}
      <h1 className="text-center text-xl font-semibold text-teal-600 mb-4">Contact us</h1>
    <div
  id="contact"
  className="bg-teal-100 py-16 lg:pl-24 lg:pr-16 md:pl-20 md:pr-16 sm:pl-8 sm:pr-8 px-4 rounded ml-8 mr-8 mb-8"
>
  <form className="space-y-4">
    {/* Description */}
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-teal-100 w-full border border-teal-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        rows="4"
        placeholder="Enter your description"
      />
    </div>

    {/* Email */}
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-teal-100 w-full border border-teal-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your email"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
    >
      Send
    </button>
  </form>
</div>



      <Footer/>
      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>&copy; 2024 MessMate. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default NewHomePage;