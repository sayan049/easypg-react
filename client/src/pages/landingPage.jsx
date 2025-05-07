import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../components/footer";

function LandingPage() {
  return (
    <div>
      <Helmet>
        <html lang="en-IN" />
        <title>Grow Your PG Business with MessMate | Verified Leads & Bookings</title>
        <meta
          name="description"
          content="Grow your PG business with MessMate. Get verified student leads, boost occupancy with real-time booking, and simplify management."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.messmate.co.in/owner/partner" />

        {/* Open Graph Meta */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Grow Your PG Business with MessMate" />
        <meta
          property="og:description"
          content="Join MessMate to grow your PG or hostel business. Get leads, boost occupancy and simplify operations."
        />
        <meta property="og:url" content="https://www.messmate.co.in/owner/partner" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/og-business.jpg"
        />

        {/* Twitter Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Grow Your PG Business with MessMate" />
        <meta
          name="twitter:description"
          content="Verified leads, real-time booking, and simplified management for PG owners."
        />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/og-business.jpg" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </Helmet>

      <main className="min-h-screen w-full">

        {/* Hero Section */}
        <section className="bg-custom-gradient flex flex-col items-center justify-center h-[65vh] text-center">
          <h1 className="text-5xl font-bold flex items-center space-x-1">
            <img
              src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/companylogo_qz2ufw.png"
              alt="MessMate - company Logo"
              className="mr-[-4px]"
              loading="lazy"
            />
            <span className="text-2xl text-[#2CA4B5] mt-[20px]">essMate</span>
          </h1>
          <div className="mt-4">
            <h2 className="text-xl font-bold hidden sm:block">
              Growing your business has become even easier
            </h2>
            <div className="block sm:hidden">
              <p className="text-xl font-bold">Growing your business</p>
              <p className="text-xl font-bold">has become even easier</p>
            </div>
            <p className="text-xl mt-2 text-[#2CA4B5]">Only for you.</p>
          </div>
          <div className="mt-6">
            <Link to="/business-model">
              <button className="bg-[#2CA4B5] text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition duration-300 hover:scale-105">
                Join Us Today
              </button>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white flex flex-col items-center py-12 text-center">
          <h2 className="text-xl flex items-center justify-center font-semibold mb-2">
            Explore the world of
            <img
              src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/companylogo_qz2ufw.png"
              alt="MessMate - company Logo"
              className="h-6 mx-1 ml-[10px] mb-[7px]"
              loading="lazy"
            />
            <span className="text-[#2CA4B5] ml-[-4px]">essMate</span>!
          </h2>
          <p className="mb-8 max-w-xl">
            Transparent policies, seamless payments, and tools to grow your business.
          </p>

          <div className="flex flex-wrap justify-around w-full max-w-screen-lg">
            {/* Card 1 */}
            <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 shadow-lg hover:shadow-2xl bg-white rounded-xl m-4">
              <img
                src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746632863/young-handsome-business-man-with-laptop-office_1_w7c2a1.png"
                alt="Businessman signing up with laptop"
                className="w-full h-48 object-cover mb-4 rounded-md"
                loading="lazy"
              />
              <p className="font-bold">Quick Sign-Up</p>
              <p>Sign up in under 30 seconds and start managing your PG.</p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 shadow-lg hover:shadow-2xl bg-white rounded-xl m-4">
              <img
                src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746632876/portrait-young-indian-top-manager-t-shirt-tie-crossed-arms-smiling-white-isolated-wall_1_e9omn2.png"
                alt="Confident PG manager standing"
                className="w-full h-48 object-cover mb-4 rounded-md"
                loading="lazy"
              />
              <p className="font-bold">Privacy First</p>
              <p>Your data is protected. Read our privacy policies.</p>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="bg-black text-white flex flex-col items-center py-12 text-center">
          <h2 className="text-xl font-bold flex items-center justify-center mb-2">
            Why join
            <img
              src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/companylogo_qz2ufw.png"
              alt="MessMate - company Logo"
              className="h-6 mx-1 ml-[11px]"
              loading="lazy"
            />
            <span className="text-[#2CA4B5] mt-[3px] ml-[-3px]">essMate</span>?
          </h2>
          <p className="mb-8">
            Advanced tools to boost your business reach and room occupancy.
          </p>

          <div className="flex flex-wrap justify-around w-full max-w-screen-lg">
            {/* Benefit 1 */}
            <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 border border-gray-700 rounded-lg shadow-lg m-4">
              <img
                src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746633003/businessman-black-suit-makes-thumbs-up_1_ryuivu.png"
                alt="Happy PG owner with thumbs up"
                className="w-full h-48 object-cover mb-4"
              />
              <p className="font-bold">Verified Student Leads</p>
              <hr className="border-gray-700 w-1/2 my-2" />
              <p>Connect with students actively seeking PGs.</p>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 border border-gray-700 rounded-lg shadow-lg m-4">
              <img
                src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746632887/outdoor-businessman-having-his-arms-crossed_1_1_m2osdl.png"
                alt="Confident PG owner with arms crossed"
                className="w-full h-48 object-cover mb-4"
                loading="lazy"
              />
              <p className="font-bold">Boost Occupancy</p>
              <hr className="border-gray-700 w-1/2 my-2" />
              <p>Real-time bookings help fill your PG faster.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center py-12">
          <h2 className="text-xl font-bold mb-4">Connect with us!</h2>
          <form className="flex flex-col md:flex-row items-center w-full max-w-md">
            <input
              type="email"
              placeholder="Email"
              className="border-2 border-gray-300 rounded-lg px-4 py-2 flex-1 mb-4 md:mb-0 md:mr-4 sm:max-w-[75%]"
              required
            />
            <button type="submit" className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg">
              Submit
            </button>
          </form>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
