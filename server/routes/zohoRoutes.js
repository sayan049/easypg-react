const express = require("express");
const router = express.Router();
const { zohoCallback, refreshZohoToken } = require("../controllers/zohoAuthController");
require("dotenv").config();

const ZOHO_CRON_SECRET = process.env.ZOHO_CRON_SECRET;

// 🔹 Step 1: Zoho OAuth callback — triggered only once manually
router.get("/callback", zohoCallback);

// 🔹 Step 2: Refresh token — called automatically via cron job
router.get("/refresh-token", async (req, res, next) => {
  try {
    // Security check to ensure only your cron job triggers it
    if (req.query.secret !== ZOHO_CRON_SECRET) {
      return res.status(403).json({ success: false, error: "Unauthorized access" });
    }

    // Proceed to token refresh logic
    await refreshZohoToken(req, res);
  } catch (error) {
    console.error("❌ Error in refresh-token route:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;

