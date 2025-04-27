import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MessBars from "../components/messBars";
import Dropdown from "../components/dropdown";
import Toggle from "../components/toggle";
import Map from "../components/map";
import { FaSearch } from "react-icons/fa";

const FilterModal = ({
  isOpen,
  onClose,
  price,
  setPrice,
  amenities,
  featureChanges,
  onApplyFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-md">
        <h3 className="font-medium text-lg mb-4">Select Your Need</h3>
        {/* Price Filter */}
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
        {/* Amenities */}
        <div className="flex flex-col gap-4">
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
        {/* Apply Filters Button */}
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
  const userLocation = location.state?.userLocation || null;
  const item = location.state?.item || null; // Retrieve items from Homepage
  // Retrieve lat/lon from Homepage
  console.log("🔍 Full Navigation State in MessFind:", location.state);
  console.log("📍 Extracted User Location:", userLocation);

  const [price, setPrice] = useState(1500);
  const [checkFeatures, setCheckFeatures] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [tempCheckFeatures, setTempCheckFeatures] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [pgCount, setPgCount] = useState(0);

  const handleCoordinatesChange = (newCoords) => {
    setCoordinates(newCoords);
  };

  useEffect(() => {
    console.log("Selected Features:", checkFeatures);
    if (userLocation) {
      console.log("User Location:", userLocation); // Debugging
    }
  }, [checkFeatures, userLocation]);

  const amenities = [
    { id: "test1", label: "A/C", icon: "💨" },
    { id: "test2", label: "TV", icon: "📺" },
    { id: "test3", label: "Power Backup", icon: "🔋" },
    { id: "test4", label: "WiFi", icon: "📶" },
    { id: "test5", label: "Kitchen", icon: "🍴" },
    { id: "test6", label: "Tank Water", icon: "💧" },
    { id: "test7", label: "Double Bed", icon: "🛏️" },
  ];

  // const featureChanges = (e) => {
  //   const { value, checked } = e.target;

  //   setTempCheckFeatures((prev) => {
  //     if (checked) {
  //       // Add feature if checked
  //       return [...prev, value];
  //     } else {
  //       // Remove feature if unchecked
  //       return prev.filter((feature) => feature !== value);
  //     }
  //   });

  //   console.log("🛠 Selected Features:", tempCheckFeatures);
  //   console.log("value:", value);
  // };
  const featureChanges = (e) => {
    const { value, checked } = e.target;

    setTempCheckFeatures((prev) => {
      const updated = checked
        ? [...prev, value]
        : prev.filter((f) => f !== value);

      console.log("🛠 Will Set Features To:", updated); // This reflects what will be set
      return updated;
    });

    console.log("Clicked Value:", value);
  };

  const onApplyFilters = () => {
    console.log("📢 Applying Filters:", tempCheckFeatures);
    setCheckFeatures([...tempCheckFeatures]); // ✅ Ensures new filters are applied
    setFilterModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 bg-gray-50 min-h-screen overflow-hidden">
      {/* Filter Sidebar for Desktop */}
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
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow w-1/2 left-1/4 relative"
              onClick={onApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="w-full md:w-3/4 md:mt-0 md:ml-6">
        <div className="flex justify-between items-center bg-white p-4 shadow rounded-md">
          {/* <h2 className="text-lg font-bold hidden md:block">
            {pgCount} Mess near {item.split(",")[0]}
          </h2> */}

          {/* implement a search bar here  */}
          <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-300 shadow-sm hover:border-blue-500 transition-colors w-full">
            <FaSearch className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search mess by location, price, or facilities"
              className="w-full p-1 text-base outline-none placeholder-gray-400"
              // value={searchQuery}
              // onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center gap-4 mx-4">
            <Toggle
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              className="hidden md:block"
            />
            <span className="hidden md:block">Map View</span>
            <Dropdown className="hidden md:block" />
          </div>
          <img
            className="md:hidden m-4"
            alt="x"
            src="/assets/filter 1.png"
            onClick={() => setFilterModalOpen(true)}
          />
        </div>

        {/* Listings */}
        {/* <div className="mt-6 flex flex-col gap-6">
          <div className="text-lg font-bold md:hidden">{pgCount} Mess Found</div>
          <div style={{ display: isChecked ? "flex" : "block" }}>
            <MessBars checkFeatures={checkFeatures} isChecked={isChecked} userLocation={userLocation}  coords={handleCoordinatesChange}  setPgCount={setPgCount}/>
            <Map isChecked={isChecked} coordinates={coordinates} />
          </div>
        </div>
      </div> */}
        <div className="mt-6" style={{ height: "calc(100vh - 200px)" }}>
          <div className="text-lg font-bold ">
            {pgCount} Mess near {item.split(",")[0]}
          </div>
          <div className="flex" style={{ height: "100%" }}>
            {/* Scroll only MessBars */}
            <div className="flex-1 overflow-y-auto pr-4">
              <MessBars
                checkFeatures={checkFeatures}
                isChecked={isChecked}
                userLocation={userLocation}
                coords={handleCoordinatesChange}
                setPgCount={setPgCount}
              />
            </div>

            {/* Map stays fixed */}
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
      />
    </div>
  );
};

export default MessFind;
