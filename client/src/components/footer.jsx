import React from "react";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="bg-black text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex justify-center md:justify-start mb-8 w-full">
          <h1 className="text-5xl font-bold flex items-center space-x-1">
            <img
              src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp"
              alt="MessMate - company Logo"
              className="mr-[-4px]"
              loading="lazy"
            />
            <span className="text-2xl text-[#2CA4B5] mt-[20px]">essMate</span>
          </h1>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-sm">
          {/* Quick Access */}
          <div>
            <h2 className="font-semibold mb-3">Quick Access</h2>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors duration-100"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#contactus"
                  className="hover:text-white transition-colors duration-100"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/#services"
                  className="hover:text-white transition-colors duration-100"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className="hover:text-white transition-colors duration-100"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Service Areas */}
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-1">
              Service Areas
              <span className="text-[10px] bg-white text-black px-1.5 py-[1px] rounded">
                Now
              </span>
            </h2>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors duration-100">
                Kalyani
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h2 className="font-semibold mb-3">Resources</h2>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/faqs"
                  className="hover:text-white transition-colors duration-100"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors duration-100"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors duration-100"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="hover:text-white transition-colors duration-100"
                >
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h2 className="font-semibold mb-3">Connect</h2>
            <div className="flex space-x-3 mb-4">
              <a
                href="https://www.instagram.com/mes.smate/"
                aria-label="Instagram"
                className="text-white hover:text-[#E1306C]"
              >
                <img
                  src="https://api.iconify.design/mdi:instagram.svg?color=white"
                  alt="Instagram"
                  className="h-5 w-5"
                />
              </a>
              <a
                href="https://www.facebook.com/share/1a7yy7319h/?mibextid=wwXIfr"
                aria-label="Facebook"
                className="text-white hover:text-[#1877F2]"
              >
                <img
                  src="https://api.iconify.design/mdi:facebook.svg?color=white"
                  alt="Facebook"
                  className="h-5 w-5"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/messmate/"
                aria-label="LinkedIn"
                className="text-white hover:text-[#0A66C2]"
              >
                <img
                  src="https://api.iconify.design/mdi:linkedin.svg?color=white"
                  alt="LinkedIn"
                  className="h-5 w-5"
                />
              </a>
            </div>
            <div className="text-gray-400 italic hover:text-white transition-colors duration-100">
              Android App Coming Soon
            </div>
          </div>

          {/* For Owners - Full width on mobile */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1 text-center md:text-left">
            <h2 className="font-semibold mb-3">For Owners</h2>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/owner/partner"
                  className="hover:text-white transition-colors duration-100"
                >
                  Partner with Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-gray-700  mt-10" />
        {/* Footer Bottom */}
        <div className="mt-2 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Messmate. All rights reserved.
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
