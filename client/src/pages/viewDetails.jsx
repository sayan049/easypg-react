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
  const locationArray = owner?.location ? owner.location.coordinates : ['0', '0'];
  const lat = locationArray[1] || 0; // Latitude (second element in the array)
  const lng = locationArray[0] || 0; // Longitude (first element in the array)
  const coordinates = { lat, lng };
  const amenities = [
    { id: "test1", label: "A/C", icon: "💨" },
    { id: "test2", label: "TV", icon: "📺" },
    { id: "test3", label: "Power Backup", icon: "🔋" },
    { id: "test4", label: "WiFi", icon: "📶" },
    { id: "test5", label: "Kitchen", icon: "🍴" },
    { id: "test6", label: "Tank Water", icon: "💧" },
    { id: "test7", label: "Double Bed", icon: "🛏️" },
  ];

  // Scroll to top on load
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
          {Array.isArray(owner?.messPhoto) ? `${owner.messPhoto.length} Photos` : "0 Photos"}
        </button>
      </div>

      {/* Modal for Viewing All Photos */}
      {showModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center">
    <div
      className="bg-white rounded-lg p-4 max-w-4xl w-full relative overflow-hidden flex flex-col"
      style={{ maxHeight: "90vh" }} // Limits modal height to 90% of viewport
    >
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
      >
        Close
      </button>

      {/* Modal Content - Make scrollable */}
      <div
        className="overflow-y-auto w-full"
        style={{ maxHeight: "80vh" }} // Ensures internal scrolling
      >
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
  </div>
)}



      {/* Content Section */}
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
          {/* <div className="flex flex-wrap gap-4 mb-6">
            {Array.isArray(owner?.facility) &&
              owner.facility.map((element, index) => (

                <div className="flex items-center space-x-2" key={index}>
                  <span className="text-blue-500">&#x1F6BF;</span>
                  <p>{element}</p>
                </div>
              ))}
          </div> */}
          {/* Amenities */}
<div className="flex flex-wrap gap-4 mb-6">
  {Array.isArray(owner?.facility) &&
    amenities
      .filter((amenity) =>
        owner.facility[0].split(",").includes(amenity.label) // Split and match
      )
      .map((amenity) => (
        <div className="flex items-center space-x-2" key={amenity.id}>
          <span className="text-blue-500">{amenity.icon}</span>
          <p>{amenity.label}</p>
        </div>
      ))}
</div>



          {/* About Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">About this Mess</h2>
            <p className="text-gray-700">{owner?.aboutMess}</p>
          </div>

             {/* Ratings Section */}
        <div className="mb-6 shadow-md shadow-gray-300 p-5 border rounded">
          <h2 className="text-lg font-semibold mb-4">Ratings and Reviews</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl font-bold text-yellow-500">2.7</div>
            <div className="text-sm text-gray-600">★ Avg from 30 ratings</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-24 text-gray-600">5 ★</div>
              <div className="bg-gray-200 w-full rounded h-3">
                <div className="bg-green-500 h-3 rounded" style={{ width: "20%" }}></div>
              </div>
              <span className="text-sm">20%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 text-gray-600">4 ★</div>
              <div className="bg-gray-200 w-full rounded h-3">
                <div className="bg-green-400 h-3 rounded" style={{ width: "15%" }}></div>
              </div>
              <span className="text-sm">15%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 text-gray-600">3 ★</div>
              <div className="bg-gray-200 w-full rounded h-3">
                <div className="bg-yellow-500 h-3 rounded" style={{ width: "40%" }}></div>
              </div>
              <span className="text-sm">40%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 text-gray-600">2 ★</div>
              <div className="bg-gray-200 w-full rounded h-3">
                <div className="bg-orange-400 h-3 rounded" style={{ width: "10%" }}></div>
              </div>
              <span className="text-sm">10%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 text-gray-600">1 ★</div>
              <div className="bg-gray-200 w-full rounded h-3">
                <div className="bg-red-500 h-3 rounded" style={{ width: "15%" }}></div>
              </div>
              <span className="text-sm">15%</span>
            </div>
          </div>
        </div>

        {/* Single Review */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Review</h2>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-gray-700">
              <strong>Sunjit Mahanty</strong> - Jul 2023
            </p>
            <p>Very special and beautiful place and also the behavior of hotel management is excellent.</p>
          </div>
        </div>

          {/* Map Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">What's nearby?</h2>
            <MapDirection coordinates={coordinates} />
          </div>
        </div>

        {!showModal&&<ConfirmBooking />}

        <Footer />
      </div>
    </>
  );
};

export default ViewDetails;
