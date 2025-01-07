const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

exports.refreshTokenHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const { id, type, loginMethod } = decoded;
    
    let user;
    if (type === "student") {
      user = await User.findById(id);
    } else if (type === "owner") {
      user = await PgOwner.findById(id);
    }

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const name = user.firstName + " " + user.lastName;
    
    // Prepare the payload for the new access token
    const payload = { 
      id: user._id, 
      email: user.email, 
      name: name, 
      type, 
      loginMethod 
    };

    // If user is an owner, include the image in the payload
    if (type === 'owner') {
      payload.image = user.image; // Assuming 'image' field exists on the PgOwner model
    }

    // Generate a new access token
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
