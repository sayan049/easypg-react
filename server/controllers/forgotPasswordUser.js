const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../modules/User"); // Adjust path to your User model

const forgotPasswordUser = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if user is verified
      if (!user.is_verified) {
        return res.status(403).json({ message: "User account is not verified." });
      }
  
      // Generate a reset token and set expiry time
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
      await user.save();
  
      // Set up email transport
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: USER_EMAIL,
            pass: USER_PASSWORD
        },
      });
  
      // Construct reset URL for the user
      const resetUrl = `${req.protocol}://${req.get("host")}/user/reset-password/${resetToken}`;
      const mailOptions = {
        to: email,
        subject: "User Password Reset",
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Password reset email sent to the user" });
    } catch (error) {
      console.error("Error in forgotPasswordUser:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  module.exports = forgotPasswordUser;
  

