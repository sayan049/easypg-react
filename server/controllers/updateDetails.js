const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");
const path = require('path');
exports.updateDetails = async (req, res) => {
  const { type, userId, ...updateData } = req.body;
  const { profilePhoto, messPhoto } = req.files; // Multer handles files

  try {
      let updatedUser;

      if (type === "student") {
          updatedUser = await User.findById(userId);
          if (!updatedUser) {
              return res.status(404).json({ error: "Student not found" });
          }

          // Update allowed fields
          const allowedUpdates = ["address", "pin"];
          for (const key in updateData) {
              if (allowedUpdates.includes(key)) {
                  updatedUser[key] = updateData[key];
              }
          }

          // Save only the filename for profile photo
          if (profilePhoto && profilePhoto[0]?.filename) {
              updatedUser.profilePhoto = profilePhoto[0].filename;  // Store only the filename
          }
      } else if (type === "owner") {
          updatedUser = await PgOwner.findById(userId);
          if (!updatedUser) {
              return res.status(404).json({ error: "Owner not found" });
          }

          // Update allowed fields
          const allowedUpdates = ["address", "pincode", "mobileNo", "facility", "messName", "aboutMess", "location"];
          for (const key in updateData) {
              if (allowedUpdates.includes(key)) {
                  updatedUser[key] = updateData[key];
              }
          }

          // Save only the filename for profile photo
          if (profilePhoto && profilePhoto[0]?.filename) {
              updatedUser.profilePhoto = profilePhoto[0].filename;  // Store only the filename
          }

          // Save filenames for mess photos
          if (messPhoto && messPhoto.length > 0) {
              updatedUser.messPhoto = messPhoto.map(photo => photo.filename); // Store only filenames
          }
      } else {
          return res.status(400).json({ error: "Invalid user type" });
      }

      // Save the updated user data
      await updatedUser.save();

      res.status(200).json({ message: "Details updated successfully", data: updatedUser });
  } catch (error) {
      console.error("Error updating details:", error);
      res.status(500).json({ error: "An error occurred while updating details" });
  }
};

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
