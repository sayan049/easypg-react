// import React, { useEffect } from 'react'
// import  '../designs/messfind.css'
// import Slider from '@mui/material/Slider';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import { useState } from "react";
// import ToggleSwitch from '../components/toggle';
// import Dropdown from '../components/dropdown';
// import MessBars from '../components/messBars';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import Hamburger from '../components/hamburger';
// import Map from '../components/map';


// // downlead package  google-map-react !!!!

// function MessFind() {
// const [range, setRange] = useState([1000, 3000]);
// const [checkFeatures,setCheckFestures]=useState([]);

// useEffect(() => {
//     console.log('CheckFeatures updated:', checkFeatures);
// }, [checkFeatures])

// function handleChanges(event, newValue) {
//       // Ensure minimum value is not greater than maximum value
//     if (newValue[0] > newValue[1]) {
//         newValue[0] = newValue[1];
//     }
//       // Ensure maximum value is not smaller than minimum value
//     if (newValue[1] < newValue[0]) {
//         newValue[1] = newValue[0];
//     }
//     setRange(newValue);
// }

// const checkboxesData = [
//     { logo: 'air-conditioner 1.png', title: 'A/C' },
//     { logo: 'tank-water 1.png', title: 'tank water' },
//     { logo: 'wifi (1) 1.png', title: 'WiFi' },
//     { logo: 'power 1.png', title: 'Power Backup' },
//     { logo: 'restaurant 1.png', title: 'kitchen' },
//     { logo: 'single-bed 1.png', title: 'Single Bed' },
//     { logo: 'single-bed (1) 1.png', title: 'Double Bed' },
// ];



//     const featureChanges=(e)=>{
//         const {value,checked}=e.target;
//         console.log(checkFeatures);
//         if (checked) {
//             setCheckFestures([...checkFeatures, value]);
//         } else {
//             setCheckFestures(checkFeatures.filter((feature) => feature !== value));
//         }
//     }
    

// const [isChecked, setIsChecked] = useState(false);
// const handleToggle = () => {
//     setIsChecked(!isChecked);
// };

// const isWideScreen = useMediaQuery('(min-width:1481px)');
// console.log(isWideScreen);

// return (
//     <body style={{overflow:"hidden"}}>
//     <div style={{ padding: "0px 20px " }}>
//         <Hamburger Slider={Slider} Typography={Typography} Box={Box} handleChanges={handleChanges} range={range} checkboxesData={checkboxesData}  isWideScreen={isWideScreen}/>
//         <div className="leftCon inlineblock " style={{display : isWideScreen ? "inline-block" : "none", width : isWideScreen ? "20% !important":"110% !important"}} >
//             <div className="priceFilter">
//                 <div className='justifyspace flex'>
//                     <p>filter price</p>
//                     <p>clear all</p>
//                 </div>
//                 <div className="liver">
//                     <Box sx={{ width: "105%", margin: 'auto', textAlign: 'center' }}>
//                         <Typography id="range-slider" gutterBottom>
//                             Select Price Range
//                         </Typography>
//                         <Slider
//                             min={1000}
//                             max={10000}
//                             step={100}
//                             value={range}
//                             onChange={handleChanges}
//                             valueLabelDisplay="auto"
//                         />
//                         <Typography variant="body2">
//                             Range: {range[0]} - {range[1]}
//                         </Typography>
//                     </Box>
//                 </div>
//             </div>
//             <div className='flex flexcolumn'>
//                 {checkboxesData.map((data, index) => (
//                     <div className="checkContainer flex aligncentre" key={index}>
//                         <div className="checkboxicon">
//                             <img className="checkimg" src={`${process.env.PUBLIC_URL}/assets/${data.logo}`} alt="" srcSet="" />
//                         </div>
//                         <input type="checkbox" className="checki" id={`test${index}`} onClick={featureChanges} value={data.title} />
//                         <label style={{ bottom: "4px", height:"25px" , width:"25px" }} htmlFor={`test${index}`} />
//                         <div className="checkboxtxt flex aligncentre" style={{fontSize:"medium"}}>{data.title}</div>
//                     </div>
//                 ))}
//             </div>
//         </div>

//         <div className="rightCon inlineblock" style={{ width: isWideScreen ? "calc(80% - 45px)" :"calc(99% - 45px)"}}>
//             <div className="upnav flex justifyspace">
//                 <div className="dynamicmessdetails flex aligncentre justifycentre">20 Mess in Simhat, Nadia, West Bengal, India</div>
//                 <div className="togglebtn flex aligncentre"> map view<ToggleSwitch isChecked={isChecked} handleToggle={handleToggle} /> </div>
//                 <div className="shortby"><Dropdown /></div>
//             </div>
            
//               {/* display: isChecked ? (isWideScreen ? "inline-block" : "none")  : (isWideScreen ? "grid" : "block") */}
//                 <MessBars isWideScreen={isWideScreen} isChecked={isChecked} checkFeatures={checkFeatures} />

//             <div className="mapview" style={{ display: isChecked ? "inline-block" : "none", zindex: isChecked ? "9" : "5"}}>
//             <div className="mapcontainer">
//                     <Map/>
//                 </div>
//             </div>
//         </div>
//     </div>
//     </body>
// );
// }

// export default MessFind;
