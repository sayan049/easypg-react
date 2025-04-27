import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseurl, findMessUrl } from "../constant/urls";
import { useNavigate } from "react-router-dom";
import { getDistance } from "ol/sphere";

function MessBars({
  isChecked,
  checkFeatures,
  userLocation,
  coords,
  setPgCount,
}) {
  const [messData, setMessData] = useState([]);
  const [distanceMap, setDistanceMap] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [lowestPrice, setLowestPrice] = useState(null);

  const getStreetDistance = async (orig, dest) => {
    try {
      // Parse coordinates to numbers
      const startLon = parseFloat(orig.lng);
      const startLat = parseFloat(orig.lat);
      const endLon = parseFloat(dest[0]);
      const endLat = parseFloat(dest[1]);

      // First try OSRM for road distance
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=false`
      );

      const data = await response.json();

      if (data.routes?.[0]?.distance) {
        return `${(data.routes[0].distance / 1000).toFixed(1)} km`;
      }

      // Fallback to great-circle distance if OSRM fails
      const distance = getDistance([startLon, startLat], [endLon, endLat]);
      return `${(distance / 1000).toFixed(1)} km (straight line)`;
    } catch (err) {
      console.error("Distance calculation error:", err);
      return "N/A";
    }
  };

  // Keep other functions and useEffect hooks the same
  const clickNavi = (owner) => {
    navigate("/viewDetails", { state: { owner } });
  };

  const clickBook = (owner) => {
    navigate("/booking", { state: { owner } });
  };

  const clickCords = (location, id) => {
    setSelected(id);
    if (Array.isArray(location) && location.length === 2) {
      const [lng, lat] = location;
      if (typeof coords === "function") {
        coords({ lat, lng });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userLocation || !userLocation.lat || !userLocation.lng) {
          console.error("❌ Invalid user location");
          return;
        }

        const res = await axios.get(findMessUrl, {
          params: {
            lat: parseFloat(userLocation.lat),
            lng: parseFloat(userLocation.lng),
          },
        });

        const filteredData = Array.isArray(res.data)
          ? res.data.filter((owner) => {
              const facilitiesArray = Array.isArray(owner.facility)
                ? owner.facility.flatMap((f) =>
                    f.split(",").map((item) => item.trim().toLowerCase())
                  )
                : [];
              return checkFeatures.length > 0
                ? checkFeatures.some((feature) =>
                    facilitiesArray.includes(feature.toLowerCase())
                  )
                : true;
            })
          : [];

        setMessData(filteredData);
        setPgCount(filteredData.length);
      } catch (err) {
        console.error("❌ Fetch Error", err);
        setError("Failed to fetch Messes");
      }
    };

    fetchData();
  }, [checkFeatures, userLocation]);

  useEffect(() => {
    const fetchDistances = async () => {
      if (messData.length === 0 || !userLocation) return;

      const newDistanceMap = {};
      for (const owner of messData) {
        if (owner?.location?.coordinates) {
          try {
            const distanceText = await getStreetDistance(
              { lat: userLocation.lat, lng: userLocation.lng },
              owner.location.coordinates
            );
            newDistanceMap[owner._id] = distanceText;
          } catch (err) {
            console.error(`❌ Distance error for ${owner.messName}:`, err);
            newDistanceMap[owner._id] = "N/A";
          }
        }
      }
      setDistanceMap(newDistanceMap);
    };

    fetchDistances();
  }, [messData, userLocation]);

  // Remove Google Maps loading check
  if (error) {
    return <div>{error}</div>;
  }

  return(
  <div className="grid gap-4 p-2 sm:p-4">
  {messData.map((owner) => (
    <div
      key={owner._id}
      className={`relative grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:max-h[15rem] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 ${
        selected === owner._id && isChecked
          ? "ring-2 ring-blue-500"
          : "ring-1 ring-gray-200"
      }`}
      onClick={() => {
        if (owner?.location?.coordinates) {
          clickCords(owner.location.coordinates, owner._id);
        }
      }}
    >
      {!isChecked && (
        <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
          <img
            loading="lazy"
            src={owner.profilePhoto}
            alt="Mess"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">
              {owner.messName}
            </h3>
            <button
              className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Info clicked", owner._id);
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-600">
            {owner.address}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="inline-flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {distanceMap[owner._id] || "Calculating..."}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {owner.facility?.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-[rgb(44 164 181 / var(--tw-bg-opacity))] text-xs rounded-full"
               // flex items-center mt-4 text-sm text-gray-500 flex-wrap gap-2
              >
                {feature}
                {index < owner.facility.length - 1 && " • "}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-lg font-medium text-gray-900">
            {owner.roomInfo?.length > 0 ? (
              `₹${Math.min(
                ...owner.roomInfo
                  .map((room) => Number(room.pricePerHead))
                  .filter(Number)
              )} /month`
            ) : (
              "Price: N/A"
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              onClick={(e) => {
                e.stopPropagation();
                clickNavi(owner);
              }}
            >
              View Details
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              onClick={(e) => {
                e.stopPropagation();
                clickBook(owner);
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
);
  // (
  //   <div style={{ overflowY: "auto", height: "84vh" }}>
  //     {messData.map((owner) => (
  //       <div
  //         key={owner._id}
  //         className="flex flex-col md:flex-row bg-white p-4 shadow rounded-md mb-4 sm:mb-2 md:max-h-[15rem]"
  //         onClick={() => {
  //           if (owner?.location?.coordinates) {
  //             clickCords(owner.location.coordinates, owner._id);
  //           }
  //         }}
  //       >
  //         {/* <button
  //   className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors"
  //   onClick={(e) => {
  //     e.stopPropagation();
  //     // Add your button click handler here
  //     console.log('Round button clicked', owner._id);
  //   }}
  // >
  //   i
  // </button> */}
  //         {/* Image Section */}
  //         {!isChecked && (
  //           <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
  //             <img
  //               loading="lazy"
  //               src={owner.profilePhoto}
  //               alt="Mess"
  //               className="w-full h-48 md:h-full object-cover rounded-md"
  //               style={{ maxHeight: "300px", borderRadius: "10px" }}
  //             />
  //           </div>
  //         )}

  //         {/* Content Section */}
  //         <div
  //           className={`flex-grow md:ml-6 mt-4 md:mt-0 ${
  //             selected === owner._id && isChecked
  //               ? "border-2 border-[rgb(44,164,181)]"
  //               : ""
  //           }`}
  //           style={{
  //             padding: isChecked ? "29px" : "0px",
  //             borderRadius: isChecked ? "10px" : "0px",
  //             boxShadow: isChecked
  //               ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
  //               : "none",
  //           }}
  //         >
  //           <h3 className="font-medium text-lg">{owner.messName}, In Simhat</h3>
  //           <p className="text-sm text-gray-600 mt-2">
  //             {owner.address} • {distanceMap[owner._id] || "Calculating..."}
  //           </p>
  //           <div className="flex items-center mt-4 text-sm text-gray-500 flex-wrap gap-2">
  //             {owner.facility?.map((feature, index) => (
  //               <span key={index}>
  //                 {feature}
  //                 {index < owner.facility.length - 1 && " • "}
  //               </span>
  //             ))}
  //           </div>

  //           <div className="mt-2">
  //             {owner.roomInfo?.length > 0 ? (
  //               <span>
  //                 Price: ₹
  //                 {Math.min(
  //                   ...owner.roomInfo
  //                     .map((room) => Number(room.pricePerHead))
  //                     .filter((price) => !isNaN(price))
  //                 )}{" "}
  //                 /Month
  //               </span>
  //             ) : (
  //               <span>Price: N/A</span>
  //             )}
  //           </div>

  //           <div className="flex gap-4 mt-4">
  //             <button
  //               className="bg-blue-500 text-white px-4 py-2 rounded-md"
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 clickNavi(owner);
  //               }}
  //             >
  //               View Details
  //             </button>
  //             <button
  //               className="bg-green-500 text-white px-4 py-2 rounded-md"
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 clickBook(owner);
  //               }}
  //             >
  //               Book Now
  //             </button>

  //           </div>
  //           <div className="relative mt-4">
  //             <button
  //               className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-11 h-11 flex items-center justify-center hover:bg-blue-600 transition-colors"
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 // Add your button click handler here
  //                 console.log("Round button clicked", owner._id);
  //               }}
  //             >
              
  //               <img
  //                 src="/assets/i.png"
  //                 alt="i"
  //               />
  //             </button>
  //           </div>
           
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );
}

export default MessBars;
