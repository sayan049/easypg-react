const bcrypt = require("bcrypt");
const User = require("../modules/user"); // Ensure you import the User model
const PgOwner = require("../modules/pgProvider");
// const { resetPasswordDashboard } = require("../../client/src/constant/urls");

resetPasswordDashboard = async (req, res) => {
    const { type, userId, currentPassword, newPassword } = req.body;

    try {
        // Ensure userId and newPassword are provided
        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Fetch user and include password field if hidden
        let user = type === "student" 
            ? await User.findById(userId).select("+password") 
            : await PgOwner.findById(userId).select("+password");

        if (!user) return res.status(404).json({ error: "User not found" });

        // Compare current password with stored password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

        // Hash new password and save it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "An error occurred while updating password" });
    }
};

module.exports=resetPasswordDashboard;