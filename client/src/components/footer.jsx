import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Footer (){
    return(
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

)}
export default Footer