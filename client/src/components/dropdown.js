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
  //const [text, setText] = useState('Sort By');
  const [display, setDisplay] = useState(false);

  const changeText = ({/*newText*/}) => {
  //  setText(newText);
    setDisplay(false);
  };

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
      <button
        onClick={toggleDisplay}
        className="flex items-center justify-between  px-4 py-2 rounded-md text-sm font-semibold text-white w-full md:w-auto"
      >
        {/* {text} */}
        <img
          src="./assets/dropdoown.png"
          alt="Dropdown"
          className="w-4 h-4 ml-2"
        />
      </button>

      <ul
        className={`${
          display ? 'block' : 'hidden'
        } absolute bg-white shadow-lg rounded-md w-full mt-2 z-10 md:w-48`}
      >
        {dropdownData.map((val) => (
          <li key={val.name}>
            <a
              href="#0"
              onClick={() => changeText(val.name)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#2ca4b5] hover:text-white"
            >
              {val.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Dropdown;
