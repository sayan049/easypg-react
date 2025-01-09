import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Horizontal Scroll Wrapper for Mobile */}
        <div className="flex overflow-x-auto space-x-8 md:space-x-0 md:grid md:grid-cols-4 text-center md:text-left">
          {/* Logo Section */}
          <div className="min-w-[200px]">
            <h1 className="text-xl md:text-2xl font-bold">Mess Mate.in</h1>
          </div>

          {/* Service Area */}
          <div className="min-w-[200px]">
            <h2 className="text-base md:text-lg font-semibold mb-4">
              Our Service Area
            </h2>
            <ul className="space-y-2 text-xs md:text-sm">
              {[
                "Kolkata",
                "Howrah",
                "Durgapur",
                "Siliguri",
                "Asansol",
                "Bardhaman",
                "Midnapore",
                "Malda",
                "Kalyani",
                "Cooch Behar",
                "Hooghly",
                "Purulia",
                "Bankura",
                "Birbhum",
                "Murshidabad",
                "North 24 Parganas",
                "South 24 Parganas",
                "Nadia",
              ].map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="min-w-[200px]">
            <h2 className="text-base md:text-lg font-semibold mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2 text-xs md:text-sm">
              {["Home", "Features", "About Us", "Services", "Contact"].map(
                (link) => (
                  <li key={link}>{link}</li>
                )
              )}
            </ul>
            <h2 className="text-base md:text-lg font-semibold mt-6">FAQs</h2>
            <p className="text-xs md:text-sm mt-2">
              For quick answers, visit our <a href="#" className="underline">FAQs page</a>.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="min-w-[200px]">
            <h2 className="text-base md:text-lg font-semibold mb-4">
              Social Media Links
            </h2>
            <ul className="space-y-2 text-xs md:text-sm">
              {["Instagram", "Facebook", "LinkedIn"].map((social) => (
                <li key={social}>{social}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-xs md:text-sm text-gray-500">
          Copyright © 2024 MessMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
