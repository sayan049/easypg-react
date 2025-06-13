const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const refreshToken = {
  refreshTokenHandler: async (req, res) => {
    const refreshToken = req.cookies?.refreshToken  || req.headers.authorization?.split(" ")[1];
    const deviceInfo =
      req.headers["x-device-info"] ||
      req.headers["user-agent"] ||
      "Unknown Device";

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
      // Verify the old refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const { id, type, loginMethod } = decoded;

      // Get user
      let user;
      if (type === "student") {
        user = await User.findById(id);
      } else if (type === "owner") {
        user = await PgOwner.findById(id);
      }

      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }

      // Check if the token exists for this device
      const existingTokenIndex = user.refreshTokens.findIndex(
        (rt) => rt.token === refreshToken && rt.device === deviceInfo
      );

      if (existingTokenIndex === -1) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Remove the previous token for this device
      user.refreshTokens.splice(existingTokenIndex, 1);

      // Prepare payload for new tokens
      const name = user.firstName + " " + user.lastName;
      const payload = {
        id: user._id,
        email: user.email,
        name,
        type,
        loginMethod,
      };

      if (loginMethod === "google" ) {
        payload.image = user.image;
      }

      // Generate new tokens
      const newAccessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "30m",
      });
      const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: "30d",
      });

      // Save new refresh token
      user.refreshTokens.push({ token: newRefreshToken, device: deviceInfo });
      await user.save();

      // Send tokens via cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: ".messmate.co.in",
        path: "/",
        maxAge: 30 * 60 * 1000, // 30 minutes
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: ".messmate.co.in",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res
        .status(200)
        .json({ message: "Access and refresh tokens refreshed successfully" });
    } catch (error) {
      console.error("Refresh token error:", error);
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }
  },

  getRefreshToken: async (req, res) => {
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
  },

  getAccessToken: async (req, res) => {
    try {
      // Get refresh token from HTTP-only cookie
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        return res.status(401).json({
          message: "No refresh token found",
          hasAccessToken: false,
        });
      }

      // Just confirm existence - don't return the actual token
      return res.status(200).json({
        message: "Refresh token exists",
        hasAccessToken: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error checking refresh token",
        hasAccessToken: false,
      });
    }
  },
};

module.exports = refreshToken;
