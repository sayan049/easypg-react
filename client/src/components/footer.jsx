import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div>
          <h2 className="text-white text-2xl font-bold">MessMate.in</h2>
        </div>

        {/* Service Area Section */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Our Service Area</h3>
          <ul className="space-y-2">
            {[
              'Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol', 'Bardhaman', 'Midnapore',
              'Malda', 'Kalyani', 'Cooch Behar', 'Hooghly', 'Purulia', 'Bankura', 'Birbhum',
              'Murshidabad', 'North 24 Parganas', 'South 24 Parganas', 'Nadia',
            ].map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {['Home', 'Features', 'About Us', 'Services', 'Contact'].map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
          <h3 className="text-white text-lg font-semibold mt-8 mb-4">FAQs</h3>
          <p>For quick answers, visit our FAQs page.</p>
        </div>

        {/* Social Media Links Section */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Social Media Links</h3>
          <ul className="space-y-2">
            {['Instagram', 'Facebook', 'LinkedIn'].map((platform) => (
              <li key={platform}>{platform}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center border-t border-gray-700 pt-4">
        <p className="text-sm">Copyright &copy; 2024 MessMate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
