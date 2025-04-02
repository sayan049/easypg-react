const bcrypt = require("bcrypt");
const User = require("../models/User"); // Import the User model
const PgOwner = require("../models/PgOwner"); // Import the PgOwner model

exports.resetPassword = async (req, res) => {
    const { type, userId, currentPassword, newPassword } = req.body;

    try {
        let user = type === "student" ? await User.findById(userId) : await PgOwner.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();
        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "An error occurred while updating password" });
    }
};
