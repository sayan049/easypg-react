import React, { useState, useEffect } from "react";
import UserProfile from "./UserProfile";

const input =
  "border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300";

const SettingsOwner = ({ userDetails }) => {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    mobileNo: "",
    address: "",
    pincode: "",
    messName: "",
    location: "",
    aboutMess: "",
    gender: "",
    facility: [],
    roomInfo: [], // not an object

    messPhoto: [],
  });

  useEffect(() => {
    if (userDetails) {
      setDetails((prev) => ({
        ...prev,
        name: userDetails?.firstName + " " + userDetails?.lastName || "",
        email: userDetails?.email || "",
        mobileNo: userDetails?.mobile || "",
        address: userDetails?.address || "",
        pincode: userDetails?.pincode || "",
        messName: userDetails?.messName || "",
        location: userDetails?.location || "",
        aboutMess: userDetails?.aboutMess || "",
        gender: userDetails?.gender || "",
        facility: userDetails?.facility || [],
        roomInfo: Array.isArray(userDetails?.roomInfo)
          ? userDetails.roomInfo
          : [],
        messPhoto: userDetails?.messPhoto || [],
      }));
    }
  }, [userDetails]);
console.log(details);
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <UserProfile className="w-24 h-24 rounded-full" />
        <h2 className="text-lg font-semibold">Owner</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Owner Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Owner Details</h3>
          <input
            type="text"
            placeholder="Name"
            className={input}
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className={input}
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className={input}
            value={details.mobileNo}
            onChange={(e) => setDetails({ ...details, mobileNo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className={input}
            value={details.address}
            onChange={(e) =>
              setDetails({ ...details, address: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Pincode"
            className={input}
            value={details.pincode}
            onChange={(e) =>
              setDetails({ ...details, pincode: e.target.value })
            }
          />
        </div>

        {/* Update Password */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Update Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            className={input}
          />
          <input type="password" placeholder="New Password" className={input} />
          <input
            type="password"
            placeholder="Confirm Password"
            className={input}
          />
          <div>
            <label className="text-sm text-gray-500">Password Strength</label>
            <div className="h-1 w-full bg-gray-300 rounded">
              <div className="h-1 bg-green-500 w-3/4 rounded"></div>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Update Password
          </button>
        </div>
      </div>

      {/* Mess Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Mess Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Mess Name"
            className={input}
            value={details.messName}
            onChange={(e) =>
              setDetails({ ...details, messName: e.target.value })
            }
          />
          <input type="text" placeholder="Location" className={input} />
        </div>
        <textarea
          placeholder="About Mess"
          className={input}
          value={details.aboutMess}
          onChange={(e) =>
            setDetails({ ...details, aboutMess: e.target.value })
          }
        ></textarea>
        <div className="space-x-4">
          <label>
            <input
              type="radio"
              name="pgType"
              value="Girls"
              checked={details.gender === "Girls Pg"}
              onChange={(e) =>
                setDetails({ ...details, pgType: e.target.value })
              }
            />{" "}
            Girls
          </label>
          <label>
            <input
              type="radio"
              name="pgType"
              value="Boys"
              checked={details.gender === "Boys Pg"}
              onChange={(e) =>
                setDetails({ ...details, pgType: e.target.value })
              }
            />{" "}
            Boys
          </label>
          <label>
            <input
              type="radio"
              name="pgType"
              value="Co-ed"
              checked={details.gender === "Coed Pg"}
              onChange={(e) =>
                setDetails({ ...details, pgType: e.target.value })
              }
            />{" "}
            Co-ed
          </label>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Amenities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            "AC",
            "TV",
            "Power Backup",
            "WiFi",
            "Kitchen",
            "Tank Water",
            "Double Bed",
          ].map((item, idx) => (
            <label key={idx} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={details.facility?.includes(item)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setDetails({
                      ...details,
                      facility: [...details.facility, item],
                    });
                  } else {
                    setDetails({
                      ...details,
                      facility: details.facility.filter((a) => a !== item),
                    });
                  }
                }}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Room Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Room Information</h3>

        {Array.isArray(details.roomInfo) && details.roomInfo.length > 0 ? (
          details.roomInfo.map((room, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 border p-4 rounded bg-white shadow-sm"
            >
              {/* Room No (readonly) */}
              <input
                type="text"
                placeholder="Room No."
                className={input}
                value={room.room}
                disabled
              />

              {/* Bed Contains */}
              <select
                className={input}
                value={room.bedContains}
                onChange={(e) => {
                  const updatedRooms = [...details.roomInfo];
                  updatedRooms[index].bedContains = e.target.value;
                  setDetails({ ...details, roomInfo: updatedRooms });
                }}
              >
                <option value="">Select Bed Count</option>
                <option value="one">Single</option>
                <option value="two">Double</option>
                <option value="three">Triple</option>
                <option value="four">Four</option>
                <option value="five">Five</option>
              </select>

              {/* Price per head */}
              <input
                type="number"
                placeholder="Price per head"
                className={input}
                value={room.pricePerHead}
                onChange={(e) => {
                  const updatedRooms = [...details.roomInfo];
                  updatedRooms[index].pricePerHead =
                    parseInt(e.target.value) || 0;
                  setDetails({ ...details, roomInfo: updatedRooms });
                }}
              />

              {/* Room Available */}
              <label className="inline-flex items-center space-x-2 col-span-3 mt-2">
                <input
                  type="checkbox"
                  checked={room.roomAvailable}
                  onChange={(e) => {
                    const updatedRooms = [...details.roomInfo];
                    updatedRooms[index].roomAvailable = e.target.checked;
                    setDetails({ ...details, roomInfo: updatedRooms });
                  }}
                />
                <span>Room Available</span>
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No room data available.</p>
        )}
      </div>

      {/* Mess Photos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Mess Photos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Add Photo Box */}
          <div
            className="flex items-center justify-center h-24 border rounded bg-gray-100 cursor-pointer hover:bg-gray-200"
            onClick={() => {
              // Add image upload logic here (e.g. file picker + uploading to cloudinary, then updating details)
            }}
          >
            Add Photo
          </div>

          {/* Render fetched mess photos */}
          {details.messPhoto?.length > 0 ? (
            details.messPhoto.map((photo, idx) => (
              <img
                key={idx}
                className="h-24 w-full object-cover rounded"
                src={photo}
                alt={`Mess ${idx + 1}`}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 col-span-3 sm:col-span-3">
              No photos uploaded yet.
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border rounded">Reset</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Update Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsOwner;
