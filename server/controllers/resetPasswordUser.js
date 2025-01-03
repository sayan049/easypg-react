const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../modules/user");

const resetPasswordUser = async (req, res) => {
  const { token, password } = req.body;
  console.log(password);
  console.log(token);

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded; // Extract user ID from decoded token
    

    // Find the user by ID
    const user = await User.findById(userId);
    console.log(userId);
    console.log("user:",user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
   
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};  

module.exports = resetPasswordUser;
