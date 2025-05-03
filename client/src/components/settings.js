// import React, { useState, useEffect } from "react";
// import ToggleSwitch from "./toggle";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import UserProfile from "../components/UserProfile";
// import { useAuth } from "../contexts/AuthContext";
// import { updateDetailsUrl, resetPasswordDashboard } from "../constant/urls";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   faMapMarkerAlt,
//   faEdit,
//   faSave,
//   faCheck,
// } from "@fortawesome/free-solid-svg-icons";

// function Settings({ user }) {
//   const [image, setImage] = useState(null);
//   const [isChecked, setIsChecked] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLocationChanged, setIsLocationChanged] = useState(false);
//   const [intialData, setInitialData] = useState({});
//   const [passwords, setPasswords] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const { userName, IsAuthenticated, owner, type , handleLogout } = useAuth();
//   const [personalInfo, setPersonalInfo] = useState({
//     fullName: user?.name || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//     pin: user?.pin || "",
//     location: user?.location || { type: "Point", coordinates: [] },
//     messType: user?.messType || "",
//   });

//   const [notifications, setNotifications] = useState({
//     email: true,
//     sms: true,
//     push: true,
//   });
//   const [privacy, setPrivacy] = useState({
//     profilePrivate: false,
//     hideContact: false,
//   });

//   const [editingField, setEditingField] = useState(null);

//   const handleEditClick = (field) => {
//     setEditingField(editingField === field ? null : field);
//     //setIsEditing(!isEditing);
//     setIsEditing(true);
//   };
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "location") return; // prevent overriding the object
//     setPersonalInfo({ ...personalInfo, [name]: value });
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswords({ ...passwords, [name]: value });
//   };

//   const handleSaveChanges = async () => {
//     const phone = personalInfo.phone;
//     const phoneRegex = /^[0-9]{10}$/;

//     if (phone && !phoneRegex.test(phone)) {
//       alert("Please enter a valid 10-digit phone number.");
//       return; // Exit the entire function
//     }
//     const formData = new FormData();
//     const userId = type === "student" ? user?.id : owner?.id;
//     formData.append("userId", user._id);
//     console.log("userid", user._id, userId);
//     formData.append("type", type);

//     // Object.keys(personalInfo).forEach((key) => {
//     //   if (personalInfo[key]) {
//     //     console.log(key,personalInfo[key]);
//     //     formData.append(key, personalInfo[key]);
//     //   }
//     //   setEditingField(null);
//     //   setIsEditing(false);
//     // });
//     Object.keys(personalInfo).forEach((key) => {
//       if (personalInfo[key]) {
//         if (key === "location") {
//           formData.append(key, JSON.stringify(personalInfo[key]));
//         } else {
//           formData.append(key, personalInfo[key]);
//         }
//         console.log("key", personalInfo[key], formData.get(key), key);
//       }
//     });

//     try {
//       const response = await fetch(updateDetailsUrl, {
//         method: "POST",
//         body: formData,
//       });

//       console.log("print data", formData);

//       if (!response.ok) {
//         toast.error(response.error.data.message || "Failed to update details");
//         throw new Error("Failed to update details");
//       }

//       const data = await response.json();
//       toast.success("Changes saved successfully!");
//       //alert("Changes saved successfully!");
//     } catch (error) {
//       console.error("Error saving changes:", error);
//       toast.error("Failed to save changes. Please try again.");
//       // alert("Failed to save changes. Please try again.");
//     }
//   };

//   const handleReset = () => {
//     toast.success("Reset to default settings!");
//     setPersonalInfo(intialData);
//   };

//   const loadfile = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // setFormData({ ...formData, profilePhoto: file });
//       setImage(file);
//     }
//   };

//   // const mapMake = () => {
//   // if (navigator.geolocation) {
//   //   navigator.geolocation.getCurrentPosition(async (position) => {
//   //     const { latitude, longitude } = position.coords;

//   //     try {
//   //       const response = await fetch(
//   //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.Google_apiKey}`
//   //       );
//   //       const data = await response.json();

//   //       const address =data.results[0]?.formatted_address || `${latitude}, ${longitude}`;
//   //       setPersonalInfo((prevData) => ({
//   //         ...prevData,
//   //         location: address,
//   //       }));
//   //       setIsLocationChanged(true);
//   //     } catch (error) {
//   //       console.error("Error fetching location:", error);
//   //     }
//   //   });
//   // } else {
//   //   alert("Geolocation is not supported by this browser.");
//   // }
//   // };
//   const mapMake = () => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const { latitude, longitude } = position.coords;

//       const updatedLocation = {
//         type: "Point",
//         coordinates: [longitude, latitude],
//       };
//       console.log("pers", updatedLocation);

//       setPersonalInfo((prevData) => ({
//         ...prevData,
//         location: updatedLocation,
//       }));
//       setIsLocationChanged(true);
//     });
//   };

//   const handlePasswordReset = async () => {
//     const { currentPassword, newPassword, confirmPassword } = passwords;
//     // Validate fields
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       toast.error("All fields are required!");
//       //- alert("All fields are required!");
//       return;
//     }
//     if (newPassword.length < 6) {
//       toast.error("New password must be at least 6 characters long!");
//       //alert("New password must be at least 6 characters long!");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       toast.error("New password and confirm password do not match!");
//       //alert("New password and confirm password do not match!");
//       return;
//     }

//     try {
//       const response = await fetch(resetPasswordDashboard, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: type === "student" ? user?._id : owner?._id,
//           type,
//           currentPassword,
//           newPassword,
//         }),
//       });
//       console.log(
//         "passuse",
//         type === "student" ? user?.id : owner?.id,
//         user._id
//       );
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.error || "Password update failed");
//       toast.success("Password updated successfully!");
//       alert("Password updated successfully!");
//       setPasswords({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (error) {
//       toast.error(error.message || "Error updating password");
//       console.error("Error updating password:", error);
//       alert(error.message);
//     }
//   };

//   // useEffect(() => {
//   //   const fetchDetails = async () => {
//   //     setIsLoading(true);
//   //     try {
//   //       const userId = type === "student" ? user?.id : owner?.id;
//   //       if (!userId) {
//   //         console.error("User ID is missing");
//   //         return;
//   //       }

//   //       const url = new URL(fetchDetailsUrl);
//   //       url.searchParams.append("userId", userId);
//   //       url.searchParams.append("type", type);

//   //       const response = await fetch(url, { method: "GET" });

//   //       if (!response.ok) {
//   //         throw new Error("Failed to fetch details");
//   //       }

//   //       const data = await response.json();
//   //       setPersonalInfo({
//   //         fullName: `${data.firstName} ${data.lastName}`.trim(),
//   //         email: data.email,
//   //         pin: data.pin || "",
//   //         phone: data.phone || "",
//   //         // location: data.location || "",
//   //         location: {
//   //           type: "Point",
//   //           coordinates: data.location?.coordinates || [0, 0],
//   //         },
//   //       });
//   //       setInitialData({
//   //         fullName: `${data.firstName} ${data.lastName}`.trim(),
//   //         email: data.email,
//   //         pin: data.pin || "",
//   //         phone: data.phone || "",
//   //         // location: data.location || "",
//   //         location: {
//   //           type: "Point",
//   //           coordinates: data.location?.coordinates || [0, 0],
//   //           address: data.location?.address || "",
//   //         },
//   //       });

//   //       console.log("Fetched data:", data);
//   //     } catch (error) {
//   //       console.error("Error fetching details:", error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   fetchDetails();

//   //   // console.log(user?.image + "xxxx");
//   // }, [type, user, owner]);
//   useEffect(() => {
//     // console.log("verify",user.is_verified);
//     if (!user._id) {
//       toast.error("User ID is null or undefined");
//      // alert("something wnt wrong user id is null");
//     }
//     if (user) {
//       setPersonalInfo({
//         fullName: `${user.firstName} ${user.lastName}`.trim(),
//         email: user.email || "",
//         pin: user.pin || "",
//         phone: user.phone || "",
//         messType: user.messType || "", // use `gender` field as messType
//         location: {
//           type: "Point",
//           coordinates: user.location?.coordinates || [0, 0],
//         },
//       });

//       setInitialData({
//         fullName: `${user.firstName} ${user.lastName}`.trim(),
//         email: user.email || "",
//         pin: user.pin || "",
//         phone: user.phone || "",
//         messType: user.messType || "",
//         location: {
//           type: "Point",
//           coordinates: user.location?.coordinates || [0, 0],
//           address: user.location?.address || "",
//         },
//       });
//     }
//   }, [user]);

//   return (
//     <div className="bg-white pb-16 pr-6 pt-6 pl-6 shadow rounded-md">
//       <ToastContainer
//         position="top-center"
//         toastClassName="!w-[300px]   mx-auto mt-4 sm:mt-0  "
//       />
//       <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
//       <div className="relative mb-4"></div>
//       {/* Profile Picture Section (First Row) */}
//       <div className="flex justify-center mb-6">
//         <div className="text-center flex items-center flex-col">
//           <input
//             type="file"
//             accept="image/*"
//             name="profilePhoto"
//             id="file"
//             onChange={loadfile}
//             className="hidden"
//           />

//           {IsAuthenticated ? <UserProfile className="!h-36 !w-36" /> : null}
//           {/* <label
//             htmlFor="file"
//             className="cursor-pointer text-xl text-blue-600 text-white relative top-[-34px] left-[18px] "
//           >
//             ➕
//           </label> */}
//           <div className="mt-2 text-gray-600">Upload Your Profile Photo</div>
//         </div>
//       </div>

//       {/* Personal Information and Password Management (Second Row) */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Personal Information Section */}
//         <section>
//           <h3 className="text-xl font-semibold mb-4">
//             Edit Personal Information
//           </h3>
//           <div className="grid grid-cols-1 gap-4">
//             {Object.entries(personalInfo)
//               .filter(
//                 ([key]) =>
//                   key !== "password" && key !== "location" && key !== "messType"
//               )
//               .map(([key, value]) => (
//                 <div key={key} className="relative">
//                   <input
//                     type="text"
//                     name={key}
//                     placeholder={`Enter your ${key}`}
//                     value={value}
//                     onChange={handleInputChange}
//                     className="border border-gray-300 rounded-md p-2 w-full"
//                     readOnly={editingField !== key}
//                   />
//                   {key === "email" || key === "fullName" ? (
//                     <button
//                     //  className="absolute top-2/4 right-3 transform -translate-y-2/4 cursor-pointer text-2xl text-blue-500"
//                     ></button>
//                   ) : (
//                     <button
//                       onClick={() => handleEditClick(key)}
//                       className="absolute top-2/4 right-3 transform -translate-y-2/4 cursor-pointer text-2xl text-blue-500"
//                     >
//                       <FontAwesomeIcon
//                         icon={editingField === key ? faSave : faEdit}
//                       />
//                     </button>
//                   )}

//                   {/* <button
//                   //   onClick={() => handleEditClick(key)}
//                   //   className="absolute top-2/4 right-3 transform -translate-y-2/4 cursor-pointer text-2xl text-blue-500"
//                   // >
//                   //   <FontAwesomeIcon
//                   //     icon={editingField === key ? faSave : faEdit}
//                   //   />
//                   // </button> */}
//                 </div>
//               ))}

//             <div className="relative">
//               {/* <input
//                 type="text"
//                 name="location"
//                 placeholder={user?.location || "Add your location"}
//                 value={personalInfo.location}
//                 onChange={handleInputChange}
//                 disabled
//                 className="border border-gray-300 rounded-md p-2 w-full pr-10"
//               /> */}
//               <input
//                 type="text"
//                 name="location"
//                 placeholder="Click to get location"
//                 value={
//                   personalInfo.location?.coordinates?.length
//                     ? personalInfo.location.coordinates.join(", ")
//                     : ""
//                 }
//                 onChange={handleInputChange}
//                 disabled
//                 className="border border-gray-300 rounded-md p-2 w-full pr-10"
//                 onClick={mapMake}
//               />
//               <div
//                 onClick={mapMake}
//                 className="absolute top-2/4 right-3 transform -translate-y-2/4 cursor-pointer text-2xl text-green-600"
//               >
//                 <FontAwesomeIcon icon={faMapMarkerAlt} />
//               </div>
//             </div>
//             {/* New Dropdown for Mess Selection */}
//             <select
//               name="messType"
//               value={personalInfo.messType || ""}
//               onChange={(e) => {
//                 handleInputChange(e);
//                 setIsEditing(true); // this makes the Save Changes button appear
//               }}
//               className="border border-gray-300 rounded-md p-2 w-full"
//             >
//               <option value="" disabled>
//                 Select Mess Type
//               </option>
//               <option value="Boys Pg">Boys PG</option>
//               <option value="Girls Pg">Girls PG</option>
//               <option value="Coed Pg">Co-ed PG</option>
//             </select>
//           </div>
//           {(isEditing || isLocationChanged) && (
//             <button
//               onClick={handleSaveChanges}
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
//             >
//               Save Changes
//             </button>
//           )}
//         </section>

//         {/* Password Management Section */}
//         <section>
//           <h3 className="text-xl font-semibold mb-4">Password Management</h3>
//           <div className="grid grid-cols-1 gap-4">
//             <input
//               type="password"
//               name="currentPassword"
//               placeholder="Current Password"
//               value={passwords.currentPassword}
//               onChange={handlePasswordChange}
//               className="border border-gray-300 rounded-md p-2 w-full"
//             />
//             <input
//               type="password"
//               name="newPassword"
//               placeholder="New Password"
//               value={passwords.newPassword}
//               onChange={handlePasswordChange}
//               className="border border-gray-300 rounded-md p-2 w-full"
//             />
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={passwords.confirmPassword}
//               onChange={handlePasswordChange}
//               className="border border-gray-300 rounded-md p-2 w-full"
//             />
//           </div>
//           <button
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
//             onClick={handlePasswordReset}
//           >
//             Update Password
//           </button>
//         </section>
//       </div>

//       {/* Notification Preferences */}
//       {/* Notification Preferences */}
//       {/* <section className="mb-6">
//         <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
//         <div className="flex flex-wrap gap-4">
//           <label className="flex items-center space-x-2">

//             <ToggleSwitch isChecked={isChecked} setIsChecked={setIsChecked} />
//             <span>Email Notifications</span>
//           </label>
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={notifications.sms}
//               onChange={() => handleToggle("notifications", "sms")}
//             />
//             <span>SMS Notifications</span>
//           </label>
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={notifications.push}
//               onChange={() => handleToggle("notifications", "push")}
//             />
//             <span>App Push Notifications</span>
//           </label>
//         </div>
//       </section> */}

//       {/* Privacy Settings */}
//       {/* <section className="mb-6">
//         <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>
//         <div className="flex items-center space-x-4">
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={privacy.profilePrivate}
//               onChange={() => handleToggle("privacy", "profilePrivate")}
//             />

//             <span>Make Profile Private</span>
//           </label>
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={privacy.hideContact}
//               onChange={() => handleToggle("privacy", "hideContact")}
//             />

//             <span>Hide Contact Information</span>
//           </label>
//         </div>
//       </section> */}

//       {/* Account Management */}
//       {/* <section className="mb-6">
//         <h3 className="text-xl font-semibold mb-4">Account Management</h3>
//         <div className="flex space-x-4">
//           <button className="bg-red-500 text-white px-4 py-2 rounded-md">
//             Logout
//           </button>
//           <button className="bg-red-600 text-white px-4 py-2 rounded-md">
//             Delete Account
//           </button>
//         </div>
//       </section> */}

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="relative bg-white p-6 rounded-md w-full max-w-md">
//             {/* Cross Button */}
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
//             >
//               &times;
//             </button>

//             <h3 className="text-xl font-semibold mb-4 flex justify-center">
//               Account Management
//             </h3>
//             {/* <div className="flex justify-center">
//             <img
//                 src="/assets/delete 1.png" // Path to your default image
//                 alt="Default"
//               />
//             </div> */}
//             <div className="flex space-x-4 justify-center">
//               <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={()=>handleLogout()}>
//                 Logout
//               </button>
//               <button className="bg-red-600 text-white px-4 py-2 rounded-md">
//                 Delete Account
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mt-6 flex pb-2">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md"
//         >
//           Account Management
//         </button>
//       </div>
//       <div className="flex justify-end">
//         <button
//           className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
//           onClick={handleReset}
//         >
//           Reset to Default
//         </button>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded-md"
//           onClick={handleSaveChanges}
//         >
//           Save All Changes
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Settings;
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { User, MapPin, Lock, Bell, LogOut, Trash2, Save, RefreshCw, Edit, Check, Upload } from 'lucide-react'

export default function Settings({ user }) {
  const { toast } = useToast()
  const [image, setImage] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [isLocationChanged, setIsLocationChanged] = useState(false)
  const [initialData, setInitialData] = useState({})

  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    pin: user?.pin || "",
    location: user?.location || { type: "Point", coordinates: [] },
    messType: user?.messType || "",
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
  })

  const handleEditClick = (field) => {
    setEditingField(editingField === field ? null : field)
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "location") return // prevent overriding the object
    setPersonalInfo({ ...personalInfo, [name]: value })
  }

  const handleMessTypeChange = (value) => {
    setPersonalInfo({ ...personalInfo, messType: value })
    setIsEditing(true)
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswords({ ...passwords, [name]: value })
  }

  const handleNotificationChange = (key, value) => {
    setNotifications({ ...notifications, [key]: value })
  }

  const handleSaveChanges = async () => {
    // Validation
    const phone = personalInfo.phone
    const phoneRegex = /^[0-9]{10}$/

    if (phone && !phoneRegex.test(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      })
      return
    }

    // Mock API call
    try {
      // In a real app, you would send this data to your API
      const formData = new FormData()
      formData.append("userId", user._id)
      formData.append("type", "student") // Assuming type is student

      Object.keys(personalInfo).forEach((key) => {
        if (personalInfo[key]) {
          if (key === "location") {
            formData.append(key, JSON.stringify(personalInfo[key]))
          } else {
            formData.append(key, personalInfo[key])
          }
        }
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })

      setEditingField(null)
      setIsEditing(false)
      setIsLocationChanged(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setPersonalInfo(initialData)
    toast({
      title: "Reset complete",
      description: "Your settings have been reset to default values.",
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      toast({
        title: "Image selected",
        description: "Click Save Changes to update your profile picture.",
      })
    }
  }

  const handlePasswordReset = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "All password fields are required.",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    // In a real app, you would redirect to login page or clear auth state
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Account deleted",
      description: "Your account has been deleted successfully.",
    })
    // In a real app, you would make an API call to delete the account
  }

  const mapMake = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          const updatedLocation = {
            type: "Point",
            coordinates: [longitude, latitude],
          }

          setPersonalInfo((prevData) => ({
            ...prevData,
            location: updatedLocation,
          }))

          setIsLocationChanged(true)

          toast({
            title: "Location updated",
            description: "Your current location has been captured.",
          })
        },
        () => {
          toast({
            title: "Location error",
            description: "Unable to get your location. Please check permissions.",
            variant: "destructive",
          })
        },
      )
    } else {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user) {
      const userData = {
        fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`.trim() : user.name || "",
        email: user.email || "",
        pin: user.pin || "",
        phone: user.phone || "",
        messType: user.messType || "",
        location: {
          type: "Point",
          coordinates: user.location?.coordinates || [0, 0],
        },
      }

      setPersonalInfo(userData)
      setInitialData(userData)
    }
  }, [user])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      className="container mx-auto py-8 px-4 max-w-5xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex flex-col items-center mb-8" variants={itemVariants}>
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarImage src={image ? URL.createObjectURL(image) : "/placeholder-user.jpg"} alt="Profile" />
            <AvatarFallback className="text-2xl">
              {personalInfo.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Upload profile picture</span>
          </label>

          <input type="file" id="profile-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        <motion.h1 className="text-2xl font-bold mt-4" variants={fadeIn}>
          {personalInfo.fullName || "Your Name"}
        </motion.h1>

        <motion.p className="text-muted-foreground" variants={fadeIn}>
          {personalInfo.email || "email@example.com"}
        </motion.p>
      </motion.div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="personal">
            <User className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Personal Info</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Bell className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
            <span className="sm:hidden">Prefs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <motion.div className="grid gap-4 md:grid-cols-2" variants={containerVariants}>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handleInputChange}
                        readOnly={editingField !== "fullName"}
                        className={editingField === "fullName" ? "pr-10 border-primary" : "pr-10"}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => handleEditClick("fullName")}
                      >
                        {editingField === "fullName" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" value={personalInfo.email} readOnly className="bg-muted/50" />
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handleInputChange}
                        readOnly={editingField !== "phone"}
                        className={editingField === "phone" ? "pr-10 border-primary" : "pr-10"}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => handleEditClick("phone")}
                      >
                        {editingField === "phone" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="pin">PIN Code</Label>
                    <div className="relative">
                      <Input
                        id="pin"
                        name="pin"
                        value={personalInfo.pin}
                        onChange={handleInputChange}
                        readOnly={editingField !== "pin"}
                        className={editingField === "pin" ? "pr-10 border-primary" : "pr-10"}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => handleEditClick("pin")}
                      >
                        {editingField === "pin" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <Input
                        id="location"
                        name="location"
                        value={
                          personalInfo.location?.coordinates?.length
                            ? personalInfo.location.coordinates.join(", ")
                            : "Click to get location"
                        }
                        readOnly
                        className="pr-10"
                      />
                      <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={mapMake}>
                        <MapPin className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="messType">Mess Type</Label>
                    <Select value={personalInfo.messType || "default"} onValueChange={handleMessTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Mess Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Select Mess Type</SelectItem>
                        <SelectItem value="Boys Pg">Boys PG</SelectItem>
                        <SelectItem value="Girls Pg">Girls PG</SelectItem>
                        <SelectItem value="Coed Pg">Co-ed PG</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </motion.div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={handleSaveChanges} disabled={!isEditing && !isLocationChanged}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <motion.div className="space-y-4" variants={containerVariants}>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </motion.div>
                </motion.div>

                <Separator className="my-4" />

                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-medium mb-4">Account Management</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-50">
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will need to login again to access your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data
                            from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={handlePasswordReset}
                  disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="preferences">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <motion.div className="space-y-4" variants={containerVariants}>
                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                    />
                  </motion.div>

                  <Separator />

                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                    />
                  </motion.div>

                  <Separator />

                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                    />
                  </motion.div>
                </motion.div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() =>
                    toast({
                      title: "Preferences saved",
                      description: "Your notification preferences have been updated.",
                    })
                  }
                >
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}