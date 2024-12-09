import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseurl, findMessUrl } from '../constant/urls';
import "../designs/messfind.css";
import '../designs/messbars.css'

function MessBars({ isChecked /* ,checkFeatures}*/ }) {
  const [messData, setMessData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(findMessUrl);
      //   const filteredData = res.data.filter(owner =>
      //     checkFeatures.every(feature => owner.facility[0].split(',').includes(feature))
      // );
     //  console.log(filteredData)
        setMessData(res.data);
        
      } catch (err) {
        console.log("Error fetching data", err);
        setError('Failed to fetch PG owners');
      }
    };
    fetchData();
  }/*, [checkFeatures]*/);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    // <div className='messbody' style={{ display: isChecked ? "inline-block"  : "grid" }} >
    //   {messData.map(owner => (
    //     <div className="mess flex" key={owner._id}>
    //       <div><img src={`${baseurl}/uploads/${owner.profilePhoto}`} alt="" className='messimg' /></div>
    //       <div style={{ width: "100%", padding: "0px 25px" }}>
    //         <div className="messname" style={{ fontSize: '160%' }}>{owner.messName}</div>
    //         <div className="messaddress">{owner.address}</div>
    //         <div className="features">{owner.aboutMess}</div>
    //         <div className="twobtns">
    //           <button className={isWideScreen ? "wide-button" : "narrow-button"}>View details</button>
    //           <button className={isWideScreen ? "wide-button" : "narrow-button"}>Book now</button>
    //         </div>
    //       </div>
    //     </div>
    //   ))}
    // </div>
    <div  >
    {messData.map(owner => (
      <div
        key={owner._id}
        className="flex flex-col md:flex-row bg-white p-4 shadow rounded-md"
      >
        <img
          src={`${baseurl}/uploads/${owner.profilePhoto}`}
          alt="Mess"
          className="w-full md:w-1/3 object-cover rounded-md"
        />
        <div className="md:ml-6 mt-4 md:mt-0">
          <h3 className="font-medium text-lg">{owner.messName}, In Simhat</h3>
          <p className="text-sm text-gray-600 mt-2">
            Near MAKAUT University • 15 Km
          </p>
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <span>Wi-Fi</span>
            <span className="mx-2">•</span>
            <span>Single Bed</span>
            <span className="mx-2">•</span>
            <span>4+ More</span>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              View Details
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
              Book Now
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
    
  );
}

export default MessBars;
