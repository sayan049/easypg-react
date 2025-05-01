const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User =  require("../modules/pgProvider");
require("dotenv").config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';

const forgotPasswordUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that the user does not exist
      return res.status(200).json({ message: "If your email exists, a password reset email will be sent." });
    }

    // Check if user is verified
    if (!user.is_verified_Owner) {
      return res.status(403).json({ message: "User account is not verified." });
    }
    if (user.googleId) {
      return res.status(400).json({ message: "You cannot reset your password because you signed up with Google." });
    }
    // Generate a reset token with JWT (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set up email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: USER_EMAIL,
        pass: USER_PASSWORD,
      },
    });

    // Construct reset URL for the user
    const resetUrl = `${frontendUrl}/LoginOwner?resetToken=${resetToken}`;


    const mailOptions = {
      from: USER_EMAIL,
      to: email,
      subject: "User Password Reset",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent to the user" });
  } catch (error) {
    console.error("Error in forgotPasswordUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = forgotPasswordUser;
 