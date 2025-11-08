const axios = require("axios");
const ZohoToken = require("../modules/zohoToken");
require("dotenv").config();

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;

exports.zohoCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    const response = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        code,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        redirect_uri: "https://api.messmate.co.in/oauth/zoho/callback",
        grant_type: "authorization_code",
      },
    });

    const data = response.data;
    console.log("✅ Tokens received:", data);

    await ZohoToken.findOneAndUpdate({}, data, { upsert: true, new: true });

    res.send(`
      <h2>✅ Authorization Successful!</h2>
      <p>Tokens have been stored securely in your database.</p>
      <p>You can now send emails using Zoho OAuth!</p>
    `);
  } catch (error) {
    console.error("❌ Token exchange failed:", error.response?.data || error.message);
    res.status(500).send("Error exchanging code for tokens.");
  }
};
exports.refreshZohoToken = async (req, res) => {
  try {
    const tokenData = await ZohoToken.findOne();
    if (!tokenData?.refresh_token) {
      return res
        .status(400)
        .json({ success: false, error: "No refresh token found in database" });
    }

    // Check if token is still valid
    if (!tokenData.isExpired()) {
      console.log("🔹 Access token still valid, no refresh needed.");
      return res
        ? res.status(200).json({ success: true, message: "Token still valid" })
        : null;
    }

    // Request new access token
    const response = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        refresh_token: tokenData.refresh_token,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    });

    // Update DB
    tokenData.access_token = response.data.access_token;
    tokenData.expires_in = response.data.expires_in || 3600;
    tokenData.last_updated = new Date();
    await tokenData.save();

    console.log("✅ Zoho Access Token refreshed successfully");

    if (res) {
      res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
      });
    }
  } catch (error) {
    console.error("❌ Error refreshing Zoho token:", error.response?.data || error.message);
    if (res) {
      res.status(500).json({ success: false, error: "Failed to refresh Zoho token" });
    }
  }
};

