import React from "react";
import { useLocation } from "react-router-dom";
import MapDirection from "../components/mapDirection";

const ViewDetails = () => {
  const location = useLocation();
  const { owner } = location.state || {}; // Fallback if owner is undefined

  // Check if location exists, if not, set a fallback ['0', '0']
  const locationArray = owner?.location ? owner.location.split(',') : ['0', '0'];

  // Ensure both latitude and longitude are valid numbers
  const lat = parseFloat(locationArray[0].trim()) || 0; // Latitude
  const lng = parseFloat(locationArray[1].trim()) || 0; // Longitude

  const coordinates = { lat, lng };
  console.log("Coordinates:", coordinates, "Owner Location:", owner?.location);

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden my-8">
      <div className="relative h-64 overflow-hidden rounded-lg shadow-lg mb-6">
        <div className="h-full overflow-x-scroll flex space-x-2 p-2">
          {Array.isArray(owner?.messPhoto) && owner.messPhoto.map((element, index) => (
            <img
              key={index}
              src={element}
              alt={`Room ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
        <button className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-sm rounded shadow-md">
          View all photos
        </button>
      </div>

      {/* Content Section */}
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
          {Array.isArray(owner?.facility) && owner.facility.map((element, index) => (
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

        {/* Ratings Section */}
        <div className="mb-6">
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

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white text-sm p-6">
        <div className="flex flex-wrap justify-between">
          <div>
            <h3 className="font-semibold">Easy Pg</h3>
            <p>Looking for a PG with great amenities and comfort? Find the best stays at the most affordable prices here.</p>
          </div>
          <div>
            <h3 className="font-semibold">Quick Links</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">Terms</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ViewDetails;
