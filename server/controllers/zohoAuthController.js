import axios from "axios";
import ZohoToken from "../modules/zohoToken.js";

export const zohoCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Authorization code missing");

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

    const { access_token, refresh_token, expires_in, token_type } = response.data;

    // Save or update
    const existing = await ZohoToken.findOne();
    if (existing) {
      existing.access_token = access_token;
      existing.refresh_token = refresh_token;
      existing.expires_in = expires_in;
      existing.token_type = token_type;
      existing.last_updated = new Date();
      await existing.save();
    } else {
      await ZohoToken.create({
        access_token,
        refresh_token,
        expires_in,
        token_type,
      });
    }

    console.log("✅ Tokens saved to DB");
    res.send("✅ Authorization successful and tokens stored securely.");
  } catch (error) {
    console.error("❌ Token exchange failed:", error.response?.data || error.message);
    res.status(500).send("Error exchanging code for tokens.");
  }
};
