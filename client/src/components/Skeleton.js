import React from "react";

export default function Skeleton() {
    return (
        <div className="relative mb-4 h-[35rem] md:h-[16rem] w-full bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4">
        <div className="grid md:grid-cols-[1fr_2fr] gap-4 w-full h-full">
          {/* Image Section */}
          <div className="relative h-48 md:h-full rounded-lg overflow-hidden bg-gray-200 animate-pulse">
            {/* Image placeholder */}
            <div className="w-full h-full bg-gray-300"></div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between h-full">
            {/* Top Section */}
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold bg-gray-200 w-3/4 h-6 mb-2 animate-pulse"></h3>
                <div className="w-6 h-6 bg-gray-200 rounded-full md:hidden"></div>
              </div>

              {/* Address */}
              <p className="mt-1 text-sm bg-gray-200 w-2/3 h-4 animate-pulse"></p>

              {/* Distance */}
              <div className="mt-2 text-sm bg-gray-200 w-1/4 h-4 animate-pulse"></div>

              {/* Amenities */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 w-20 h-6 animate-pulse"
                  >
                    <span className="w-4 h-4 bg-gray-300"></span>
                  </span>
                ))}
              </div>

              {/* Gender Badge */}
              <div className="mt-3">
                <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full w-24 h-6">
                  <span className="w-4 h-4"></span>
                </span>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Price */}
              <div className="text-lg font-medium bg-gray-200 w-1/4 h-6 animate-pulse"></div>

              {/* Buttons */}
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-gray-200 w-24 h-10 rounded-lg animate-pulse"></div>
                <div className="px-4 py-2 bg-gray-200 w-24 h-10 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

