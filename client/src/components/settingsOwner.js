import React from "react";

const input = "border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300";

const SettingsOwner = () => {
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <img
          src="https://i.pravatar.cc/100?img=1"
          alt="Owner Avatar"
          className="w-24 h-24 rounded-full"
        />
        <h2 className="text-lg font-semibold">Owner</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Owner Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Owner Details</h3>
          <input type="text" placeholder="Name" className={input} defaultValue="John Smith" />
          <input type="email" placeholder="Email" className={input} defaultValue="john@example.com" />
          <input type="text" placeholder="Mobile Number" className={input} />
          <input type="text" placeholder="Address" className={input} />
          <input type="text" placeholder="Pincode" className={input} />
        </div>

        {/* Update Password */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Update Password</h3>
          <input type="password" placeholder="Current Password" className={input} />
          <input type="password" placeholder="New Password" className={input} />
          <input type="password" placeholder="Confirm Password" className={input} />
          <div>
            <label className="text-sm text-gray-500">Password Strength</label>
            <div className="h-1 w-full bg-gray-300 rounded">
              <div className="h-1 bg-green-500 w-3/4 rounded"></div>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Password</button>
        </div>
      </div>

      {/* Mess Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Mess Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Mess Name" className={input} />
          <input type="text" placeholder="Location" className={input} />
        </div>
        <textarea placeholder="About Mess" className={input}></textarea>
        <div className="space-x-4">
          <label><input type="radio" name="pgType" /> Girls</label>
          <label><input type="radio" name="pgType" /> Boys</label>
          <label><input type="radio" name="pgType" /> Co-ed</label>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Amenities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["AC", "TV", "Power Backup", "WiFi", "Kitchen", "Tank Water", "Double Bed"].map((item, idx) => (
            <label key={idx} className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Room Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Room Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="text" placeholder="Room No." className={input} />
          <select className={input}>
            <option>2 Bed</option>
            <option>3 Bed</option>
          </select>
          <input type="text" placeholder="Price per head" className={input} />
        </div>
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" />
          <span>Room Available</span>
        </label>
        <div className="border border-dashed h-32 flex items-center justify-center text-gray-500 rounded">
          Drop room images here or click to upload
        </div>
      </div>

      {/* Mess Photos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Mess Photos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center justify-center h-24 border rounded bg-gray-100">Add Photo</div>
          <img className="h-24 w-full object-cover rounded" src="https://source.unsplash.com/random/1" alt="Mess 1" />
          <img className="h-24 w-full object-cover rounded" src="https://source.unsplash.com/random/2" alt="Mess 2" />
          <img className="h-24 w-full object-cover rounded" src="https://source.unsplash.com/random/3" alt="Mess 3" />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border rounded">Reset</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update Settings</button>
      </div>
    </div>
  );
};

export default SettingsOwner;
