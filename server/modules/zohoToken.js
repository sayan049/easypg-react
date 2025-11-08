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
      type: Number, // seconds
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

// Optional helper to check if token expired
zohoTokenSchema.methods.isExpired = function () {
  const expiryTime = new Date(this.last_updated).getTime() + this.expires_in * 1000;
  return Date.now() > expiryTime;
};

const ZohoToken= mongoose.model("ZohoToken", zohoTokenSchema);
module.exports = ZohoToken;
