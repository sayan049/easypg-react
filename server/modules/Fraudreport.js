const mongoose = require("mongoose");

const fraudReportSchema = new mongoose.Schema({
  stayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stay", // or your PG/Stay model name
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming you have a User model
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FraudReport = mongoose.model("FraudReport", fraudReportSchema);

module.exports = FraudReport;
