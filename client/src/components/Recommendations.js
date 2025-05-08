import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getRecomendationsUrl } from "../constant/urls";

const Recommendations = () => {
  const [messes, setMesses] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await axios.get(getRecomendationsUrl);
        console.log("First mess item:", res.data.data?.[0]);
        setMesses(res.data.data); // Adjust if API response structure differs
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      }
    };

    fetchMesses();
  }, []);

    const clickNavi = (owner) => {
      const ownerParams = new URLSearchParams();
      ownerParams.set("owner", JSON.stringify(owner));
  
      navigate(`/viewDetails?${ownerParams.toString()}`);
    };
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Mess Recommendations Near You
          </h2>
          <div className="w-20 h-1 bg-[#2CA4B5] mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover top-rated mess accommodations close to your location for
            the best student living experience
          </p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto overflow-y-hidden md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4">
          {messes.map((mess, index) => {
            const feedbacks = Array.isArray(mess.feedbacks)
              ? mess.feedbacks
              : [];
              const avgRating = mess.averageRating ?? "N/A";
              const reviewCount = mess.totalFeedbacks ?? 0;
              
            const roomPrices = Array.isArray(mess.roomInfo)
              ? mess.roomInfo
                  .map((r) => r.pricePerHead)
                  .filter((p) => typeof p === "number")
              : [];
            const price =
              roomPrices.length > 0
                ? Math.min(...roomPrices).toLocaleString()
                : "-";
            console.log("feedbacks:", mess.feedbacks);
            console.log("roomInfo:", mess.roomInfo);

            return (
              <motion.div
                key={mess._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group min-w-[280px] md:min-w-0"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={mess.profilePhoto || "/placeholder.svg"}
                    alt={mess.messName}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {mess.distance && (
                    <div className="absolute top-3 right-3 bg-[#2CA4B5] text-white text-xs px-2 py-1 rounded-full">
                      {mess.distance} km away
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 group-hover:text-[#2CA4B5] transition-colors duration-300">
                    {mess.messName}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{mess.address}</p>

                  <div className="mt-3 flex items-center">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-700">
                        {avgRating} ({reviewCount})
                      </span>
                    </div>
                    <div className="mx-2 text-gray-300">|</div>
                    <div className="text-sm text-gray-700">₹{price}/month</div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* {mess.facility?.map((f, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {f}
                      </span>
                    ))} */}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 w-full bg-white text-[#2CA4B5] border border-[#2CA4B5] py-2 rounded-lg font-medium hover:bg-[#2CA4B5] hover:text-white transition-colors duration-300"
                    onClick={()=>clickNavi(mess)}
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="mt-10 text-center">
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center text-[#2CA4B5] font-medium hover:underline"
          >
            View More Recommendations
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
