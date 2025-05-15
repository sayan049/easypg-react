const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const refreshToken ={

refreshTokenHandler :async (req, res) => {
  // const { refreshToken } = req.body;
  const refreshToken = req.cookies?.refreshToken;
  console.log("ref", refreshToken);

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

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    // Check if the refresh token exists in the user's stored tokens
    const tokenEntry = user.refreshTokens.find(
      (rt) =>
        rt.token === refreshToken &&
        (rt.device === req.headers["x-device-info"] ||
          req.headers["user-agent"] ||
          "Unknown Device")
    );

    if (!tokenEntry) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Prepare the payload for the new access token
    const name = user.firstName + " " + user.lastName;
    const payload = {
      id: user._id,
      email: user.email,
      name: name,
      type,
      loginMethod,
    };

    // If the user is an owner and uses Google login, include the image in the payload
    if (loginMethod === "google") {
      payload.image = user.image; // Assuming 'image' field exists on the PgOwner model
    }

    // Generate a new access token
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
},

getRefreshToken : async (req, res) => {
  try {
    // Get refresh token from HTTP-only cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token found",
        hasRefreshToken: false,
      });
    }

    // Just confirm existence - don't return the actual token
    return res.status(200).json({
      message: "Refresh token exists",
      hasRefreshToken: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error checking refresh token",
      hasRefreshToken: false,
    });
  }
}

};

module.exports = refreshToken;