import React from 'react'
import "../designs/messfind.css"

function messBars() {
  return (
    
    <div className="mess flex"  ><img src="https://4.imimg.com/data4/XP/JB/MY-29402471/pg-rooms-1000x1000.jpg" alt="" className='messimg' />
    <div style={{width:"100%",padding:"0px 25px"}} >
     <div className="messname" style={{fontSize:"x-large"}}>Tanmoy mess</div>
     <div className="messaddress">Near magipara</div>
     <div className="features">1 bed</div>
     <div className="twobtns"><button>view details</button> <button>Book now</button></div>
   </div>
   </div>
  )
}

export default messBars