const mongoose = require("mongoose");

const missedSocketEventSchema = new mongoose.Schema({
  recipientId: mongoose.Types.ObjectId,
  recipientType: { type: String, enum: ["user", "owner"], required: true },
  eventType: String,
  payload: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MissedSocketEvent", missedSocketEventSchema);
