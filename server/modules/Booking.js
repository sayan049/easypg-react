const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: {  // Changed from studentId to match frontend
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pgOwner: {  // Changed from ownerId to match frontend
      type: mongoose.Schema.Types.ObjectId,
      ref: "PgOwner",
      required: true,
    },
    room: { type: String, required: true },
    bedsBooked: { type: Number, required: true, min: 1, max: 5 },
    originalBedCount: {
      type: String,
      enum: ["one", "two", "three", "four", "five"],
      required: true,
    },
    pricePerHead: { type: Number, required: true },  // Changed from pricePerMonth to match frontend
    period: {
      startDate: { type: Date, required: true },
      durationMonths: { type: Number, required: true, min: 1, max: 24 },
      // Removed endDate as it can be calculated when needed
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "rejected"],
      default: "pending",
    },
    payment: {
      totalAmount: { type: Number, required: true },
      deposit: { type: Number, required: true },  // Made required explicitly
      status: {
        type: String,
        enum: ["pending", "partial", "paid", "refunded"],
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);