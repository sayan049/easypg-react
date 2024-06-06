import React, { useEffect } from 'react'; // Removed useState import
import "../designs/messfind.css"
import axios from 'axios';

// Renamed function to start with an uppercase letter
function MessBars() {

  const [list, setList] = React.useState([]);

  // will be run once 
  useEffect(()=> {  
      // here we get the data by requesting data from this link
      // to our nodejs server
      axios.get('/signupOwner')
      .then((res)=> setList(res.data));
  }, []);

  let messName = list.map((item)=>{
    return <li key={item.messName}>{item.messName}</li>
  });

  return (
    <div className="mess flex"  >
      <img src="https://4.imimg.com/data4/XP/JB/MY-29402471/pg-rooms-1000x1000.jpg" alt="" className='messimg' />
      <div style={{width:"100%",padding:"0px 25px"}} >
        <div className="messname" style={{fontSize:"x-large"}} > {messName}</div>
        <div className="messaddress">Near magipara</div>
        <div className="features">1 bed</div>
        <div className="twobtns"><button>view details</button> <button>Book now</button></div>
      </div>
    </div>
  );
}

export default MessBars;
