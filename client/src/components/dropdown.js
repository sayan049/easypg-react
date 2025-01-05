// import React,{useState} from 'react'
// // import "../designs/messfind.css"
// function Dropdown() {
//     const [text,setText]=useState("Sort By")
//     const [desplay,setDisplay]=useState(true)
//     const changeText=(newText)=>{
//         setText(newText);
//         setDisplay(false);
//     }
//     const updateDisplay=()=>{
//      if(!desplay){ setDisplay(true);}
//     }
//     const dropdownData=[
//         {name:"Low Price"},
//         {name:"High Price"},
//         {name:"Latest  "}
//     ]
//   return (
//     <nav onClick={updateDisplay} className='dropdownnav hidden md:block'>
//   <ul /*style={{bottom:"-8px"}}*/>
//     <li>
//       <a href="#0" className='sb flex aligncentre justifyspace' style={{ fontSize: 'smaller' }} >{text} <img  style={{height:"16px"}}  src="./assets/dropdoown.png" alt="" srcset=""/> </a>
      
//       <ul  style={ { display: desplay ? "block": "none" , fontSize: 'smaller' }}>
//         {dropdownData.map((val)=>{
//          return (<li><a href="#0"  onClick={() => changeText(val.name)}>{val.name}</a></li>);
//         })}
        
//       </ul>
//     </li>
//   </ul>
// </nav>
//   );
// };

// export default Dropdown
import React, { useState } from 'react';

function Dropdown() {
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
    <nav className="relative">
      {/* Dropdown Button */}
      <button
        onClick={toggleDisplay}
        className="flex items-center justify-between px-4 py-2 rounded-md text-sm font-semibold text-gray-700 bg-white border border-gray-300 w-full md:w-auto"
      >
        <span>Sort By</span>
        <img
          src="./assets/down-arrow.png" // Use your dropdown icon here
          alt="Dropdown"
          className="w-4 h-4 ml-2"
        />
      </button>

      {/* Dropdown List */}
      <ul
        className={`${
          display ? 'block' : 'hidden'
        } absolute bg-white shadow-lg rounded-md w-full mt-2 z-10 md:w-48 md:left-0`}
      >
        {dropdownData.map((val) => (
          <li key={val.name}>
            <a
              href="#0"
              onClick={() => setDisplay(false)} // Close dropdown after selection
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#2ca4b5] hover:text-white"
            >
              <div className="flex items-center space-x-2">
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
