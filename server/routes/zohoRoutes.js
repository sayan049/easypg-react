const express = require("express");
const router = express.Router();
const { zohoCallback } = require("../controllers/zohoAuthController");

// Define the callback route
router.get("/callback", zohoCallback);

module.exports = router;
