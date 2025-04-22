const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PgOwner",
      required: true,
    },
    roomSnapshot: {
      room: { type: String, required: true },
      bedContains: {
        type: String,
        enum: ["one", "two", "three", "four", "five"],
        required: true,
      },
      pricePerHead: { type: Number, required: true },
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    durationInMonths: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
    requestedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for performance
bookingSchema.index({ status: 1 });
bookingSchema.index({ ownerId: 1 });
bookingSchema.index({ studentId: 1 });
bookingSchema.index({ "roomSnapshot.room": 1 });
bookingSchema.index({ checkInDate: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

module.exports = Booking;
