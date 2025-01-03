import React, { useState, useEffect } from "react";
import MessBars from "../components/messBars";
import Dropdown from "../components/dropdown";
import Toggle from "../components/toggle";
import Map from "../components/map";

const FilterModal = ({ isOpen, onClose, price, setPrice, amenities, featureChanges }) => {
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
        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
            onClick={onClose}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const NewMessFind = () => {
  const [price, setPrice] = useState(1500);
  const [checkFeatures, setCheckFestures] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const handleCoordinatesChange = (newCoords) => {
    setCoordinates(newCoords);
  };

  useEffect(() => {
    console.log("CheckFeatures updated:", checkFeatures);
  }, [checkFeatures]);

  const amenities = [
    { id: "test1", label: "A/C", icon: "💨" },
    { id: "test2", label: "TV", icon: "📺" },
    { id: "test3", label: "Power Backup", icon: "🔋" },
    { id: "test4", label: "WiFi", icon: "📶" },
    { id: "test5", label: "Kitchen", icon: "🍴" },
    { id: "test6", label: "Tank Water", icon: "💧" },
    { id: "test7", label: "Double Bed", icon: "🛏️" },
  ];

  const featureChanges = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckFestures([...checkFeatures, value]);
    } else {
      setCheckFestures(checkFeatures.filter((feature) => feature !== value));
    }
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
          >
            Apply Filters
          </button>

          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="w-full md:w-3/4 md:mt-0 md:ml-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 shadow rounded-md">
          <h2 className="text-lg font-bold hidden md:block">
            20 Mess in Simhat, Nadia, West Bengal, India
          </h2>
          <div className="flex items-center gap-4">
            <Toggle isChecked={isChecked} setIsChecked={setIsChecked} />
            <span>Map View</span>
            <Dropdown />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow md:hidden"
              onClick={() => setFilterModalOpen(true)}
            >
              Filters
            </button>
          </div>
        </div>
        {/* Listings */}
        <div className="mt-6 flex flex-col gap-6">
        <div className="text-lg font-bold md:hidden">
            20 Mess in Simhat, Nadia, West Bengal, India
        </div>
          <div style={{ display: isChecked ? "flex" : "block" }}>
            <MessBars
              checkFeatures={checkFeatures}
              isChecked={isChecked}
              style={{ overflowY: "auto", height: "84vh" }}
              coords={handleCoordinatesChange}
            />
            <Map isChecked={isChecked} coordinates={coordinates} />
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
      />

           

    </div>
  );
};

export default NewMessFind;

