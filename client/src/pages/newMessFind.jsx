import React,{useState,useEffect} from "react";
import MessBars from "../components/messBars";

const NewMessFind = () => {

const [checkFeatures,setCheckFestures]=useState([]);

useEffect(() => {
    console.log('CheckFeatures updated:', checkFeatures);
}, [checkFeatures])

  const checkboxesData = [
    { logo: "air-conditioner 1.png", title: "A/C" },
    { logo: "tank-water 1.png", title: "tank water" },
    { logo: "wifi (1) 1.png", title: "WiFi" },
    { logo: "power 1.png", title: "Power Backup" },
    { logo: "restaurant 1.png", title: "kitchen" },
    { logo: "single-bed 1.png", title: "Single Bed" },
    { logo: "single-bed (1) 1.png", title: "Double Bed" },
  ];

      const featureChanges=(e)=>{
        const {value,checked}=e.target;
        console.log(checkFeatures);
        if (checked) {
            setCheckFestures([...checkFeatures, value]);
        } else {
            setCheckFestures(checkFeatures.filter((feature) => feature !== value));
        }
    }

  return (
    <div className="flex flex-col md:flex-row p-4 bg-gray-50 min-h-screen">
      {/* Filter Section */}
      <div className="w-full md:w-1/4 bg-white p-4 shadow rounded-md">
        <h2 className="text-lg font-bold">Filter</h2>

        {/* Price Filter */}
        <div className="mt-6">
          <h3 className="font-medium">Price</h3>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>₹1500</span>
            <span>₹9000</span>
          </div>
          <input
            type="range"
            className="w-full mt-2 accent-blue-500"
            min="1500"
            max="9000"
          />
        </div>

        {/* Facility Filters */}
        <div className="mt-6">
          <h3 className="font-medium">Select Your Need</h3>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {/* checkboxesData.map((facility, index) => (
              <label key={index} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2 accent-blue-500"
                />
                {facility}
              </label>
            ))} */}

            {/* {checkboxesData.map((data, index) => (
              <div className="checkContainer flex aligncentre" key={index}>
                <div className="checkboxicon">
                  <img
                    className="checkimg"
                    src={`${process.env.PUBLIC_URL}/assets/${data.logo}`}
                    alt=""
                    srcSet=""
                  />
                </div>
                <input
                  type="checkbox"
                  className="checki"
                  id={`test${index}`}
                  onClick={featureChanges}
                  value={data.title}
                />
                <label
                  style={{ bottom: "4px", height: "25px", width: "25px" }}
                  htmlFor={`test${index}`}
                />
                <div
                  className="checkboxtxt flex aligncentre"
                  style={{ fontSize: "medium" }}
                >
                  {data.title}
                </div>
              </div>
            ))} */}
            
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="w-full md:w-3/4 mt-6 md:mt-0 md:ml-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 shadow rounded-md">
          <h2 className="text-lg font-bold">
            20 Mess in Simhat, Nadia, West Bengal, India
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-sm border px-3 py-1 rounded-md">
              Map View
            </button>
            <select
              className="text-sm border rounded-md px-3 py-1 focus:outline-none"
              defaultValue="Low Price"
            >
              <option value="Low Price">Low Price</option>
              <option value="High Price">High Price</option>
            </select>
          </div>
        </div>

        {/* Listings */}
        <div
          className="mt-6 grid gap-6"
          style={{ overflowY: "auto", height: "84vh" }}
        >
          {/* messbars */}
          <MessBars />
          {/* // {[...Array(4)].map((_, index) => (
            // <div
            //   key={index}
            //   className="flex flex-col md:flex-row bg-white p-4 shadow rounded-md"
            // >
            //   <img
            //     src="https://via.placeholder.com/150"
            //     alt="Mess"
            //     className="w-full md:w-1/3 object-cover rounded-md"
            //   />
            //   <div className="md:ml-6 mt-4 md:mt-0">
            //     <h3 className="font-medium text-lg">Rina Mess, In Simhat</h3>
            //     <p className="text-sm text-gray-600 mt-2">
            //       Near MAKAUT University • 15 Km
            //     </p>
            //     <div className="flex items-center mt-4 text-sm text-gray-500">
            //       <span>Wi-Fi</span>
            //       <span className="mx-2">•</span>
            //       <span>Single Bed</span>
            //       <span className="mx-2">•</span>
            //       <span>4+ More</span>
            //     </div>
            //     <div className="flex gap-4 mt-4">
            //       <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            //         View Details
            //       </button>
            //       <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            //         Book Now
            //       </button>
            //     </div>
            //   </div>
            // </div>
            
            // ))} */}
        </div>
      </div>
    </div>
  );
};

export default NewMessFind;
