import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";

function LandingPage() {
  useEffect(() => {
    document.title = "Our promises to grow your business fast";
  }, []);

  return (
    <div>
      <div className="min-h-screen w-full">
        {/* Section 1 */}
        <div className="bg-custom-gradient flex flex-col items-center justify-center h-[65vh]">
          <div className="text-5xl font-bold flex space-x-1">
            <img
              src="./assets/companylogo.png"
              alt="logo"
              srcset=""
              className="mr-[-4px]"
            />{" "}
            <div className="text-2xl font-bold text-[#2CA4B5] mt-[20px] ">
              essMate
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xl font-bold hidden sm:block">
              Growing your business as become even easier
            </p>
            <div className="block sm:hidden">
              <p className="text-xl font-bold">Growing your business</p>
              <p className="text-xl font-bold">as become even easier</p>
            </div>
            <p className="text-xl mt-2 text-[#2CA4B5]">Only for you.</p>
          </div>

          <div className="mt-6">
            <Link to="/Business">
              <button className="bg-[#2CA4B5] text-white font-bold py-2 px-6 rounded-lg">
                Join Us Today
              </button>
            </Link>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white flex flex-col items-center py-12">
          <div className="text-center mb-8">
            <p className="text-xl flex items-center justify-center">
              Explore the world of
              <img
                src="./assets/companylogo.png"
                alt="logo"
                className="h-6 mx-1 ml-[10px] mb-[7px]"
              />
              <span className="text-[#2CA4B5] ml-[-4px]">essmate</span>!
            </p>
            <p className="mt-2">
              We will always provide you transparent policies and easy payments,
              for your growth!
            </p>
          </div>

          <div className="flex flex-wrap justify-around w-full max-w-screen-lg">
            {/* Card 1 */}
            <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 shadow-lg transition-shadow duration-300 hover:shadow-2xl bg-white rounded-xl m-4 sm:m-0">


              <img
                src="./assets/young-handsome-business-man-with-laptop-office 1.png"
                alt="Sign Up Process"
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <div className="text-center">
                <p className="font-bold">Sign Up Process</p>
                <p>Click the Join us button for signing up in 30 seconds</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 shadow-lg transition-shadow duration-300 hover:shadow-2xl bg-white rounded-xl m-4 sm:m-0">

              <img
                src="./assets/portrait-young-indian-top-manager-t-shirt-tie-crossed-arms-smiling-white-isolated-wall 1.png"
                alt="Privacy Policy"
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <div className="text-center">
                <p className="font-bold">Privacy Policy</p>
                <p>Read the privacy policy terms for better understanding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-black text-white flex flex-col items-center py-12">
          <div className="text-center mb-8">
            <p className="text-xl font-bold flex items-center justify-center">
              Why join
              <img
                src="./assets/companylogo.png"
                alt="logo"
                className="h-6 mx-1 ml-[11px]"
              />
              <span className="text-[#2CA4B5] mt-[3px] ml-[-3px]">essmate</span>
              ?
            </p>
            <p className="flex items-center justify-center">
              The advanced tools will bring more benefits to your business.
            </p>
          </div>

          <div className="flex flex-wrap justify-around w-full max-w-screen-lg">
            {/* Card 1 */}
            <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 border border-gray-700 rounded-lg shadow-lg transition-shadow duration-500   m-4 sm:m-0">
              <img
                src="/assets/businessman-black-suit-makes-thumbs-up 1.png"
                alt="Sign Up Process"
                className="w-full h-48 object-cover mb-4"
              />
              <div className="text-center">
                <p className="font-bold">Get Verified Leads</p>
                <hr className="border-gray-700" />
                <p>Reach genuine students actively looking for PGs.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 border border-gray-700 rounded-lg shadow-lg transition-shadow duration-500   m-4 sm:m-0">
              <img
                src="/assets/outdoor-businessman-having-his-arms-crossed (1) 1.png"
                alt="Privacy Policy"
                className="w-full h-48 object-cover mb-4"
              />
              <div className="text-center">
                <p className="font-bold">Boost Occupancy</p>
                <hr className="border-gray-700" />
                <p>
                  Fill vacant rooms faster with real-time booking and promotion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center py-12">
          <p className="text-xl font-bold mb-4 text-white">Connect with us!</p>
          <div className="flex flex-col md:flex-row items-center w-full max-w-md">
            <input
              type="email"
              placeholder="Email"
              className="border-2 border-gray-300 rounded-lg px-4 py-2  md:w-auto flex-1 mb-4 md:mb-0 md:mr-4 sm:max-w-[75%]"
            />
            <button className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg">
              Submit
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
