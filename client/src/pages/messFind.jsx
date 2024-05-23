import React from 'react'
import  '../designs/messfind.css'
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from "react";
import ToggleSwitch from '../components/toggle';
import Dropdown from '../components/dropdown';

function MessFind() {
    const [range, setRange] = useState([1000, 3000]);
    function handleChanges(event, newValue) {
        // Ensure minimum value is not greater than maximum value
    if (newValue[0] > newValue[1]) {
        newValue[0] = newValue[1];
      }
      // Ensure maximum value is not smaller than minimum value
      if (newValue[1] < newValue[0]) {
        newValue[1] = newValue[0];
      }
      setRange(newValue);
    }

    const checkboxesData = [
      { logo: 'air-conditioner 1.png', title: 'A/C' },
      { logo: 'tank-water 1.png', title: 'tank water' },
      { logo: 'wifi (1) 1.png', title: 'WiFi' },
      { logo:'power 1.png' ,title:'Power Backup'},
      { logo:'restaurant 1.png' ,title:'Kitchen'},
      { logo:'single-bed 1.png' ,title:'Single Bed'},
      { logo:'single-bed (1) 1.png' ,title:'Double Bed'},
    ];

  return (
    <div style={{padding : "0px 45px ",}}>
        <div className="leftCon inlineblock ">
            <div className="priceFilter">
                <div className='justifyspace flex'><p>filter price</p> <p>clear all</p></div>
                <div className="liver">
      <Box sx={{ width: "105%" , margin: 'auto', textAlign: 'center' }}>
        <Typography id="range-slider" gutterBottom>
          Select Range
        </Typography>
        <Slider
          min={1000}
          max={10000}
          step={100}
          value={range}
          onChange={handleChanges}
          valueLabelDisplay="auto"
        />
        <Typography variant="body2">
          Range: {range[0]} - {range[1]}
        </Typography>
      </Box>
    </div>
             </div>
             <div className='flex  flexcolumn'>
              {checkboxesData.map((data,index)=>(
                <div className="checkContainer flex  aligncentre" key={index}> <div className="checkboxicon"><img className="checkimg"   src={`${process.env.PUBLIC_URL}/assets/${data.logo}`}
                alt="" srcset=""/></div><input type="checkbox" className="checki" id={`test${index}`} />
                <label style={{bottom: "4px"}} for={`test${index}`} ></label><div className="checkboxtxt flex alingcentre"  >{data.title}</div></div>
              ))}
     
        </div>
        </div>

        <div className="rightCon inlineblock" >
          <div className="upnav flex justifyspace">
            <div className="dynamicmessdetails flex aligncentre justifycentre">20 Mess in Simhat, Nadia , West Bengal, India</div>
            <div className="togglebtn flex aligncentre"> map view<ToggleSwitch label="map view"/> </div>
            <div className="shortby"><Dropdown/></div>
          </div>
        </div>
    </div>
  )
}

export default MessFind