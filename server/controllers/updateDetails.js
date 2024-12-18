const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");

exports.updateDetails = async (req, res) => {
  const { type, userId, ...updateData } = req.body;
  const { profilePhoto, messPhotos } = req.files;  // Using req.files for multiple files
  try {
    let updatedUser;

    // For Student Type
    if (type === "student") {
      // Find student by ID
      updatedUser = await User.findById(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Allow updates for address and pin only
      const allowedUpdates = ["address", "pin"];
      for (const key in updateData) {
        if (allowedUpdates.includes(key)) {
          updatedUser[key] = updateData[key];
        }
      }

      // Handle profile photo update if file is uploaded
      if (profilePhoto && profilePhoto[0]?.path) {
        updatedUser.profilePhoto = profilePhoto[0].path;
      }

    } else if (type === "owner") {
      // Find owner by ID
      updatedUser = await PgOwner.findById(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "Owner not found" });
      }

      // Allow updates for multiple fields
      const allowedUpdates = ["address", "pincode", "mobileNo", "facility", "messName", "aboutMess", "location"];
      for (const key in updateData) {
        if (allowedUpdates.includes(key)) {
          updatedUser[key] = updateData[key];
        }
      }

      // Handle profile photo update
      if (profilePhoto && profilePhoto[0]?.path) {
        updatedUser.profilePhoto = profilePhoto[0].path;
      }

      // Handle mess photo update if multiple files are uploaded
      if (messPhotos && messPhotos.length > 0) {
        messPhotos.forEach(photo => {
          updatedUser.messPhoto.push(photo.path);
        });
      }

    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Save the updated user data
    await updatedUser.save();

    res.status(200).json({
      message: "Details updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("Error updating details:", error);
    res.status(500).json({ error: "An error occurred while updating details" });
  }
};
//fetching details
const User = require("../models/user");
const PgOwner = require("../models/pgProvider");

exports.getDetails = async (req, res) => {
  const { userId, type } = req.query;
  console.log(userId, type);
  try {
    let userDetails;

    // Fetch user details based on the user type
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
    res.status(500).json({ error: "Failed to fetch details" });
  }
};
