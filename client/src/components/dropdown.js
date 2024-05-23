import React,{useState} from 'react'
import "../designs/messfind.css"
function Dropdown() {
    const [text,setText]=useState("Sort By")
    const changeText=(newText)=>{
        setText(newText);
        
    }
    const dropdownData=[
        {name:"Low Price"},
        {name:"High Price"},
        {name:"Latest  "}
    ]
  return (
    <nav>
  <ul style={{bottom:"-8px"}}>
    <li>
      <a href="#0" className='sb flex aligncentre justifyspace'>{text} <img  style={{height:"16px"}}  src="./assets/dropdoown.png" alt="" srcset=""/> </a>
      
      <ul>
        {dropdownData.map((val)=>{
         return (<li><a href="#0"  onClick={() => changeText(val.name)}>{val.name}</a></li>);
        })}
        
      </ul>
    </li>
  </ul>
</nav>
  );
};

export default Dropdown