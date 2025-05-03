"use client";

import { useEffect, useState } from "react";
import { getCartUrl } from "../constant/urls";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import {
  Search,
  Filter,
  MapPin,
  Wifi,
  Wind,
  CookingPotIcon as Kitchen,
  Tv,
  Battery,
  Droplet,
  Dumbbell,
  Heart,
  Trash2,
} from "lucide-react";

const Cart = () => {
  // Sample data - replace with your actual data source
  const [savedMesses, setSavedMesses] = useState([
    {
      id: 1,
      name: "Sunshine PG Deluxe",
      location: "123 Student District, Campus Area",
      price: 12000,
      available: true,
      amenities: ["AC", "WiFi", "Kitchen"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Green View PG",
      location: "456 College Road, University Town",
      price: 15000,
      available: false,
      amenities: ["TV", "Power Backup", "Water 24x7"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Campus Corner PG",
      location: "789 Education Hub, Knowledge Park",
      price: 18000,
      available: true,
      amenities: ["AC", "WiFi", "Gym"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 50000 });
  const [amenityFilters, setAmenityFilters] = useState([]);
  const [messData,setMessData]= useState([]);

  // Remove item from cart
  const fetchMessData = async () => {
    try {
      const res = await axios.get(getCartUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!res || !res.data) {
        toast.error("Failed to fetch mess data");
        return;
      }
  
      setMessData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching mess data");
    }
  };

  useEffect(()=>{
    fetchMessData();
  },[]);
  
  const removeItem = (id) => {
    setSavedMesses(savedMesses.filter((mess) => mess.id !== id));
  };

  // Filter messes based on search and filters
  const filteredMesses = savedMesses.filter((mess) => {
    const matchesSearch =
      mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mess.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      mess.price >= priceFilter.min && mess.price <= priceFilter.max;

    const matchesAmenities =
      amenityFilters.length === 0 ||
      amenityFilters.every((amenity) => mess.amenities.includes(amenity));

    return matchesSearch && matchesPrice && matchesAmenities;
  });

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "AC":
        return <Wind className="w-4 h-4" />;
      case "WiFi":
        return <Wifi className="w-4 h-4" />;
      case "Kitchen":
        return <Kitchen className="w-4 h-4" />;
      case "TV":
        return <Tv className="w-4 h-4" />;
      case "Power Backup":
        return <Battery className="w-4 h-4" />;
      case "Water 24x7":
        return <Droplet className="w-4 h-4" />;
      case "Gym":
        return <Dumbbell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Toggle amenity filter
  const toggleAmenityFilter = (amenity) => {
    if (amenityFilters.includes(amenity)) {
      setAmenityFilters(amenityFilters.filter((a) => a !== amenity));
    } else {
      setAmenityFilters([...amenityFilters, amenity]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Saved Messes</h1>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search saved messes..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Price Range (₹)</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full p-2 border rounded-md"
                    value={priceFilter.min}
                    onChange={(e) =>
                      setPriceFilter({
                        ...priceFilter,
                        min: Number(e.target.value),
                      })
                    }
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full p-2 border rounded-md"
                    value={priceFilter.max}
                    onChange={(e) =>
                      setPriceFilter({
                        ...priceFilter,
                        max: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "AC",
                    "WiFi",
                    "Kitchen",
                    "TV",
                    "Power Backup",
                    "Water 24x7",
                    "Gym",
                  ].map((amenity) => (
                    <button
                      key={amenity}
                      className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                        amenityFilters.includes(amenity)
                          ? "bg-teal-100 text-teal-800 border-teal-200"
                          : "bg-white border border-gray-300 text-gray-700"
                      }`}
                      onClick={() => toggleAmenityFilter(amenity)}
                    >
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredMesses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No saved messes found
            </h2>
            <p className="text-gray-500 max-w-md">
              {savedMesses.length === 0
                ? "You haven't saved any messes yet. Browse and like messes to see them here."
                : "No messes match your current search or filters. Try adjusting your criteria."}
            </p>
          </div>
        )}

        {/* Mess cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messData.map((mess) => (
            <div
              key={mess.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={mess.profilePhoto || "/placeholder.svg"}
                  alt={mess.messName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      mess?.available
                        ? "bg-teal-100 text-teal-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {mess?.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <button
                  className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  onClick={() => removeItem(mess.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {mess?.name}
                </h3>
                <div className="flex items-start gap-1.5 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{mess?.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {mess?.amenities?.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{mess?.price?.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                      View Details
                    </button>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
