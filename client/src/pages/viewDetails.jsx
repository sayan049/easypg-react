import React from "react";

const ViewDetails = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden my-8">
      {/* Image Section */}
      <div className="relative">
        <img
          src="https://via.placeholder.com/1024x300"
          alt="Room"
          className="w-full h-64 object-cover"
        />
        <button className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-sm rounded">
          View all photos
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <h1 className="text-xl font-bold">MUKUL BHABAN (Raju Da Mess)</h1>
            <p className="text-sm text-gray-600">
              Hamirghata, Simna, West Bengal 741249
            </p>
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
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">&#x1F6BF;</span>
            <p>Free WiFi</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">&#x1F373;</span>
            <p>Kitchen</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">&#x1F6B0;</span>
            <p>Water</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">&#x26A1;</span>
            <p>Power Backup</p>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">About this Mess</h2>
          <p className="text-gray-700">
            Budget stay with comfortable bed and clean washroom.
          </p>
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
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{ width: "20%" }}
                ></div>
              </div>
              <span className="text-sm">20%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 text-gray-600">4 ★</div>
              <div className="bg-gray-200 w-full rounded h-3">
                <div
                  className="bg-green-400 h-3 rounded"
                  style={{ width: "15%" }}
                ></div>
              </div>
              <span className="text-sm">15%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 text-gray-600">3 ★</div>
              <div className="bg-gray-200 w-full rounded h-3">
                <div
                  className="bg-yellow-500 h-3 rounded"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <span className="text-sm">40%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 text-gray-600">2 ★</div>
              <div className="bg-gray-200 w-full rounded h-3">
                <div
                  className="bg-orange-400 h-3 rounded"
                  style={{ width: "10%" }}
                ></div>
              </div>
              <span className="text-sm">10%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 text-gray-600">1 ★</div>
              <div className="bg-gray-200 w-full rounded h-3">
                <div
                  className="bg-red-500 h-3 rounded"
                  style={{ width: "15%" }}
                ></div>
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
            <p>
              Very special and beautiful place and also the behavior of hotel
              management is excellent.
            </p>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">What's nearby?</h2>
          <div className="bg-gray-300 h-64 flex items-center justify-center">
            <p className="text-gray-700">Map Location</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white text-sm p-6">
        <div className="flex flex-wrap justify-between">
          <div>
            <h3 className="font-semibold">Easy Pg</h3>
            <p>
              Looking for a PG with great amenities and comfort? Find the best
              stays at the most affordable prices here.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Quick Links</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ViewDetails;
