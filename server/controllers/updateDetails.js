const cloudinary = require("../cloudinary/cloudinaryConfig");
const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");
const dotenv = require("dotenv");

dotenv.config();

exports.updateDetails = async (req, res) => {
  const { type, userId, ...updateData } = req.body;
  const { profilePhoto, messPhoto } = req.files;
  console.log("Uploaded files:", req.files);

  try {
    let updatedUser;

    if (type === "student") {
      updatedUser = await User.findById(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Update allowed fields
      const allowedUpdates = [
        "address",
        "pin",
        "location",
        "phone",
        "messType",
      ];
      for (const key in updateData) {
        if (allowedUpdates.includes(key)) {
          console.log(key, "key");
          if (key === "location") {
            try {
              updatedUser[key] = JSON.parse(updateData[key]);
            } catch (e) {
              console.error("Error parsing location:", e);
              continue;
            }
          } else {
            updatedUser[key] = updateData[key];
          }
        }
      }

      // Upload profile photo to Cloudinary
      if (profilePhoto && profilePhoto[0]) {
        const result = await cloudinary.uploader.upload(profilePhoto[0].path);
        updatedUser.profilePhoto = result.secure_url;
      }
    } else if (type === "owner") {
      updatedUser = await PgOwner.findById(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "Owner not found" });
      }

      // Update allowed fields
      const allowedUpdates = [
        "address",
        "pincode",
        "mobileNo",
        "facility",
        "messName",
        "aboutMess",
        "location",
        "roomInfo",
        "gender",
      ];
      for (const key in updateData) {
        if (allowedUpdates.includes(key)) {
          if (key === "location") {
            try {
              updatedUser[key] =
                typeof updateData[key] === "string"
                  ? JSON.parse(updateData[key])
                  : updateData[key];
            } catch (e) {
              console.error("Error parsing location:", e);
              continue;
            }
          } else if (
            key === "facility" &&
            typeof updateData[key] === "string"
          ) {
            updatedUser[key] = [updateData[key]]; // Ensure facility is an array
          } else if (
            key === "roomInfo" &&
            typeof updateData[key] === "string"
          ) {
            try {
              let roomInfoData =
                typeof updateData[key] === "string"
                  ? JSON.parse(updateData[key])
                  : updateData[key];

              // Validate each room info object
              roomInfoData = roomInfoData.map((room) => ({
                room:
                  room.room ||
                  `Room-${Math.random().toString(36).substr(2, 5)}`, // Add default if missing
                bedContains: room.bedContains || "",
                pricePerHead: room.pricePerHead || 0,
                roomAvailable: room.roomAvailable || false,
              }));

              updatedUser[key] = roomInfoData;
            } catch (e) {
              console.error("Error parsing roomInfo:", e);
              continue;
            }
          } else {
            updatedUser[key] = updateData[key];
          }
        }
      }

      // Upload profile photo to Cloudinary
      if (profilePhoto && profilePhoto[0]) {
        const result = await cloudinary.uploader.upload(profilePhoto[0].path);
        updatedUser.profilePhoto = result.secure_url;
      }

      // Handle mess photos
      const existingPhotoUrls =
        typeof updateData.existingPhotoUrls === "string"
          ? JSON.parse(updateData.existingPhotoUrls || "[]")
          : updateData.existingPhotoUrls || [];

      const newMessPhotoUrls = [];
      if (messPhoto && messPhoto.length > 0) {
        for (const photo of messPhoto) {
          const result = await cloudinary.uploader.upload(photo.path);
          newMessPhotoUrls.push(result.secure_url);
        }
      }

      updatedUser.messPhoto = [...existingPhotoUrls, ...newMessPhotoUrls];
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Save updated user data
    await updatedUser.save();

    res.status(200).json({
      message: "Details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating details:", error);
    res.status(500).json({
      error: "An error occurred while updating details",
      details: error.message,
    });
  }
};

exports.getDetails = async (req, res) => {
  const { userId, type } = req.query;
  console.log(userId, type);
  try {
    let userDetails;

    if (type === "student") {
      userDetails = await User.findById(userId);
    } else if (type === "owner") {
      userDetails = await PgOwner.findById(userId);
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({
      error: "Failed to fetch details",
      details: error.message,
    });
  }
};
