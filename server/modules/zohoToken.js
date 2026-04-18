const mongoose = require("mongoose");

const zohoTokenSchema = new mongoose.Schema(
  {
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    expires_in: {
      type: Number, // in seconds
      required: true,
    },
    token_type: {
      type: String,
      default: "Bearer",
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Helper to check if the token is expired or near expiry (5 min buffer)
zohoTokenSchema.methods.isExpired = function () {
  const expiryTime = new Date(this.last_updated).getTime() + this.expires_in * 1000;
  // Return true if current time is 5 min before expiry
  return Date.now() >= expiryTime - 5 * 60 * 1000;
};

const ZohoToken = mongoose.model("ZohoToken", zohoTokenSchema);
module.exports = ZohoToken;

