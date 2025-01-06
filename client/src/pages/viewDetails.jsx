import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MapDirection from "../components/mapDirection";
import Footer from "../components/footer";
import ConfirmBooking from "../components/confirmBooking";

const ViewDetails = () => {
  const location = useLocation();
  const { owner } = location.state || {};

  // State for modal visibility
  const [showModal, setShowModal] = useState(false);

  // Parse location
  const locationArray = owner?.location ? owner.location.split(",") : ["0", "0"];
  const lat = parseFloat(locationArray[0].trim()) || 0;
  const lng = parseFloat(locationArray[1].trim()) || 0;
  const coordinates = { lat, lng };

  // Disable background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="flex">
        <h1 className="m-2">EasyPg</h1>
      </div>

      {/* Image Carousel */}
      <div className="relative h-64 shadow-lg mb-6">
        <div className="h-full overflow-x-scroll flex space-x-2 overflow-y-hidden">
          {Array.isArray(owner?.messPhoto) &&
            owner.messPhoto.map((element, index) => (
              <img
                key={index}
                src={element}
                alt={`Room ${index + 1}`}
                className="w-full h-64 object-cover shadow-md"
              />
            ))}
        </div>
        {/* Photo Count Button */}
        <button
          onClick={() => setShowModal(true)} // Open modal
          className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-sm rounded shadow-md"
        >
          {Array.isArray(owner?.messPhoto)
            ? `${owner.messPhoto.length} Photos`
            : "0 Photos"}
        </button>
      </div>

      {/* Modal for Viewing All Photos */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full h-[80vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)} // Close modal
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Close
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.isArray(owner?.messPhoto) &&
                owner.messPhoto.map((element, index) => (
                  <img
                    key={index}
                    src={element}
                    alt={`Room ${index + 1}`}
                    className="w-full h-48 object-cover rounded shadow-md"
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Hide ConfirmBooking when modal is open */}
      {!showModal && (
        <div className="max-w-[80rem] mx-auto bg-white shadow-md rounded-lg overflow-hidden my-8">
          <div className="p-6">
            {/* Title and Location */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <div>
                <h1 className="text-xl font-bold">{owner?.messName}</h1>
                <p className="text-sm text-gray-600">{owner?.address}</p>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                2.7 ★ 30 ratings
              </div>
            </div>

            {/* Safety Notice */}
            <p className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded mb-4">
              Safe and sanitized with daily temperature checks of our staff.
            </p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-4 mb-6">
              {Array.isArray(owner?.facility) &&
                owner.facility.map((element, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <span className="text-blue-500">&#x1F6BF;</span>
                    <p>{element}</p>
                  </div>
                ))}
            </div>

            {/* About Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold">About this Mess</h2>
              <p className="text-gray-700">{owner?.aboutMess}</p>
            </div>

            {/* Map Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">What's nearby?</h2>
              <MapDirection coordinates={coordinates} />
            </div>
          </div>

          <ConfirmBooking />
          <Footer />
        </div>
      )}
    </>
  );
};

export default ViewDetails;
