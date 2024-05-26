import React from 'react'
import "../designs/hamburger.css"

function hamburger({Slider, Typography ,Box,range,handleChanges,checkboxesData ,isWideScreen}) {
  return (
  
    <nav role="navigation" className='hamnav' style={{display : isWideScreen ? "none" : "block"}} >
      <div id="menuToggle">
     
        <input type="checkbox" />
        
       
        <span className='hamspamn'></span>
        <span className='hamspamn'></span>
        <span className='hamspamn'></span>
        
       
        <ul id="menu">
        <div className="leftCon inlineblock " style={{width:"325px" , border:"0px" , height:"100%" ,   maxheight: "calc(100vh - 100px)"}}>
              <div className="priceFilter">
                  <div className='justifyspace flex'>
                      <p>filter price</p>
                      <p>clear all</p>
                  </div>
                  <div className="liver">
                      <Box sx={{ width: "105%", margin: 'auto', textAlign: 'center' }}>
                          <Typography id="range-slider" gutterBottom>
                              Select Price Range
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
              <div className='flex flexcolumn'>
                  {checkboxesData.map((data, index) => (
                      <div className="checkContainer flex aligncentre" key={index+7}>
                          <div className="checkboxicon">
                              <img className="checkimg" src={`${process.env.PUBLIC_URL}/assets/${data.logo}`} alt="" srcSet="" />
                          </div>
                          <input type="checkbox" className="checki" id={`test${index+7}`} />
                          <label style={{ bottom: "4px" }} htmlFor={`test${index+7}`} />
                          <div className="checkboxtxt flex aligncentre">{data.title}</div>
                      </div>
                  ))}
              </div>
          </div>

        </ul>
      </div>
    </nav>
  )
}

export default hamburger