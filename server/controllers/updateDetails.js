const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");

exports.updateDetails = async (req, res) => {
  const { type, userId, ...updateData } = req.body;
  const { file } = req; // For profile or mess photo uploads
  
  try {
    let updatedUser;

    if (type === "student") {
      // Find the student (User) by ID
      updatedUser = await User.findById(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Allow updates only for address and pin
      const allowedUpdates = ["address", "pin"];
      for (const key in updateData) {
        if (allowedUpdates.includes(key)) {
          updatedUser[key] = updateData[key];
        }
      }

      // Handle profile photo update if file is provided
      if (file && file.path) {
        updatedUser.profilePhoto = file.path;
      }

    } else if (type === "owner") {
      // Find the owner (PgOwner) by ID
      updatedUser = await PgOwner.findById(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "Owner not found" });
      }

      // Allow updates for address, pincode, mobileNo, facility, messName, aboutMess, location
      const allowedUpdates = ["address", "pincode", "mobileNo", "facility", "messName", "aboutMess", "location"];
      for (const key in updateData) {
        if (allowedUpdates.includes(key)) {
          updatedUser[key] = updateData[key];
        }
      }

      // Handle mess photo upload if file is provided (for the owner's mess)
      if (file && file.path) {
        updatedUser.messPhoto.push(file.path);
      }

    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Save the updated document
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
exports.getDetails = async (req, res) => {
  const { userId, type } = req.query;
  console.log(userId,type);
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
    res.status(500).json({ error: "Failed to fetch details" });
  }
};
