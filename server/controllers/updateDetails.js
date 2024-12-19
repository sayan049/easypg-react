const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");

exports.updateDetails = async (req, res) => {
  const { type, userId, ...updateData } = req.body;
  const { profilePhoto, messPhoto } = req.files; // Extract files handled by multer

  try {
    let updatedUser;

    // Define allowed fields dynamically
    const allowedFields = {
      student: ["address", "pin"],
      owner: ["address", "pincode", "mobileNo", "facility", "messName", "aboutMess", "location"]
    };

    // Validate type
    if (!allowedFields[type]) {
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Fetch user by type
    updatedUser = type === "student" 
      ? await User.findById(userId) 
      : await PgOwner.findById(userId);

    if (!updatedUser) {
      return res.status(404).json({ error: `${type === "student" ? "Student" : "Owner"} not found` });
    }

    // Update fields
    Object.keys(updateData).forEach((key) => {
      if (allowedFields[type].includes(key)) {
        updatedUser[key] = updateData[key];
      }
    });

    // Update profile photo
    if (profilePhoto && profilePhoto[0]?.path) {
      updatedUser.profilePhoto = profilePhoto[0].path;
    }

    // Update mess photos (for owners only)
    if (type === "owner" && messPhoto && messPhoto.length > 0) {
      updatedUser.messPhoto = messPhoto.map((photo) => photo.path);
    }

    // Save updated data
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
