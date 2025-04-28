import axios from "axios";
import { getDistance } from "ol/sphere";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findMessUrl } from "../constant/urls";
import {
  FaWind,
  FaTv,
  FaBatteryFull,
  FaWifi,
  FaUtensils,
  FaTint,
  FaBed,
  FaFemale,
  FaMale,
  FaUsers,
} from "react-icons/fa";

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
  const [selected, setSelected] = useState(messData[0]?._id || null);
  const [flipped, setFlipped] = useState({});

  const amenities = [
    { id: "test1", label: "A/C", icon: <FaWind /> },
    { id: "test2", label: "TV", icon: <FaTv /> },
    { id: "test3", label: "Power Backup", icon: <FaBatteryFull /> },
    { id: "test4", label: "WiFi", icon: <FaWifi /> },
    { id: "test5", label: "Kitchen", icon: <FaUtensils /> },
    { id: "test6", label: "Tank Water", icon: <FaTint /> },
    { id: "test7", label: "Double Bed", icon: <FaBed /> },
  ];

  const toggleFlip = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const styles = `
    .flip-card {
      perspective: 1000px;
    }
    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    .flip-card-front, .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 0.75rem;
    }
    .flip-card-back {
      transform: rotateY(180deg);
    }
    .flipped {
      transform: rotateY(180deg);
    }
  `;

  const getStreetDistance = async (orig, dest) => {
    try {
      const startLon = parseFloat(orig.lng);
      const startLat = parseFloat(orig.lat);
      const endLon = parseFloat(dest[0]);
      const endLat = parseFloat(dest[1]);

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=false`
      );
      const data = await response.json();

      if (data.routes?.[0]?.distance) {
        return `${(data.routes[0].distance / 1000).toFixed(1)} km`;
      }

      const distance = getDistance([startLon, startLat], [endLon, endLat]);
      return `${(distance / 1000).toFixed(1)} km (straight line)`;
    } catch (err) {
      console.error("Distance calculation error:", err);
      return "N/A";
    }
  };

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
        if (filteredData.length > 0 && typeof coords === "function") {
          const [lng, lat] = filteredData[0].location.coordinates;
          coords({ lat, lng });
          setSelected(filteredData[0]._id); // optional: also select first card
        }
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <style>{styles}</style>
      <div
        className={`grid gap-4 p-2 sm:p-4 ${isChecked ? "grid-cols-1" : ""}`}
      >
        {messData.map((owner) => (
          <div
            key={owner._id}
            // className={`relative flip-card h-[31rem] mb-4  ${
            //   isChecked ? "md:h-[15rem]" : "md:h-[15rem]"
            // } ${
            //   selected === owner._id && isChecked
            //     ? "ring-2 ring-blue-500"
            //     : "ring-1 ring-gray-200"
            // } bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4`}
            className={`relative flip-card mb-4 h-[31rem] md:h-[16rem] ${
              isChecked ? "w-full" : "w-full"
            }
             ${
               selected === owner._id && isChecked
                 ? "ring-2 ring-blue-500"
                 : "ring-1 ring-gray-200"
             }
            bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4`}
            onClick={() => {
              if (owner?.location?.coordinates) {
                clickCords(owner.location.coordinates, owner._id);
              }
            }}
          >
            <div
              className={`flip-card-inner ${
                flipped[owner._id] ? "flipped" : ""
              }`}
            >
              {/* FRONT SIDE */}
              {/* <div className="flip-card-front grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4"> */}
              <div
                className={`flip-card-front grid gap-4 w-full h-full ${
                  isChecked ? "grid-cols-1" : "md:grid-cols-[1fr_2fr]"
                }`}
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

                {/* <div className={`"flex flex-col justify-between" ${isChecked ? "w-full" : ""}`}>  */}
                <div className="flex flex-col justify-between h-full">
                  {/* this div is not changing according to it's parent it always stays constant  sometime it shrinked sometimes out of the div fix it */}

                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {owner.messName}
                      </h3>
                      <button
                        className="p-2 hover:bg-blue-200 rounded-full transition-colors md:hidden"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlip(owner._id);
                        }}
                      >
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {owner.address} .
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
                      {/* {owner.facility?.map((feature, index) => {
                        <span
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-[rgb(44 164 181)] text-xs rounded-full"
                        >
                          {feature}
                        </span>;
                      })} */}
                      {owner.facility?.map((feature, index) => {
                        const amenity = amenities.find(
                          (a) =>
                            a.label.toLowerCase() ===
                            feature.trim().toLowerCase()
                        );
                        return (
                          <span
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-[rgb(44 164 181)] text-xs rounded-full"
                          >
                            {amenity?.icon || null}
                            {feature}
                          </span>
                        );
                      })}
                    </div>
                   
                    {owner?.gender && (
                      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                        {owner.gender.toLowerCase() === "girls pg" && (
                          <span className="flex items-center gap-1 bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                            <FaFemale />
                            Girls PG
                          </span>
                        )}
                        {owner.gender.toLowerCase() === "boys pg" && (
                          <span className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            <FaMale />
                            Boys PG
                          </span>
                        )}
                        {owner.gender.toLowerCase() === "coed pg" && (
                          <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full">
                            <FaUsers />
                            Co-ed PG
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-lg font-medium text-gray-900">
                      {owner.roomInfo?.length > 0
                        ? `₹${Math.min(
                            ...owner.roomInfo
                              .map((room) => Number(room.pricePerHead))
                              .filter(Number)
                          )} /month`
                        : "Price: N/A"}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          clickNavi(owner);
                        }}
                      >
                        View Details
                      </button>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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

              {/* BACK SIDE */}
              <div className="flip-card-back flex items-center justify-center bg-gray-100">
                <div className="w-full h-full sm:h-full">
                  <iframe
                    src={`https://www.google.com/maps?q=${owner.location.coordinates[1]},${owner.location.coordinates[0]}&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    className="rounded-xl"
                    loading="lazy"
                  ></iframe>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFlip(owner._id);
                  }}
                  className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-full shadow"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MessBars;
