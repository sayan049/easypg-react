// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     student: {  // Changed from studentId to match frontend
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     pgOwner: {  // Changed from ownerId to match frontend
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "PgOwner",
//       required: true,
//     },
//     room: { type: String, required: true },
//     bedsBooked: { type: Number, required: true, min: 1, max: 5 },
//     originalBedCount: {
//       type: String,
//       enum: ["one", "two", "three", "four", "five"],
//       required: true,
//     },
//     pricePerHead: { type: Number, required: true },  // Changed from pricePerMonth to match frontend
//     period: {
//       startDate: { type: Date, required: true },
//       durationMonths: { type: Number, required: true, min: 1, max: 24 },
//       // Removed endDate as it can be calculated when needed
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled", "rejected"],
//       default: "pending",
//     },
//     payment: {
//       totalAmount: { type: Number, required: true },
//       deposit: { type: Number, required: true },  // Made required explicitly
//       status: {
//         type: String,
//         enum: ["pending", "partial", "paid", "refunded"],
//         default: "pending",
//       },
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     pgOwner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "PgOwner",
//       required: true,
//     },
//     room: { type: String, required: true },
//     bedsBooked: { type: Number, required: true, min: 1, max: 5 },
//     originalBedCount: {
//       type: String,
//       enum: ["one", "two", "three", "four", "five"],
//       required: true,
//     },
//     pricePerHead: { type: Number, required: true },
//     period: {
//       startDate: { type: Date, required: true },
//       durationMonths: { type: Number, required: true, min: 1, max: 24 },
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled", "rejected"],
//       default: "pending",
//     },
//     payment: {
//       totalAmount: { type: Number, required: true },
//       deposit: { type: Number, required: true },
//       status: {
//         type: String,
//         enum: ["pending", "partial", "paid", "refunded"],
//         default: "pending",
//       },
//     },
//   },
//   {
//     timestamps: true,
//     indexes: [
//       // Common query patterns
//       { student: 1 }, // Frequent student booking lookups
//       { pgOwner: 1 }, // Owner management queries
//       { status: 1 }, // Filter by status
//       { "period.startDate": 1 }, // Date-based queries
//       { createdAt: 1 }, // Time-based sorting

//       // Compound indexes
//       { status: 1, createdAt: 1 }, // Common for dashboard filters
//       { pgOwner: 1, status: 1 }, // Owner-specific status views
//       { room: 1, bedsBooked: 1 }, // Room capacity analysis
//       { "payment.status": 1, status: 1 } // Payment/status correlation
//     ]
//   }
// );

// module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pgOwner: {
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
    pricePerHead: { type: Number, required: true },
    period: {
      startDate: { type: Date, required: true },
      durationMonths: { type: Number, required: true, min: 1, max: 24 },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "rejected"],
      default: "pending",
    },
    payment: {
      totalAmount: { type: Number, required: true },
      deposit: { type: Number, required: true },
      status: {
        type: String,
        enum: ["pending", "partial", "paid", "refunded"],
        default: "pending",
      },
    },
    userCancellationReason: {
      type: String,
      default: "", // Optional, only filled when user cancels
      trim: true,
    },
    ownerRejectionReason: {
      type: String,
      default: "", // Optional, only filled when user cancels
      trim: true,
    },
  },
  { timestamps: true }
);

// ✅ Add indexes explicitly like this:
// bookingSchema.index({ student: 1 });
// bookingSchema.index({ pgOwner: 1 });
// bookingSchema.index({ status: 1 });
// bookingSchema.index({ "period.startDate": 1 });
// bookingSchema.index({ createdAt: 1 });
// bookingSchema.index({ status: 1, createdAt: 1 });
// bookingSchema.index({ pgOwner: 1, status: 1 });
// bookingSchema.index({ room: 1, bedsBooked: 1 });
// bookingSchema.index({ "payment.status": 1, status: 1 });
// bookingSchema.index({ pgOwner: 1, status: 1, createdAt: -1 }); // Main query
// bookingSchema.index({ student: 1, status: 1 }); // For student queries
// bookingSchema.index({ room: 1, pgOwner: 1 }); // For room-specific queries
// bookingSchema.index({ student: 1, pgOwner: 1, room: 1, status: 1 });
// 1. Student Portal Index (covers 90% of user queries)
bookingSchema.index(
  { student: 1, status: 1 },
  { name: "student_portal_index" }
);
bookingSchema.index(
  { pgOwner: 1, createdAt: -1, status: 1 },
  { name: "owner_management_index" }
);
bookingSchema.index(
  { "period.startDate": 1, status: 1 },
  {
    name: "date_filter_index",
    partialFilterExpression: { status: { $in: ["confirmed", "pending"] } },
  }
);
bookingSchema.index(
  { room: 1, pgOwner: 1, status: 1 },
  {
    name: "room_availability_index",
    partialFilterExpression: { status: "confirmed" },
  }
);

// Maintenance Index
bookingSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 5184000,
    partialFilterExpression: { status: { $in: ["cancelled", "rejected"] } },
  }
);

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
