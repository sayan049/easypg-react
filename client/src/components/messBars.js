import axios from "axios";
import { getDistance } from "ol/sphere";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { findMessUrl, likedMessesUrl, getLikedMessUrl } from "../constant/urls";
import { useInView } from "react-intersection-observer";
import Skeleton from "./Skeleton";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAuth } from "../contexts/AuthContext";
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
import { set } from "ol/transform";

function MessBars({
  isChecked,
  checkFeatures,
  userLocation,
  coords,
  setPgCount,
  finalGender,
  finalPrice,
}) {
  const [messData, setMessData] = useState([]);
  const [distanceMap, setDistanceMap] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [flipped, setFlipped] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState({});
  const [showAllAmenities, setShowAllAmenities] = useState({});
  const token = localStorage.getItem("accessToken");
  const {IsAuthenticated}= useAuth();

  const [lastCardRef, lastCardInView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

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

  const toggleLike = async (id) => {
    const newLikedState = !liked[id];
    setLiked((prev) => ({ ...prev, [id]: newLikedState }));
    if(!IsAuthenticated) return;
    try {
      await axios.post(
        likedMessesUrl,
        {
          messId: id,
          liked: newLikedState,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (err) {
      console.error("Error liking mess:", err);
      // Revert the change
      setLiked((prev) => ({ ...prev, [id]: !newLikedState }));
    }
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

  const fetchLikedMesses = async () => {
    if(!IsAuthenticated) return;
    try {
      const res = await axios.get(getLikedMessUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const likedData = res.data || [];
      const likedMap = {};

      // Assuming likedData is an array of mess objects, not just IDs
      likedData.forEach((mess) => {
        likedMap[mess._id] = true; // Storing the mess ID in the map
        console.log("Liked Mess ID:", mess._id); // Log the actual mess ID
      });

      console.log("Liked Messes:", likedMap); // Log the full map of liked messes
      setLiked(likedMap); // Update state with the liked messes map
    } catch (err) {
      console.error("Failed to fetch liked messes", err);
    }
  };

  useEffect(() => {
    fetchLikedMesses();
  }, []);

  const clickNavi = (owner) => {
    navigate(`/ViewDetails/${owner._id}`);
  };

  const clickBook = (owner) => {
    const ownerParams = new URLSearchParams();
    ownerParams.set("owner", JSON.stringify(owner));
    navigate(`/booking?${ownerParams}`);
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

  const fetchData = async () => {
    if (!hasMore || isLoading) return;
    try {
      if (!userLocation?.lat || !userLocation?.lng) {
        console.error("❌ Invalid user location");
        return;
      }

      setIsLoading(true);

      const res = await axios.get(findMessUrl, {
        params: {
          lat: parseFloat(userLocation.lat),
          lng: parseFloat(userLocation.lng),
          page,
          limit: 5,
        },
      });
      const totalCount = res.data.total || 0;
      // const filteredData = Array.isArray(res.data.data)
      //   ? res.data.data.filter((owner) => {
      //       const facilitiesArray = Array.isArray(owner.facility)
      //         ? owner.facility.flatMap((f) =>
      //             f.split(",").map((item) => item.trim().toLowerCase())
      //           )
      //         : [];
      //       const matchesFeatures =
      //         checkFeatures.length > 0
      //           ? checkFeatures.some((feature) =>
      //               facilitiesArray.includes(feature.toLowerCase())
      //             )
      //           : true;
      //       const matchesGender = finalGender
      //         ? owner.gender?.toLowerCase() === finalGender.toLowerCase()
      //         : true;
      //       const matchesPrice = owner?.roomInfo?.some(
      //         (room) =>
      //           room.pricePerHead >= finalPrice.min &&
      //           room.pricePerHead <= finalPrice.max
      //       );

      //       return matchesFeatures && matchesGender && matchesPrice;
      const filteredData = Array.isArray(res.data.data)
        ? res.data.data.filter((owner) => {
            const matchesPrice = owner?.roomInfo?.some(
              (room) =>
                room.pricePerHead >= finalPrice.min &&
                room.pricePerHead <= finalPrice.max
            );

            const matchesAmenities =
              checkFeatures.length === 0 ||
              checkFeatures.every((af) => owner.facility?.includes(af));

            const matchesGender = finalGender
              ? owner.gender?.toLowerCase() === finalGender.toLowerCase()
              : true;

            return matchesPrice && matchesAmenities && matchesGender;
          })
        : [];

      if (filteredData.length === 0) {
        setHasMore(false);
        return;
      }

      setMessData((prev) =>
        page === 1 ? filteredData : [...prev, ...filteredData]
      );
      // setPgCount((prev) =>
      //   page === 1 ? filteredData.length : prev + filteredData.length
      // );
      setPgCount(totalCount);
      setHasMore(true);

      if (
        filteredData.length > 0 &&
        typeof coords === "function" &&
        page === 1
      ) {
        const [lng, lat] = filteredData[0].location.coordinates;
        coords({ lat, lng });
        setSelected(filteredData[0]._id);
      }
    } catch (err) {
      console.error("❌ Fetch Error", err);
      setError("Failed to fetch Messes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (lastCardInView && !isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [lastCardInView, isLoading, hasMore]);

  useEffect(() => {
    // Reset when filters change
    setMessData([]);
    setDistanceMap({});
    setHasMore(true);
    setPgCount(0);
    setPage(1); // Reset to page 1 immediately
    fetchData();
  }, [checkFeatures, userLocation, finalGender,finalPrice]);

  useEffect(() => {
    fetchData();
  }, [page, userLocation]);

  useEffect(() => {
    if (!messData.length || !userLocation) return;

    const calculateDistances = async () => {
      const newItems = messData.filter((owner) => !distanceMap[owner._id]);
      if (!newItems.length) return;

      const results = await Promise.allSettled(
        newItems.map((owner) =>
          getStreetDistance(userLocation, owner.location.coordinates)
        )
      );

      const newDistanceMap = {};
      results.forEach((res, i) => {
        if (res.status === "fulfilled") {
          newDistanceMap[newItems[i]._id] = res.value;
        }
      });

      setDistanceMap((prev) => ({ ...prev, ...newDistanceMap }));
    };

    calculateDistances();
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
        {messData.map((owner, index) => (
          <div
            key={owner._id}
            ref={index === messData.length - 1 ? lastCardRef : null}
            className={`relative flip-card mb-4 min-h-[34rem] md:min-h-[16rem]  ${
              isChecked ? "w-full" : "w-full"
            } ${
              selected === owner._id && isChecked
                ? "ring-2 ring-blue-500"
                : "ring-1 ring-gray-200"
            } bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-2 md:p-4`}
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
                    <>
                      {owner.roomInfo?.some((room) => room.roomAvailable) ? (
                        <div className="absolute bottom-2 right-2  bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          Available
                        </div>
                      ) : (
                        <div className="absolute bottom-2 right-2  bg-red-100   text-red-700 text-xs px-2 py-1 rounded">
                          Not Available
                        </div>
                      )}
                      <button
                        onClick={() => toggleLike(owner._id)}
                        className="absolute top-2 right-2 text-2xl text-red-500 "
                      >
                        {liked[owner._id] ? (
                          <AiFillHeart />
                        ) : (
                          <AiOutlineHeart />
                        )}
                      </button>
                    </>
                  </div>
                )}

                <div className="flex flex-col justify-between h-full">
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
                      })} */}
                      {(showAllAmenities[owner._id]
                        ? owner.facility
                        : owner.facility?.slice(0, 3)
                      )?.map((feature, index) => {
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

                      {owner.facility?.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllAmenities((prev) => ({
                              ...prev,
                              [owner._id]: !prev[owner._id],
                            }));
                          }}
                          className="text-blue-500 text-xs underline"
                        >
                          {showAllAmenities[owner._id]
                            ? "See less"
                            : "See more"}
                        </button>
                      )}
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

        {isLoading &&
          [...Array(3)].map((_, index) => (
            <Skeleton key={`skeleton-${index}`} />
          ))}

        {!hasMore && messData.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            You've reached the end
          </div>
        )}
      </div>
    </>
  );
}

export default MessBars;
