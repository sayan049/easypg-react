const axios = require("axios");
const ZohoToken = require("../modules/ZohoToken");
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
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
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
