// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import MapDirection from "../components/mapDirection";
// import Footer from "../components/footer";
// import ConfirmBooking from "../components/confirmBooking";
// import {
//   FaWind,
//   FaTv,
//   FaBatteryFull,
//   FaWifi,
//   FaUtensils,
//   FaTint,
//   FaBed,
//   FaFemale,
//   FaMale,
//   FaUsers,
// } from "react-icons/fa";

// const ViewDetails = () => {
//   const location = useLocation();
//   //const { owner } = location.state || {};
//   const queryParams = new URLSearchParams(location.search);
//   const owner = queryParams.get("owner")
//     ? JSON.parse(queryParams.get("owner"))
//     : null;

//   // State for modal visibility
//   const [showModal, setShowModal] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(3);

//   const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 → 1★, Index 4 → 5★
//   owner.feedbacks.forEach((fb) => {
//     ratingCounts[fb.rating - 1]++;
//     console.log(fb.rating, " r", ratingCounts[fb.rating - 1]);
//   });

//   const total = owner.feedbacks.length;
//   const average = (
//     owner.feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / total
//   ).toFixed(1);
//   const ratingColor = [
//     "bg-green-500",
//     "bg-green-400",
//     "bg-yellow-500",
//     "bg-orange-400",
//     "bg-red-500",
//   ];

//   // Parse location
//   const locationArray = owner?.location
//     ? owner.location.coordinates
//     : ["0", "0"];
//   const lat = locationArray[1] || 0; // Latitude (second element in the array)
//   const lng = locationArray[0] || 0; // Longitude (first element in the array)
//   const coordinates = { lat, lng };
//   const amenities = [
//     { id: "test1", label: "A/C", icon: <FaWind /> },
//     { id: "test2", label: "TV", icon: <FaTv /> },
//     { id: "test3", label: "Power Backup", icon: <FaBatteryFull /> },
//     { id: "test4", label: "WiFi", icon: <FaWifi /> },
//     { id: "test5", label: "Kitchen", icon: <FaUtensils /> },
//     { id: "test6", label: "Tank Water", icon: <FaTint /> },
//     { id: "test7", label: "Double Bed", icon: <FaBed /> },
//   ];
//   // Scroll to top on load
//   useEffect(() => {
//     if (showModal) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [showModal]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);
//   useEffect(() => {}, [total]);

//   return (
//     <>
//       <div className="flex">
//         <h1 className="m-2">EasyPg</h1>
//       </div>

//       {/* Image Carousel */}
//       <div className="relative h-64 shadow-lg mb-6">
//         <div className="h-full overflow-x-scroll flex space-x-2 overflow-y-hidden">
//           {Array.isArray(owner?.messPhoto) &&
//             owner.messPhoto.map((element, index) => (
//               <img
//                 key={index}
//                 src={element}
//                 alt={`Room ${index + 1}`}
//                 className="w-full h-64 object-cover shadow-md"
//               />
//             ))}
//         </div>

//         {/* Photo Count Button */}
//         <button
//           onClick={() => setShowModal(true)} // Open modal
//           className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-sm rounded shadow-md"
//         >
//           {Array.isArray(owner?.messPhoto)
//             ? `${owner.messPhoto.length} Photos`
//             : "0 Photos"}
//         </button>
//       </div>

//       {/* Modal for Viewing All Photos */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center">
//           <div
//             className="bg-white rounded-lg p-4 max-w-4xl w-full relative overflow-hidden flex flex-col"
//             style={{ maxHeight: "90vh" }} // Limits modal height to 90% of viewport
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
//             >
//               Close
//             </button>

//             {/* Modal Content - Make scrollable */}
//             <div
//               className="overflow-y-auto w-full"
//               style={{ maxHeight: "80vh" }} // Ensures internal scrolling
//             >
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {Array.isArray(owner?.messPhoto) &&
//                   owner.messPhoto.map((element, index) => (
//                     <img
//                       key={index}
//                       src={element}
//                       alt={`Room ${index + 1}`}
//                       className="w-full h-48 object-cover rounded shadow-md"
//                     />
//                   ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Content Section */}
//       <div className="max-w-[80rem] mx-auto bg-white shadow-md rounded-lg overflow-hidden my-8">
//         <div className="p-6">
//           {/* Title and Location */}
//           <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
//             <div>
//               <h1 className="text-xl font-bold">{owner?.messName}</h1>
//               <p className="text-sm text-gray-600">{owner?.address}</p>
//             </div>
//             <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
//               2.7 ★ 30 ratings
//             </div>
//           </div>

//           {/* Safety Notice */}
//           <p className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded mb-4">
//             Safe and sanitized with daily temperature checks of our staff.
//           </p>

//           {/* Amenities */}
//           {/* <div className="flex flex-wrap gap-4 mb-6">
//             {Array.isArray(owner?.facility) &&
//               owner.facility.map((element, index) => (

//                 <div className="flex items-center space-x-2" key={index}>
//                   <span className="text-blue-500">&#x1F6BF;</span>
//                   <p>{element}</p>
//                 </div>
//               ))}
//           </div> */}
//           {/* Amenities */}
//           <div className="flex flex-wrap gap-4 mb-6">
//             {/* {Array.isArray(owner?.facility) &&
//     amenities
//       .filter((amenity) =>
//         owner.facility[0].split(",").includes(amenity.label) // Split and match
//       )
//       .map((amenity) => (
//         <div className="flex items-center space-x-2" key={amenity.id}>
//           <span className="text-blue-500">{amenity.icon}</span>
//           <p>{amenity.label}</p>
//         </div>
//       ))} */}
//             {owner.facility?.map((feature, index) => {
//               const amenity = amenities.find(
//                 (a) => a.label.toLowerCase() === feature.trim().toLowerCase()
//               );
//               return (
//                 <span
//                   key={index}
//                   className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-[rgb(44 164 181)] text-xs rounded-full"
//                 >
//                   {amenity?.icon || null}
//                   {feature}
//                 </span>
//               );
//             })}
//           </div>

//           {/* About Section */}
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold">About this Mess</h2>
//             <p className="text-gray-700">{owner?.aboutMess}</p>
//           </div>

//           {/* Ratings Section */}
          
//           <div className="text-4xl font-bold text-yellow-500">{average}</div>
//           <div className="text-sm text-gray-600">
//             ★ Avg from {total} ratings
//           </div>

//           {[5, 4, 3, 2, 1].map((star, i) => {
//             const count = ratingCounts[star - 1];
//             const percent = ((count / total) * 100).toFixed(0);
//             return (
//               <div key={star} className="flex items-center space-x-2">
//                 <div className="w-24 text-gray-600">{star} ★</div>
//                 <div className="bg-gray-200 w-full rounded h-3">
//                   <div
//                     className={`${ratingColor[i]} h-3 rounded`}
//                     style={{ width: `${percent}%` }}
//                   ></div>
//                 </div>
//                 <span className="text-sm">{percent}%</span>
//               </div>
//             );
//           })}

//           {/* Single Review */}
         
//           <h2 className="text-lg font-semibold mb-4">Reviews</h2>
//           {owner.feedbacks.slice(0, visibleCount).map((fb, idx) => (
//             <>
//               <div key={idx} className="bg-gray-100 p-4 rounded shadow mb-4">
//                 <p className="text-gray-700 font-medium">
//                   {fb.username} -{" "}
//                   {new Date(fb.submittedAt).toLocaleDateString()}
//                 </p>
//                 <p className="text-yellow-500">{"★".repeat(fb.rating)}</p>
//                 <p className="text-gray-800">{fb.comment}</p>
//               </div>
//             </>
//           ))}
//           {visibleCount < owner.feedbacks.length && (
//             <button
//               onClick={() => setVisibleCount((prev) => prev + 3)}
//               className="text-blue-600 underline mt-2"
//             >
//               Show More
//             </button>
//           )}

//           {/* Map Section */}
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">What's nearby?</h2>
//             <MapDirection coordinates={coordinates} />
//           </div>
//         </div>

//         {!showModal && <ConfirmBooking owner={owner} />}

//         <Footer />
//       </div>
//     </>
//   );
// };

// export default ViewDetails;
"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import MapDirection from "../components/mapDirection"
import Footer from "../components/footer"
import ConfirmBooking from "../components/confirmBooking"
import {
  FaWind,
  FaTv,
  FaBatteryFull,
  FaWifi,
  FaUtensils,
  FaTint,
  FaBed,
  FaUsers,
  FaStar,
  FaStarHalf,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa"

const ViewDetails = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const owner = queryParams.get("owner") ? JSON.parse(queryParams.get("owner")) : null

  // State for modal visibility and carousel
  const [showModal, setShowModal] = useState(false)
  const [visibleCount, setVisibleCount] = useState(3)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Calculate ratings
  const ratingCounts = [0, 0, 0, 0, 0] // Index 0 → 1★, Index 4 → 5★
  owner?.feedbacks?.forEach((fb) => {
    ratingCounts[fb.rating - 1]++
  })

  const total = owner?.feedbacks?.length || 0
  const average = total > 0 ? (owner.feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / total).toFixed(1) : "0.0"

  const ratingColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-500"]

  // Parse location
  const locationArray = owner?.location ? owner.location.coordinates : ["0", "0"]
  const lat = locationArray[1] || 0
  const lng = locationArray[0] || 0
  const coordinates = { lat, lng }

  const amenities = [
    { id: "ac", label: "A/C", icon: <FaWind className="text-sky-500" /> },
    { id: "tv", label: "TV", icon: <FaTv className="text-sky-500" /> },
    { id: "power", label: "Power Backup", icon: <FaBatteryFull className="text-sky-500" /> },
    { id: "wifi", label: "WiFi", icon: <FaWifi className="text-sky-500" /> },
    { id: "kitchen", label: "Kitchen", icon: <FaUtensils className="text-sky-500" /> },
    { id: "water", label: "Tank Water", icon: <FaTint className="text-sky-500" /> },
    { id: "bed", label: "Double Bed", icon: <FaBed className="text-sky-500" /> },
  ]

  // Handle carousel navigation
  const nextImage = () => {
    if (owner?.messPhoto?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex === owner.messPhoto.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const prevImage = () => {
    if (owner?.messPhoto?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? owner.messPhoto.length - 1 : prevIndex - 1))
    }
  }

  // Scroll to top on load and handle modal body scroll
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [showModal])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half-star" className="text-yellow-400" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => window.history.back()} className="mr-4 text-gray-600 hover:text-gray-900">
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
              EasyPg
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Image Carousel */}
        {/* <div className="relative rounded-xl overflow w-screen shadow-lg mb-8 h-[400px] bg-gray-100">
          {Array.isArray(owner?.messPhoto) && owner.messPhoto.length > 0 ? (
            <>
              <img
                src={owner.messPhoto[currentImageIndex] || "/placeholder.svg"}
                alt={`Room ${currentImageIndex + 1}`}
                //className="w-full h-full object-cover"
                className="w-[80%] h-full object-cover mx-3"
              /> */}

              {/* Navigation Buttons */}
              {/* <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronRight />
              </button> */}

              {/* Photo Count Button */}
              {/* <button
                onClick={() => setShowModal(true)}
                className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg shadow-md hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                <span className="font-medium">View All</span>
                <span className="bg-white text-black px-2 py-1 rounded-md text-sm">{owner.messPhoto.length}</span>
              </button> */}

              {/* Image Counter */}
              {/* <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
                {currentImageIndex + 1} / {owner.messPhoto.length}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div> */}
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Location */}
            <div 
            //className="bg-white rounded-xl shadow-sm p-3"
            className="p-3 border-b-2 border-grey">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {owner?.messName || "Accommodation Details"}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2 text-sky-500" />
                    <p>{owner?.address || "Address not available"}</p>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-2">
                    <div className="bg-sky-50 text-sky-700 px-3 py-1 rounded-lg font-medium flex items-center">
                      <span className="text-lg mr-1">{average}</span>
                      <FaStar className="text-yellow-400" />
                    </div>
                    <span className="text-gray-500">({total} ratings)</span>
                  </div>
                </div>
              </div>
            </div>
            <br />

            {/* Safety Notice */}
            <div className="bg-white rounded-xl shadow-sm p-3">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaShieldAlt className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Safety Measures</h2>
                  <p className="text-gray-700">
                    Safe and sanitized with daily temperature checks of our staff. We follow all COVID-19 safety
                    protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {owner?.facility?.map((feature, index) => {
                  const amenity = amenities.find((a) => a.label.toLowerCase() === feature.trim().toLowerCase())
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        {amenity?.icon || <FaUsers className="text-sky-500" />}
                      </div>
                      <span className="font-medium text-gray-800">{feature}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About this Accommodation</h2>
              <p className="text-gray-700 leading-relaxed">
                {owner?.aboutMess || "No description available for this accommodation."}
              </p>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location & What's Nearby</h2>
              <div className="rounded-lg overflow-hidden h-[300px] shadow-sm">
                <MapDirection coordinates={coordinates} />
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Booking Widget */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky ">
              {!showModal && <ConfirmBooking owner={owner} />}
            </div>

            {/* Ratings Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ratings & Reviews</h2>

              {/* Average Rating */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-sky-50 rounded-lg">
                <div className="text-5xl font-bold text-sky-600">{average}</div>
                <div>
                  <div className="flex mb-1">{renderStars(Number.parseFloat(average))}</div>
                  <div className="text-sm text-gray-600">Based on {total} ratings</div>
                </div>
              </div>

              {/* Rating Bars */}
              <div className="space-y-2 mb-6">
                {[5, 4, 3, 2, 1].map((star, i) => {
                  const count = ratingCounts[star - 1]
                  const percent = total > 0 ? ((count / total) * 100).toFixed(0) : "0"
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <div className="w-12 text-gray-600 text-sm">{star} ★</div>
                      <div className="bg-gray-200 flex-grow rounded-full h-2">
                        <div
                          className={`${ratingColor[5 - star]} h-2 rounded-full`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-sm w-12 text-right">{percent}%</span>
                    </div>
                  )
                })}
              </div>

              {/* Reviews */}
              <h3 className="font-medium text-gray-900 mb-4">Recent Reviews</h3>
              {owner?.feedbacks?.length > 0 ? (
                <>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {owner.feedbacks.slice(0, visibleCount).map((fb, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-gray-100 hover:border-sky-100 transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900">{fb.username}</p>
                          <p className="text-xs text-gray-500">{new Date(fb.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                        <p className="text-gray-700 text-sm">{fb.comment}</p>
                      </div>
                    ))}
                  </div>

                  {visibleCount < owner.feedbacks.length && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 3)}
                      className="mt-4 w-full py-2 text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
                    >
                      Show More Reviews
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-500 italic">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal for Viewing All Photos */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
            >
              <FaTimes />
            </button>

            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">All Photos ({owner?.messPhoto?.length || 0})</h2>
            </div>

            {/* Modal Content - Make scrollable */}
            <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(owner?.messPhoto) &&
                  owner.messPhoto.map((element, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={element || "/placeholder.svg"}
                        alt={`Room ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg"></div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewDetails
