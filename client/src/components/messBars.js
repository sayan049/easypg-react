import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseurl, findMessUrl } from "../constant/urls";
import { useNavigate } from "react-router-dom";

function MessBars({
  isChecked,
  checkFeatures,
  userLocation,
  coords,
  setPgCount,
}) {
  const [messData, setMessData] = useState([]);
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
  // const clickCords = (location) => {
  //   // Check if location is a valid string
  //   if (typeof location === 'string' && location.includes(',')) {
  //     const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
  //     coords({ lat, lng });
  //     console.log('Coordinates clicked:', { lat, lng });
  //   } else {
  //     console.log('Invalid location:', location); // Handle invalid location
  //   }
  // };
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
    if (messData.length > 0 && !selected) {
      setSelected(messData[0]._id);
    }
  }, [checkFeatures, userLocation,messData[0]._id8]);

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
            className="flex-grow md:ml-6 mt-4 md:mt-0"
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
              Near MAKAUT University • 15 Km
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