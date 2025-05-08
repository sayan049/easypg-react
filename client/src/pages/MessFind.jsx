import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MessBars from "../components/messBars";
import Dropdown from "../components/dropdown";
import Toggle from "../components/toggle";
import Map from "../components/map";
import { FaSearch } from "react-icons/fa";
import { LocationIqurl } from "../constant/urls";
import { FaMale, FaFemale, FaUserFriends } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
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
import { FiFilter } from "react-icons/fi";

import { set } from "ol/transform";

export const FilterModal = ({
  isOpen,
  onClose,
  price,
  setPrice,
  amenities,
  featureChanges,
  onApplyFilters,
  gender,
  setGender,
  priceFilter,
  setPriceFilter,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <ToastContainer
        position="top-center"
        toastClassName="!w-[300px]  mx-auto mt-4 sm:mt-0 "
      />
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-md">
        <h3 className="font-medium text-lg mb-4">Select Your Need</h3>
        {/* <div className="mb-6">
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
        </div> */}
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

        <div className="mt-6 flex justify-center">
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

  const { initialItem } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const lat = queryParams.get("lat");
  const lng = queryParams.get("lng");

  // const rawLocation = queryParams.get("userLocation");
  // const userLocation = rawLocation ? JSON.parse(rawLocation) : null;

  // const initialItem = queryParams.get("item");

  // const userLocation = location.state?.userLocation || null;
  // const item = location.state?.item || null;

  const [price, setPrice] = useState(1500);
  const [item, setItem] = useState(initialItem || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [checkFeatures, setCheckFeatures] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [tempCheckFeatures, setTempCheckFeatures] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [pgCount, setPgCount] = useState(0);
  const [gender, setGender] = useState("");
  const [finalGender, setFinalGender] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 100000 });

  let debounceTimeout;

  const handleCoordinatesChange = (newCoords) => {
    setCoordinates(newCoords);
  };

  const handleInputChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    // setSelectedLocation(null);

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
  //   //  setSearchQuery(suggestion.display_name);
  //   // performSearch();
  //   setSuggestions([]);
  //   navigate("/MessFind", {
  //     state: { userLocation: selectedLocation, item: suggestion.display_name },
  //   });
  // };
  const handleSuggestionClick = (suggestion) => {
    const coords = { lat: suggestion.lat, lng: suggestion.lon };
    setSearchQuery(suggestion.display_name);
    setSelectedLocation(coords);
    setItem(suggestion.display_name);
    setSuggestions([]);
    // navigate("/MessFind", {
    //   state: { userLocation: coords, item: suggestion.display_name },
    // });
  };

  const performSearch = () => {
    if (!selectedLocation) {
      toast.error("Please select a valid location from suggestions!");
      // alert("Please select a valid location from suggestions!");
      return;
    }
    navigate("/find-mess", {
      state: { userLocation: selectedLocation, item: searchQuery },
    });
    // setSearchQuery("");
  };

  // useEffect(() => {
  //   const rawLoc = queryParams.get("userLocation");
  //   const item = queryParams.get("item");

  //   if (rawLoc) {
  //     try {
  //       setSelectedLocation(JSON.parse(rawLoc));
  //     } catch {
  //       setSelectedLocation(null);
  //     }
  //   }

  //   if (item) setItem(item);
  // }, [location.search]);
  useEffect(() => {
    if (lat && lng) {
      setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  }, [lat, lng]);

  useEffect(() => {
    // You can now directly use `initialItem` and `selectedLocation` in your logic
    if (initialItem) {
      setItem(initialItem);
    }
  }, [initialItem]);

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
    <div className="flex flex-col md:flex-row p-4 bg-gray-50 min-h-screen overflow-hidden h-screen">
      <Helmet>
        <title>{`Find Student Accommodations in ${
          item?.split(",")[0] || ""
        } | Mess Mate`}</title>
        <meta
          name="description"
          content={`Search for PG accommodations, hostels, and student mess facilities in ${
            item?.split(",")[0] || "your area"
          }. Filter by price, amenities, and gender preferences. View locations on map.`}
        />
        <meta
          name="keywords"
          content={`student accommodation, PG search, hostel finder, ${
            item?.split(",")[0]
          } PG, affordable mess`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="/assets/og-messfind.jpg" />
        <link rel="canonical" href={window.location.href} />
        <meta
          property="og:title"
          content={`Find PGs in ${item?.split(",")[0]}`}
        />
        <meta
          property="og:description"
          content={`Explore student mess and PG accommodations in ${
            item?.split(",")[0] || "your area"
          }. Sort by price, amenities, gender-specific housing, and more.`}
        />
      </Helmet>
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-white p-4 shadow rounded-md hidden md:block h-screen overflow-y-auto border-r-2 border-r-primary-default">
        <h2 className="text-lg font-bold">Search Filters</h2>
        {/* <div className="mt-6">
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
        </div> */}
        <fieldset className="mb-6">
          <legend className="font-medium mb-2">Price Range (₹)</legend>
          {/* <h4 className="font-medium">Price Range (₹)</h4> */}
          <div className="flex items-center gap-4 mt-2">
            <label htmlFor="minPrice" className="sr-only">
              Minimum Price
            </label>
            <input
              id="minPrice"
              type="number"
              placeholder="Min"
              className="w-full p-2 border-2 border-primary-light focus:border-primary hover:border-primary-dark rounded-md transition-colors duration-200 outline-none"
              value={priceFilter.min}
              onChange={(e) =>
                setPriceFilter((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }))
              }
            />

            <span aria-hidden="true">to</span>
            <label htmlFor="maxPrice" className="sr-only">
              Maximum Price
            </label>
            <input
              id="maxPrice"
              type="number"
              placeholder="Max"
              className="w-full p-2 border-2 border-primary-light focus:border-primary hover:border-primary-dark rounded-md transition-colors duration-200 outline-none"
              value={priceFilter.max}
              onChange={(e) =>
                setPriceFilter((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }))
              }
            />
          </div>
        </fieldset>
        <div className="mt-6">
          <h3 className="font-medium">Select Your Need</h3>
          <hr className="border-gray-700 w-1/2 my-2" />
          <div className="flex flex-col gap-4 mt-4">
            <fieldset>
              <legend className="font-medium mb-2">Amenities</legend>
              <div className="flex flex-col gap-3">
                {amenities.map((facility) => (
                  <label
                    key={facility.id}
                    className="flex items-center text-sm"
                  >
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
            </fieldset>

            <div className="mb-6 mt-2">
              <fieldset>
                <legend className="font-medium mb-2">Gender Preference</legend>
                {/* <h4 className="font-medium">Gender</h4> */}
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
              </fieldset>
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow w-1/2 left-1/4 relative mb-3"
              onClick={onApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Listings */}
      <main className="w-full md:w-3/4 md:mt-0 md:ml-6 relative">
        <section aria-label="Search accommodations">
          <div className="flex flex-row md:flex-row justify-between items-center bg-white p-4  rounded-md relative">
            {/* Search Bar */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-gray-300 shadow-sm hover:border-primary-dark transition-colors w-full relative">
              {/* <input
              type="text"
              placeholder="Search mess by location"
              className="w-full p-1 text-base outline-none placeholder-gray-400"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && performSearch()}
            /> */}
              <label htmlFor="searchInput" className="sr-only">
                Search mess by location
              </label>
              <input
                id="searchInput"
                type="text"
                placeholder="Search mess by location"
                className="w-full p-1 text-base outline-none placeholder-gray-400"
                autoComplete="off"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!selectedLocation) return alert("Pick suggestion!");
                    setSuggestions([]);
                  }
                  // if (suggestions.length > 0) {
                  //   handleSuggestionClick(suggestions[0]); // auto-pick first suggestion
                  // } else {
                  //   toast.error("Pick a valid location from suggestions");
                  // }
                }}
              />

              <button
                type="button"
                onClick={(e) => {
                  if (suggestions.length > 0) {
                    handleSuggestionClick(suggestions[0]); // auto-pick first suggestion
                  } else {
                    toast.error("Pick a valid location from suggestions");
                  }
                }}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 focus:outline-none"
                aria-label="Search"
              >
                <FaSearch className="w-5 h-5 text-gray-400" />
              </button>

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
        </section>

        {/* Content */}
        <section aria-label="Search results">
          <div className="mt-6" style={{ height: "calc(100vh - 200px)" }}>
            <div className="text-lg font-bold mb-4 flex items-center justify-between mx-4">
              {pgCount} Mess near {item?.split(",")[0]}
              <FiFilter
                className="md:hidden cursor-pointer ml-4 w-6 h-6 text-gray-600"
                onClick={() => setFilterModalOpen(true)}
              />
            </div>
            <div className="flex" style={{ height: "104%" }}>
              <div className="flex-1 overflow-y-auto ">
                {selectedLocation && (
                  <MessBars
                    key={`${selectedLocation.lat}-${selectedLocation.lng}`}
                    checkFeatures={checkFeatures}
                    isChecked={isChecked}
                    userLocation={selectedLocation}
                    coords={handleCoordinatesChange}
                    setPgCount={setPgCount}
                    finalGender={finalGender}
                    finalPrice={priceFilter}
                  />
                )}
              </div>
              {isChecked && (
                <div className="w-1/2 pl-4">
                  <Map
                    isChecked={isChecked}
                    coordinates={coordinates}
                    aria-label="Accommodation locations map"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

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
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modalTitle"
      />
    </div>
  );
};

export default MessFind;
