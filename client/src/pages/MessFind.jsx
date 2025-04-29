import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MessBars from "../components/messBars";
import Dropdown from "../components/dropdown";
import Toggle from "../components/toggle";
import Map from "../components/map";
import { FaSearch } from "react-icons/fa";
import { LocationIqurl } from "../constant/urls";
import { FaMale, FaFemale, FaUserFriends } from "react-icons/fa";
import {
  MdOutlineAccessTime,
  MdOutlineHome,
  MdOutlineHistory,
  MdOutlineWifi,
  MdOutlineKitchen,
  MdOutlinePower,
  MdTv,
  MdOutlineAcUnit,
  MdBed,
  MdOpacity,
  MdPhone,
  MdEmail,
  MdPersonOutline,
  MdKitchen,
  MdWifi,
  MdWater,
} from "react-icons/md";
import { set } from "ol/transform";

const FilterModal = ({
  isOpen,
  onClose,
  price,
  setPrice,
  amenities,
  featureChanges,
  onApplyFilters,
  gender,
  setGender,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-md">
        <h3 className="font-medium text-lg mb-4">Select Your Need</h3>
        <div className="mb-6">
          <h4 className="font-medium">Price</h4>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>₹{price}</span>
            <span>₹9000</span>
          </div>
          <input
            type="range"
            className="w-full mt-2 accent-blue-500"
            min="1500"
            max="9000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-medium">Amenities</h4>
          {amenities.map((facility) => (
            <label key={facility.id} className="flex items-center text-sm">
              <input
                type="checkbox"
                onClick={featureChanges}
                value={facility.label}
                className="mr-2 accent-blue-500"
              />
              <span className="text-lg mr-2">{facility.icon}</span>
              {facility.label}
            </label>
          ))}
        </div>

        <div className="mb-6 mt-2">
          <h4 className="font-medium">Gender</h4>
          <div className="flex flex-col gap-2 mt-2 text-sm">
            <label className="flex items-center">
              <input
                type="radio"
                name="modal-gender" // Unique name for the modal's radio group
                value="boys pg"
                checked={gender === "boys pg"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2 accent-blue-500"
              />
              <FaMale className="text-blue-500 mr-2" /> Boys PG
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="modal-gender" // Unique name
                value="girls pg"
                checked={gender === "girls pg"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2 accent-pink-500"
              />
              <FaFemale className="text-pink-500 mr-2" /> Girls PG
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="modal-gender" // Unique name
                value="coed pg"
                checked={gender === "coed pg"}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2 accent-green-500"
              />
              <FaUserFriends className="text-green-500 mr-2" /> Co-ed PG
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="modal-gender" // Unique name
                value=""
                checked={gender === ""}
                onChange={(e) => setGender("")}
                className="mr-2 accent-gray-500"
              />
              <span className="text-gray-500 mr-2">🌐</span> Any
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
            onClick={onApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const MessFind = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userLocation = location.state?.userLocation || null;
  const item = location.state?.item || null;

  const [price, setPrice] = useState(1500);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [checkFeatures, setCheckFeatures] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [tempCheckFeatures, setTempCheckFeatures] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [pgCount, setPgCount] = useState(0);
  const [gender, setGender] = useState("");
  const [finalGender, setFinalGender] = useState("");

  let debounceTimeout;

  const handleCoordinatesChange = (newCoords) => {
    setCoordinates(newCoords);
  };

  const handleInputChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 3) {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(async () => {
        try {
          const fetchUrl = `${LocationIqurl}?input=${encodeURIComponent(
            query
          )}`;
          const response = await fetch(fetchUrl);
          const data = await response.json();
          setSuggestions(data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }, 500); // 0.5s debounce
    } else {
      setSuggestions([]);
    }
  };

  // const handleSuggestionClick = (suggestion) => {
  //   setSearchQuery(suggestion.display_name);
  //   setSelectedLocation({
  //     lat: suggestion.lat,
  //     lng: suggestion.lon,
  //   });
  //   setSuggestions([]);

  //   setTimeout(() => {
  //     performSearch();
  //   }, 100);
  // };
  const handleSuggestionClick = (suggestion) => {
    const newLocation = {
      lat: suggestion.lat,
      lng: suggestion.lon,
    };

    setSearchQuery(suggestion.display_name);
    setSelectedLocation(newLocation);
    setSuggestions([]);

    performSearch(newLocation); // use the correct new location
  };

  // const performSearch = () => {
  //   if (!selectedLocation) {
  //     alert("Please select a valid location from suggestions!");
  //     return;
  //   }
  //   navigate("/MessFind", {
  //     state: { userLocation: selectedLocation, item: searchQuery },
  //   });
  //   setSearchQuery("");
  // };
  const performSearch = (locationOverride) => {
    const locationToUse = locationOverride || selectedLocation;

    if (!locationToUse) {
      alert("Please select a valid location from suggestions!");
      return;
    }

    navigate("/MessFind", {
      state: { userLocation: locationToUse, item: searchQuery },
    });

    setSearchQuery("");
  };

  useEffect(() => {
    if (userLocation) {
      setSelectedLocation(userLocation);
    }
  }, [userLocation, finalGender, gender, checkFeatures]);

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

  const featureChanges = (e) => {
    const { value, checked } = e.target;
    setTempCheckFeatures((prev) =>
      checked ? [...prev, value] : prev.filter((f) => f !== value)
    );
  };

  const onApplyFilters = () => {
    setCheckFeatures([...tempCheckFeatures]);
    setFinalGender(gender);
    setFilterModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 bg-gray-50 min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-4 shadow rounded-md hidden md:block">
        <h2 className="text-lg font-bold">Filter</h2>
        <div className="mt-6">
          <h3 className="font-medium">Price</h3>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>₹{price}</span>
            <span>₹9000</span>
          </div>
          <input
            type="range"
            className="w-full mt-2 accent-blue-500"
            min="1500"
            max="9000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mt-6">
          <h3 className="font-medium">Select Your Need</h3>
          <div className="flex flex-col gap-4 mt-4">
            <h4 className="font-medium">Amenities</h4>
            {amenities.map((facility) => (
              <label key={facility.id} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  onClick={featureChanges}
                  value={facility.label}
                  className="mr-2 accent-blue-500"
                />
                <span className="text-lg mr-2 accent-blue-500">
                  {facility.icon}
                </span>
                {facility.label}
              </label>
            ))}
            <div className="mb-6 mt-2">
              <h4 className="font-medium">Gender</h4>
              <div className="flex flex-col gap-2 mt-2 text-sm">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="boys pg"
                    checked={gender === "boys pg"}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2 accent-blue-500"
                  />
                  <FaMale className="text-blue-500 mr-2" /> Boys PG
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="girls pg"
                    checked={gender === "girls pg"}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2 accent-pink-500"
                  />
                  <FaFemale className="text-pink-500 mr-2" /> Girls PG
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="coed pg"
                    checked={gender === "coed pg"}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2 accent-green-500"
                  />
                  <FaUserFriends className="text-green-500 mr-2" /> Co-ed PG
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value=""
                    checked={gender === ""}
                    onChange={(e) => setGender("")}
                    className="mr-2 accent-gray-500"
                  />
                  <span className="text-gray-500 mr-2">🌐</span> Any
                </label>
              </div>
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow w-1/2 left-1/4 relative"
              onClick={onApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="w-full md:w-3/4 md:mt-0 md:ml-6 relative">
        <div className="flex flex-row md:flex-row justify-between items-center bg-white p-4  rounded-md relative">
          {/* Search Bar */}
          <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-300 shadow-sm hover:border-blue-500 transition-colors w-full relative">
            <input
              type="text"
              placeholder="Search mess by location"
              className="w-full p-1 text-base outline-none placeholder-gray-400"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && performSearch()}
            />
            <FaSearch
              className="w-5 h-5 text-gray-400 cursor-pointer"
              onClick={performSearch}
            />

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-14 left-0 w-full bg-white border rounded shadow-lg z-20 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className=" items-center gap-4 mx-4 hidden md:flex">
            <Toggle
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              className="hidden md:block"
            />
            <span className="hidden md:block w-[6rem]">Map View</span>
            <Dropdown className="hidden md:block" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-6" style={{ height: "calc(100vh - 200px)" }}>
          <div className="text-lg font-bold mb-4 flex items-center justify-between mx-4">
            {pgCount} Mess near {item?.split(",")[0]}
            <img
              className="md:hidden  cursor-pointer ml-4"
              alt="Filter"
              src="/assets/button.png"
              onClick={() => setFilterModalOpen(true)}
            />
          </div>
          <div className="flex" style={{ height: "104%" }}>
            <div className="flex-1 overflow-y-auto ">
              <MessBars
                checkFeatures={checkFeatures}
                isChecked={isChecked}
                userLocation={userLocation}
                coords={handleCoordinatesChange}
                setPgCount={setPgCount}
                finalGender={finalGender}
              />
            </div>
            {isChecked && (
              <div className="w-1/2 pl-4">
                <Map isChecked={isChecked} coordinates={coordinates} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal for Mobile */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        price={price}
        setPrice={setPrice}
        amenities={amenities}
        featureChanges={featureChanges}
        onApplyFilters={onApplyFilters}
        gender={gender}
        setGender={setGender}
      />
    </div>
  );
};

export default MessFind;
