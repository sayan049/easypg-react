import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  useEffect(() => {
    document.title = "Our promises to grow your business fast";
  }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Section 1 */}
      <div className="bg-[#09E1FF] flex flex-col items-center justify-center h-[65vh]">
        <div className="text-5xl font-bold flex space-x-1">
          <span className="text-[#2CA4B5]">Easy</span>
          <span className="text-[#1B2093]">Pg</span>
        </div>
        <div className="text-center mt-4">
          <p className="text-xl font-bold">Growing your business</p>
          <p className="text-xl font-bold">has become even easier,</p>
          <p className="text-xl mt-2  text-[#2CA4B5]">Only for you.</p>
        </div>
        <div className="mt-6">
          <Link to="/LoginOwner">
            <button className="bg-[#2CA4B5] text-white font-bold py-2 px-6 rounded-lg">Join Us Today</button>
          </Link>
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-white flex flex-col items-center py-12">
        <div className="text-center mb-8">
          <p className="text-xl font-bold">Explore the world of <span className="text-[#2CA4B5]">Easy</span><span className="text-[#1B2093]">Pg</span>!</p>
          <p className="mt-2">We will always provide you transparent policies and easy payments, for your growth!</p>
        </div>
        <div className="flex flex-wrap justify-around w-full max-w-screen-lg">
          <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8">
            <img src="./assets/young-handsome-business-man-with-laptop-office 1.png" alt="Sign Up Process" className="w-full h-48 object-cover mb-4" />
            <div className="text-center">
              <p className="font-bold">Sign Up Process</p>
              <p>Click the Join us button for signing up in 30 seconds</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8">
            <img src="./assets/portrait-young-indian-top-manager-t-shirt-tie-crossed-arms-smiling-white-isolated-wall 1.png" alt="Privacy Policy" className="w-full h-48 object-cover mb-4" />
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
          <p className="text-xl font-bold">Why join <span className="text-[#2CA4B5]">Easy</span><span className="text-[#1B2093]">Pg</span>?</p>
          <p>The advanced tools of <span className="text-[#2CA4B5]">Easy</span><span className="text-[#1B2093]">Pg</span> will bring more benefits to your business.</p>
        </div>
        <div className="flex flex-wrap justify-around w-full max-w-screen-lg">
          <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 border border-gray-700 rounded-lg">
            <img src="/assets/businessman-black-suit-makes-thumbs-up 1.png" alt="Sign Up Process" className="w-full h-48 object-cover mb-4" />
            <div className="text-center">
              <p className="font-bold">Sign Up Process</p>
              <p>Click the Join us button for signing up in 30 seconds</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 p-4 mb-8 border border-gray-700 rounded-lg">
            <img src="/assets/outdoor-businessman-having-his-arms-crossed (1) 1.png" alt="Privacy Policy" className="w-full h-48 object-cover mb-4" />
            <div className="text-center">
              <p className="font-bold">Privacy Policy</p>
              <p>Read the privacy policy terms for better understanding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="bg-white flex flex-col items-center py-12">
        <p className="text-xl font-bold mb-4">Connect with us!</p>
        <div className="flex flex-col md:flex-row items-center w-full max-w-md">
          <input type="text" placeholder="Mobile No" className="border-2 border-gray-300 rounded-lg px-4 py-2  md:w-auto flex-1 mb-4 md:mb-0 md:mr-4 sm:max-w-[75%]" />
          <button className="bg-[#2CA4B5] text-white font-bold py-2 px-6 rounded-lg">Submit</button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-8">
        <div className="max-w-screen-lg mx-auto flex flex-wrap md:flex-nowrap justify-around">
          <div className="w-full  md:w-1/4 mb-6 md:mb-0">
            <ul>
              <li className="text-xl font-bold mb-2">Easy <span className="text-[#2CA4B5]">Pg</span></li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus nobis sequi expedita possimus vel reprehenderit nulla, atque reiciendis ex fugit quod. Dicta, consectetur? Tempora sunt delectus aperiam sed soluta atque.</li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <ul>
              <li className="text-lg font-bold mb-2">Company</li>
              <li>Careers</li>
              <li>About Us</li>
              <li>For Partners</li>
              <li>Terms</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <ul>
              <li className="text-lg font-bold mb-2">SUPPORT</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <ul>
              <li className="text-lg font-bold mb-2">QUICK LINK</li>
              <li>Terms</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          copyright 2024 - All Right Reserved by <span className="font-bold text-[#2CA4B5]">Easypg.pv.ltd</span>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
