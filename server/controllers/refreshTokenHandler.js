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
    const { id, type,loginMethod } = decoded;
    
    let user;
    if (type === "student") {
      user = await User.findById(id);
    } else if (type === "owner") {
      user = await PgOwner.findById(id);
    }

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const name=  user.firstName+" "+user.lastName
    // Generate a new access token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email,name:name, type,loginMethod },
      JWT_SECRET,
      { expiresIn: "1h" } // Access token valid for 15 minutes
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
