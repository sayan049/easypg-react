"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getCartUrl, getLikedMessUrl, likedMessesUrl } from "../constant/urls";
import { ToastContainer, toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Skeleton from "./Skeleton";
import {
  MdOutlineAcUnit,
  MdTv,
  MdOutlinePower,
  MdWifi,
  MdKitchen,
  MdWater,
  MdBed,
} from "react-icons/md";
import { MapPin, Filter, Search, Trash2, Heart } from "lucide-react";
import { FaMale, FaFemale, FaUsers, FaUserFriends } from "react-icons/fa";

const amenities = [
  {
    id: "test1",
    label: "A/C",
    icon: <MdOutlineAcUnit className="text-blue-500" />,
  },
  { id: "test2", label: "TV", icon: <MdTv className="text-blue-500" /> },
  {
    id: "test3",
    label: "Power Backup",
    icon: <MdOutlinePower className="text-blue-500" />,
  },
  { id: "test4", label: "WiFi", icon: <MdWifi className="text-blue-500" /> },
  {
    id: "test5",
    label: "Kitchen",
    icon: <MdKitchen className="text-blue-500" />,
  },
  {
    id: "test6",
    label: "Tank Water",
    icon: <MdWater className="text-blue-500" />,
  },
  {
    id: "test7",
    label: "Double Bed",
    icon: <MdBed className="text-blue-500" />,
  },
];

const Cart = () => {
  const [messData, setMessData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 50000 });
  const [amenityFilters, setAmenityFilters] = useState([]);
  const [liked, setLiked] = useState({});
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);

  // const fetchMessData = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(getCartUrl, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
  //       },
  //       withCredentials: true,
  //     });
  //     setMessData(res.data || []);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to fetch mess data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchMessData();
  // }, []);

  // const fetchLikedMesses = async () => {
  //   try {
  //     const res = await axios.get(getLikedMessUrl, {
  //       //  headers: { Authorization: `Bearer ${token}` },
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
  //       },
  //       withCredentials: true,
  //     });

  //     const likedData = res.data || [];
  //     const likedMap = {};

  //     // Assuming likedData is an array of mess objects, not just IDs
  //     likedData.forEach((mess) => {
  //       likedMap[mess._id] = true; // Storing the mess ID in the map
  //      // console.log("Liked Mess ID:", mess._id); // Log the actual mess ID
  //     });

  //    // console.log("Liked Messes:", likedMap); // Log the full map of liked messes
  //     setLiked(likedMap); // Update state with the liked messes map
  //   } catch (err) {
  //     console.error("Failed to fetch liked messes", err);
  //   }
  // };

  const fetchMessData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(getCartUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });

      if (Array.isArray(res.data) && res.data.length > 0) {
        setMessData(res.data);
      } else {
        setMessData([]); // Clear state if empty
        toast.info("No messes found in your cart.");
      }
    } catch (err) {
      console.error("Failed to fetch mess data:", err);
      if (err.response?.status === 404) {
        toast.info("No messes found in your cart.");
      } else {
        toast.error(err.response?.data?.message||"Something went wrong while fetching mess data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedMesses = async () => {
    try {
      const res = await axios.get(getLikedMessUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });

      const likedData = res.data || [];

      if (!Array.isArray(likedData) || likedData.length === 0) {
        setLiked({});
        toast.info("You haven't liked any mess yet.");
        return;
      }

      const likedMap = {};
      likedData.forEach((mess) => {
        likedMap[mess._id] = true;
      });

      setLiked(likedMap);
    } catch (err) {
      console.error("Failed to fetch liked messes:", err);

      if (err.response?.status === 404) {
        setLiked({});
        toast.info("You haven't liked any mess yet.");
      } else {
        toast.error(err.response?.data?.message||"Something went wrong while fetching liked messes.");
      }
    }
  };
  useEffect(() => {
    fetchMessData();
    fetchLikedMesses();
  }, []);

  const toggleLike = async (id) => {
    const newLikedState = !liked[id];
    setLiked((prev) => ({ ...prev, [id]: newLikedState }));
    try {
      await axios.post(
        likedMessesUrl,
        {
          messId: id,
          liked: newLikedState,
        },
        {
          withCredentials: true, // Automatically send cookies
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Bypass tracking prevention
          },
        }
      );
    } catch (err) {
      console.error("Error liking mess:", err);
      // Revert the change
      setLiked((prev) => ({ ...prev, [id]: !newLikedState }));
    }
  };

  const clickNavi = (owner) => {
    navigate(`/details/${owner._id}`);
  };

  const clickBook = (owner) => {
    navigate(`/booking/${owner._id}`);
  };

  const toggleAmenityFilter = (label) => {
    setAmenityFilters((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  const removeItem = (id) => {
    setMessData(messData.filter((mess) => mess._id !== id));
    // Optionally: Add backend call to remove from saved list
  };

  const filteredMesses = messData.filter((mess) => {
    const matchesSearch =
      mess.messName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mess.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice = mess?.roomInfo?.some(
      (room) =>
        room.pricePerHead >= priceFilter.min &&
        room.pricePerHead <= priceFilter.max
    );

    const matchesAmenities =
      amenityFilters.length === 0 ||
      amenityFilters.every((af) => mess.facility?.includes(af));

    const matchesGender = gender
      ? mess.gender?.toLowerCase() === gender.toLowerCase()
      : true;

    return matchesSearch && matchesPrice && matchesAmenities && matchesGender;
  });

  const getAmenityIcon = (label) =>
    amenities.find((a) => a.label === label)?.icon || null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ToastContainer />
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Saved Messes</h1>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search saved messes..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="h-screen fixed top-[-24px] inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-md">
              <h3 className="font-medium text-lg mb-4">Select Your Need</h3>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium">Price Range (₹)</h4>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full p-2 border rounded-md"
                    value={priceFilter.min}
                    onChange={(e) =>
                      setPriceFilter((prev) => ({
                        ...prev,
                        min: Number(e.target.value),
                      }))
                    }
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full p-2 border rounded-md"
                    value={priceFilter.max}
                    onChange={(e) =>
                      setPriceFilter((prev) => ({
                        ...prev,
                        max: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2 flex-col">
                  {amenities.map((facility) => (
                    <label
                      key={facility.id}
                      className="flex items-center text-sm gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={amenityFilters.includes(facility.label)}
                        onChange={() => toggleAmenityFilter(facility.label)}
                        className="accent-blue-500"
                      />
                      <span className="text-lg">{facility.icon}</span>
                      {facility.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <h4 className="font-medium">Gender</h4>
                <div className="flex flex-col gap-2 mt-2 text-sm">
                  {[
                    {
                      label: "Boys PG",
                      value: "boys pg",
                      icon: <FaMale className="text-blue-500 mr-2" />,
                    },
                    {
                      label: "Girls PG",
                      value: "girls pg",
                      icon: <FaFemale className="text-pink-500 mr-2" />,
                    },
                    {
                      label: "Co-ed PG",
                      value: "coed pg",
                      icon: <FaUserFriends className="text-green-500 mr-2" />,
                    },
                    {
                      label: "Any",
                      value: "",
                      icon: <span className="text-gray-500 mr-2">🌐</span>,
                    },
                  ].map(({ label, value, icon }) => (
                    <label key={value} className="flex items-center">
                      <input
                        type="radio"
                        name="modal-gender"
                        value={value}
                        checked={gender === value}
                        onChange={() => setGender(value)}
                        className="mr-2"
                      />
                      {icon}
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="text-gray-500 px-4 py-2"
                  onClick={() => setShowFilters(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {loading && [1, 2, 3, 4, 5].map((i) => <Skeleton key={i} />)}

        {(filteredMesses.length && !loading) === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No saved messes found
            </h2>
            <p className="text-gray-500 max-w-md">
              {messData.length === 0
                ? "You haven't saved any messes yet. Browse and like messes to see them here."
                : "No messes match your current search or filters. Try adjusting your criteria."}
            </p>
          </div>
        )}

        {/* Mess Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMesses.map((mess) => (
            <div
              key={mess._id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={mess.profilePhoto || "/placeholder.svg"}
                  alt={mess.messName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    {mess.roomInfo?.some((r) => r.roomAvailable)
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>
                {/* <button
                  className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  onClick={() => removeItem(mess._id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button> */}
                <button
                  onClick={() => toggleLike(mess._id)}
                  className="absolute top-2 right-2 text-2xl text-red-500 "
                >
                  {liked[mess._id] ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {mess.messName}
                </h3>
                <div className="flex items-start gap-1.5 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{mess.address}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {mess.facility?.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between flex-wrap">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ₹
                      {Math.min(
                        ...mess.roomInfo.map((r) => r.pricePerHead)
                      ).toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <div>
                    {mess?.gender && (
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        {mess.gender.toLowerCase() === "girls pg" && (
                          <span className="flex items-center gap-1 bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                            <FaFemale />
                            Girls PG
                          </span>
                        )}
                        {mess.gender.toLowerCase() === "boys pg" && (
                          <span className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            <FaMale />
                            Boys PG
                          </span>
                        )}
                        {mess.gender.toLowerCase() === "coed pg" && (
                          <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full">
                            <FaUsers />
                            Co-ed PG
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex m-3 justify-between">
                  <button
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                    onClick={() => clickNavi(mess)}
                  >
                    View Details
                  </button>
                  <button
                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => clickBook(mess)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
