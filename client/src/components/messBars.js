import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseurl, findMessUrl } from "../constant/urls";
import { useNavigate } from "react-router-dom";

function MessBars({ isChecked, checkFeatures, coords }) {
  const [messData, setMessData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const clickNavi = (owner) => {
    navigate("/viewDetails", { state: { owner } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let latitude, longitude;

        // Use provided coords if available, else fetch current location
        if (coords?.lat && coords?.lng) {
          latitude = coords.lat;
          longitude = coords.lng;
        } else {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        }
        console.log("Latitude:", latitude, "Longitude:", longitude);
        const res = await axios.get(findMessUrl, { params: { lat: latitude, lng: longitude } });

        const filteredData = res.data.filter((owner) =>
          checkFeatures.every((feature) => owner.facility?.includes(feature))
        );

        setMessData(filteredData);
      } catch (err) {
        console.log("Error fetching data", err);
        setError("Failed to fetch PG owners");
      }
    };

    fetchData();
  }, [checkFeatures, coords]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ overflowY: "auto", height: "84vh" }}>
      {messData.map((owner) => (
        <div
          key={owner._id}
          className="flex flex-col md:flex-row bg-white p-4 shadow rounded-md mb-4 sm:mb-2"
          onClick={() => clickNavi(owner)}
        >
          {/* Image Section */}
          {!isChecked && (
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <img
                src={owner.profilePhoto}
                alt="Mess"
                className="w-full h-48 md:h-full object-cover rounded-md"
                style={{ maxHeight: "300px", borderRadius: "10px" }}
              />
            </div>
          )}

          {/* Content Section */}
          <div
            className="flex-grow md:ml-6 mt-4 md:mt-0"
            style={{
              padding: isChecked ? "29px" : "0px",
              borderRadius: isChecked ? "10px" : "0px",
              boxShadow: isChecked
                ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                : "none",
            }}
          >
            <h3 className="font-medium text-lg">{owner.messName}, In Simhat</h3>
            <p className="text-sm text-gray-600 mt-2">Near MAKAUT University • 15 Km</p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              {owner.facility?.map((feature, index) => (
                <span key={index}>
                  {feature} {index < owner.facility.length - 1 && "•"}
                </span>
              ))}
            </div>
            <div>
              <span>Price: 2.5k/Month</span>
            </div>
            <div className="flex gap-4 mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => clickNavi(owner)}>
                View Details
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">Book Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessBars;
