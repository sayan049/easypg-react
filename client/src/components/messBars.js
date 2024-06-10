import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseurl, findMessUrl } from '../constant/urls';
import "../designs/messfind.css";

function MessBars({ isWideScreen ,isChecked, checkFeatures }) {
  const [messData, setMessData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(findMessUrl);
        const filteredData = res.data.filter(owner => 
          checkFeatures.every(feature => owner.facility[0].split(',').includes(feature))
      );
      
       console.log(filteredData)
        setMessData(filteredData);
        
      } catch (err) {
        console.log("Error fetching data", err);
        setError('Failed to fetch PG owners');
      }
    };
    fetchData();
  }, [checkFeatures]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='messbody' style={{ display: isChecked ? "inline-block"  : "grid" }} >
      {messData.map(owner => (
        <div className="mess flex" key={owner._id}>
          <div><img src={`${baseurl}/uploads/${owner.profilePhoto}`} alt="" className='messimg' /></div>
          <div style={{ width: "100%", padding: "0px 25px" }}>
            <div className="messname" style={{ fontSize: "x-large" }}>{owner.messName}</div>
            <div className="messaddress">{owner.address}</div>
            <div className="features">{owner.aboutMess}</div>
            <div className="twobtns">
              <button className={isWideScreen ? "wide-button" : "narrow-button"}>View details</button>
              <button className={isWideScreen ? "wide-button" : "narrow-button"}>Book now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessBars;
