import React,{useState,useEffect} from "react";
import MessBars from "../components/messBars";
import Dropdown from "../components/dropdown";
import Toggle from "../components/toggle";
import Map from "../components/map";

const NewMessFind = () => {
const [price, setPrice] = useState(1500);
const [checkFeatures,setCheckFestures]=useState([]);
const [isChecked, setIsChecked] = useState(false);
const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

const handleCoordinatesChange = (newCoords) => {
  setCoordinates(newCoords);
};

useEffect(() => {
    console.log('CheckFeatures updated:', checkFeatures);
}, [checkFeatures])

const amenities = [
  { id: "test1", label: "A/C", icon: "💨" },
  { id: "test2", label: "TV", icon: "📺" },
  { id: "test3", label: "Power Backup", icon: "🔋" },
  { id: "test4", label: "WiFi", icon: "📶" },
  { id: "test5", label: "Kitchen", icon: "🍴" },
  { id: "test6", label: "Tank Water", icon: "💧" },
  { id: "test7", label: "Double Bed", icon: "🛏️" },
];


      const featureChanges=(e)=>{
        const {value,checked}=e.target;
        console.log(checkFeatures);
        if (checked) {
            setCheckFestures([...checkFeatures, value]);
        } else {
            setCheckFestures(checkFeatures.filter((feature) => feature !== value));
        }
        //console.log(checkFeatures);
    }

  return (
    <div className="flex flex-col md:flex-row p-4 bg-gray-50 min-h-screen [overflow:hidden]">
      {/* Filter Section */}
      <div className="w-full md:w-1/4 bg-white p-4 shadow rounded-md">
        <h2 className="text-lg font-bold">Filter</h2>

        {/* Price Filter */}
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
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Facility Filters */}
        {/* <div className="mt-6">
          <h3 className="font-medium">Select Your Need</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
           { checkboxesData.map((facility, index) => (
              <label key={index} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  onClick={featureChanges}
                  value={facility.title}
                  className="mr-2 accent-blue-500"
                />
                {facility.title}
              </label>
            ))}
            

            
          </div>
        </div> */}

        {/* Facility Filters */}
<div className="mt-6">
  <h3 className="font-medium">Select Your Need</h3>
  <div className="flex flex-col gap-4 mt-4">
    {amenities.map((facility, index) => (
      <label
        key={facility.id}
        className="flex items-center text-sm  p-2 rounded "
      >
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
</div>



      </div>

      {/* Listings Section */}
      <div className="w-full md:w-3/4 mt-6 md:mt-0 md:ml-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 shadow rounded-md">
          <h2 className="text-lg font-bold">
            20 Mess in Simhat, Nadia, West Bengal, India
          </h2>
          <div className="flex items-center [gap:4rem]">
            
            <Toggle isChecked={isChecked} setIsChecked={setIsChecked} />
            map view
            <Dropdown/>
            
          </div>
        </div>

        {/* Listings */}
        <div
          className="mt-6 grid gap-6"
          
        >
          {/* messbars */}
         <div style={{display: isChecked ? "flex" : "block"}}> 
          <MessBars checkFeatures={checkFeatures} isChecked={isChecked} style={{ overflowY: "auto", height: "84vh" }} coords={handleCoordinatesChange} />
          <Map isChecked={isChecked} coordinates={coordinates}/>
         </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessFind;
