import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseurl, findMessUrl } from "../constant/urls";
import { useNavigate } from "react-router-dom";
import { get } from "ol/proj";

function MessBars({
  isChecked,
  checkFeatures,
  userLocation,
  coords,
  setPgCount,
}) {
  const [messData, setMessData] = useState([]);
  const [distance, setDistance] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  console.log("Selected Mess ID:", selected);

  const clickNavi = (owner) => {
    navigate("/viewDetails", { state: { owner } });
  };
  const clickBook = (owner) => {
    navigate("/booking", { state: { owner } });
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    console.log("Calculating distance between:", lat1, lon1, lat2, lon2); // Debugging
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return null;
    }
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1)); // Return as number
  };
  

  
  const clickCords = (location,id) => {
    console.log("Clicked Location Data:", location); // Debugging
    setSelected(id);

    if (
      Array.isArray(location) &&
      location.length === 2 &&
      typeof location[0] === "number" &&
      typeof location[1] === "number"
    ) {
      const [lng, lat] = location; // MongoDB stores [lng, lat]
      if (typeof coords === "function") {
        coords({ lat, lng });
      } else {
      //  console.error("❌ coords is not a function:", coords);
      }
      // coords({ lat, lng });      
      console.log("✅ Valid Coordinates Clicked:", { lat, lng });
    } else {
      //console.log("❌ Invalid location format:", location);
    }
  };

  useEffect(() => {
    console.log("Selected Features:", checkFeatures);
    if (userLocation) {
    //  console.log("User Location:", userLocation); // Debugging
   
    }
    if(!selected && Array.isArray(messData) && messData.length > 0 && messData[0]?.location?.coordinates){
     
      
      const [lng, lat] = messData[0].location.coordinates; 
      coords({ lat, lng });
      console.log("Coordinates set to:", { lat, lng }, coords);
    } 

    if (!selected && Array.isArray(messData) && messData.length > 0 && messData[0]?._id) {
      setSelected(messData[0]._id);
    }
    console.log("Sel", !coords , coords);

    
  }, [checkFeatures, userLocation,messData[0]]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userLocation || !userLocation.lat || !userLocation.lng) {
          console.error("❌ No valid location provided.");
          return;
        }
  
    //    console.log("📍 Fetching PGs near:", userLocation.lat, userLocation.lng);
  
        // Fetch PGs near selected location
        const res = await axios.get(findMessUrl, {
          params: { lat: userLocation.lat, lng: userLocation.lng },
        });
  
      //  console.log("🛎 PGs Found:", res.data);
  
        // Ensure `facility` is an array before filtering
        const filteredData = Array.isArray(res.data)
        ? res.data.filter((owner) => {
            // Check if facility is an array and extract elements correctly
            const facilitiesArray = Array.isArray(owner.facility)
              ? owner.facility.flatMap((f) => f.split(",").map((item) => item.trim().toLowerCase()))
              : [];  // Default to empty array if facility is missing
      
            console.log("✅ Processed Facilities Array:", facilitiesArray); // Debugging
      
            return checkFeatures.length > 0
              ? checkFeatures.some((feature) => facilitiesArray.includes(feature.toLowerCase()))
              : true;
          })
        : [];
      
  
        console.log("🔎 Filtered PGs:", filteredData);
        // console.log("🔍 Facility Data Type:", typeof owner.facility, owner.facility);

        setMessData(filteredData);
        setPgCount(filteredData.length);
      } catch (err) {
        console.error("❌ Error fetching data", err);
        setError("Failed to fetch PG owners");
      }
    };
  
    fetchData();
  }, [checkFeatures, userLocation]);
  

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ overflowY: "auto", height: "84vh" }}>
      {messData.map((owner) => (
        <div
          key={owner?._id}
          className="flex flex-col md:flex-row bg-white p-4 shadow rounded-md mb-4 sm:mb-2"
          // onClick={() => clickNavi(owner)}
          onClick={() => {
            if (owner?.location?.coordinates) {
              
              clickCords(owner.location.coordinates,owner?._id);
            } else {
              console.log("Location missing for", owner.messName);
            }
          }}
        >
          {/* Image Section */}
          {!isChecked && (
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <img
                loading="lazy"
                src={owner.profilePhoto}
                alt="Mess"
                className="w-full h-48 md:h-full object-cover rounded-md"
                style={{ maxHeight: "300px", borderRadius: "10px" }}
              />
            </div>
          )}

          {/* Content Section */}
          <div
            className={`flex-grow md:ml-6 mt-4 md:mt-0 ${(selected === owner._id && isChecked) ? "border-2 border-[rgb(44,164,181)]" : ""}
`}
            style={{
              padding: isChecked ? "29px" : "0px",
              borderRadius: isChecked ? "10px" : "0px",
              boxShadow: isChecked
                ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                : "none",
            }}
          >
            <h3 className="font-medium text-lg">{owner.messName}, In Simhat</h3>
            <p className="text-sm text-gray-600 mt-2">
              {/* Near MAKAUT University • 15 Km */}
              {owner.address} • {getDistanceFromLatLonInKm(userLocation.lat,userLocation.lng,owner?.location?.coordinates[0],owner?.location?.coordinates[1])} Km
            </p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              {owner.facility?.map((feature, index) => (
                <span key={index}>
                  {feature} {index < owner.facility.length - 1 && "•"}
                </span>
              ))}
            </div>
            <div>
              <span>Price: 2.5k/Month</span>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => clickNavi(owner)}
              >
                View Details
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={()=>clickBook(owner)}
              >
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
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { baseurl, findMessUrl } from "../constant/urls";
// import { useNavigate } from "react-router-dom";

// function MessBars({
//   isChecked,
//   checkFeatures,
//   userLocation,
//   coords,
//   setPgCount,
// }) {
//   const [messData, setMessData] = useState([]);
//   const [distance, setDistance] = useState(0);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [selected, setSelected] = useState(null);

//   const clickNavi = (owner) => {
//     navigate("/viewDetails", { state: { owner } });
//   };
  
//   const clickBook = (owner) => {
//     navigate("/booking", { state: { owner } });
//   };

//   // Function to calculate distance
//   const getStreetDistance = (orig, dest) => {
//     return new Promise((resolve, reject) => {
//       const service = new window.google.maps.DistanceMatrixService();

//       // Check if orig and dest are valid LatLng objects or arrays with [lat, lng]
//       if (
//         !orig ||
//         !dest ||
//         typeof orig.lat !== "number" ||
//         typeof orig.lng !== "number" ||
//         typeof dest[0] !== "number" ||
//         typeof dest[1] !== "number"
//       ) {
//         reject("Invalid origin or destination coordinates.");
//         return;
//       }

//       // Convert to LatLngLiteral if needed
//       const originLatLng = new window.google.maps.LatLng(orig.lat, orig.lng);
//       const destinationLatLng = new window.google.maps.LatLng(dest[1], dest[0]); // [lng, lat] from MongoDB

//       service.getDistanceMatrix(
//         {
//           origins: [originLatLng],
//           destinations: [destinationLatLng],
//           travelMode: "DRIVING",
//         },
//         (response, status) => {
//           if (status === "OK") {
//             const distanceText = response.rows[0].elements[0].distance.text;
//             resolve(distanceText);
//           } else {
//             reject("Distance error");
//           }
//         }
//       );
//     });
//   };

//   // Function to handle click on the coordinates
//   const clickCords = (location, id) => {
//     setSelected(id);

//     if (
//       Array.isArray(location) &&
//       location.length === 2 &&
//       typeof location[0] === "number" &&
//       typeof location[1] === "number"
//     ) {
//       const [lng, lat] = location; // MongoDB stores [lng, lat]
//       if (typeof coords === "function") {
//         coords({ lat, lng });
//       }
//     }
//   };

//   useEffect(() => {
//     if (userLocation && Array.isArray(messData) && messData.length > 0) {
//       const [lng, lat] = messData[0]?.location?.coordinates || [];
//       if (lng && lat) {
//         coords({ lat, lng });
//       }
//     }

//     if (!selected && Array.isArray(messData) && messData.length > 0 && messData[0]?._id) {
//       setSelected(messData[0]._id);
//     }
//   }, [userLocation, messData]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!userLocation || !userLocation.lat || !userLocation.lng) {
//           console.error("❌ No valid location provided.");
//           return;
//         }

//         const res = await axios.get(findMessUrl, {
//           params: { lat: userLocation.lat, lng: userLocation.lng },
//         });

//         const filteredData = Array.isArray(res.data)
//           ? res.data.filter((owner) => {
//               const facilitiesArray = Array.isArray(owner.facility)
//                 ? owner.facility.flatMap((f) => f.split(",").map((item) => item.trim().toLowerCase()))
//                 : [];

//               return checkFeatures.length > 0
//                 ? checkFeatures.some((feature) => facilitiesArray.includes(feature.toLowerCase()))
//                 : true;
//             })
//           : [];

//         setMessData(filteredData);
//         setPgCount(filteredData.length);
//       } catch (err) {
//         console.error("❌ Error fetching data", err);
//         setError("Failed to fetch PG owners");
//       }
//     };

//     fetchData();
//   }, [checkFeatures, userLocation]);

//   useEffect(() => {
//     if (userLocation && messData.length > 0) {
//       messData.forEach((owner) => {
//         if (owner?.location?.coordinates) {
//           getStreetDistance(userLocation, owner?.location?.coordinates)
//             .then((d) => setDistance(d))
//             .catch((err) => console.error("Distance error:", err));
//         }
//       });
//     }
//   }, [userLocation, messData]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div style={{ overflowY: "auto", height: "84vh" }}>
//       {messData.map((owner) => (
//         <div
//           key={owner?._id}
//           className="flex flex-col md:flex-row bg-white p-4 shadow rounded-md mb-4 sm:mb-2"
//           onClick={() => {
//             if (owner?.location?.coordinates) {
//               getStreetDistance(userLocation, owner?.location?.coordinates)
//                 .then((d) => setDistance(d))
//                 .catch((err) => console.error("Distance error:", err));
//               clickCords(owner.location.coordinates, owner?._id);
//             } else {
//               console.log("Location missing for", owner.messName);
//             }
//           }}
//         >
//           {/* Image Section */}
//           {!isChecked && (
//             <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
//               <img
//                 loading="lazy"
//                 src={owner.profilePhoto}
//                 alt="Mess"
//                 className="w-full h-48 md:h-full object-cover rounded-md"
//                 style={{ maxHeight: "300px", borderRadius: "10px" }}
//               />
//             </div>
//           )}

//           {/* Content Section */}
//           <div
//             className={`flex-grow md:ml-6 mt-4 md:mt-0 ${(selected === owner._id && isChecked) ? "border-2 border-[rgb(44,164,181)]" : ""}`}
//             style={{
//               padding: isChecked ? "29px" : "0px",
//               borderRadius: isChecked ? "10px" : "0px",
//               boxShadow: isChecked
//                 ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
//                 : "none",
//             }}
//           >
//             <h3 className="font-medium text-lg">{owner.messName}, In Simhat</h3>
//             <p className="text-sm text-gray-600 mt-2">
//               {owner.address} • {distance} Km
//             </p>
//             <div className="flex items-center mt-4 text-sm text-gray-500">
//               {owner.facility?.map((feature, index) => (
//                 <span key={index}>
//                   {feature} {index < owner.facility.length - 1 && "•"}
//                 </span>
//               ))}
//             </div>
//             <div>
//               <span>Price: 2.5k/Month</span>
//             </div>
//             <div className="flex gap-4 mt-4">
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                 onClick={() => clickNavi(owner)}
//               >
//                 View Details
//               </button>
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded-md"
//                 onClick={() => clickBook(owner)}
//               >
//                 Book Now
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default MessBars;
