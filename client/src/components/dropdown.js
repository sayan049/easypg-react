import React,{useState} from 'react'
import "../designs/messfind.css"
function Dropdown() {
    const [text,setText]=useState("Sort By")
    const [desplay,setDisplay]=useState(true)
    const changeText=(newText)=>{
        setText(newText);
        setDisplay(false);
    }
    const updateDisplay=()=>{
     if(!desplay){ setDisplay(true);}
    }
    const dropdownData=[
        {name:"Low Price"},
        {name:"High Price"},
        {name:"Latest  "}
    ]
  return (
    <nav onClick={updateDisplay} className='dropdownnav'>
  <ul style={{bottom:"-8px"}}>
    <li>
      <a href="#0" className='sb flex aligncentre justifyspace'>{text} <img  style={{height:"16px"}}  src="./assets/dropdoown.png" alt="" srcset=""/> </a>
      
      <ul  style={ { visibility: desplay ? "visible": "hidden" }}>
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