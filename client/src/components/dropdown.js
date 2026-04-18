import React, { useState } from 'react';

function Dropdown({setSortBy}) {
  const [display, setDisplay] = useState(false);

  const toggleDisplay = () => {
    setDisplay(!display);
  };

  const dropdownData = [
    { name: 'Low Price' },
    { name: 'High Price' },
    { name: 'Latest' },
  ];

  return (
    <nav className="relative  md:block hidden w-[7rem]">
      {/* Dropdown Button */}
      <button
        onClick={toggleDisplay}
        className="flex items-center justify-between  px-4 py-2 rounded-md text-sm font-semibold text-gray-700 bg-white border border-gray-300  md:w-auto"
      >
        <span>Sort By</span>
        <img
          src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746981535/down-arrow-6820d25bd41ad_z3rdln.webp" 
          alt="Messmate - Dropdown illustration"
          className="w-4 h-4 ml-2"
          loading='lazy'
        />
      </button>

      {/* Dropdown List */}
      <ul
        className={`${
          display ? 'block' : 'hidden'
        } absolute bg-white shadow-lg rounded-md w-full mt-2 z-10 md:w-48 md:left-0`}
      >
        {dropdownData.map((val) => (
          <li key={val.name} onClick={()=> setSortBy(val.name)}>
            <a
              href="#0"
              onClick={() => setDisplay(false)} // Close dropdown after selection
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#2ca4b5] hover:text-white"
            >
              <div className="flex items-center space-x-2" >
                {/* Option text */}
                <span>{val.name}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Dropdown;

