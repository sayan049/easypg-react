const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    pgOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PgOwner",
      required: true,
    },
    title: { 
      type: String, 
      required: true, 
      trim: true,
    },
    description: { 
      type: String, 
      required: true, 
      trim: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "cancelled", "resolved"],
      default: "in-progress",
    },
    response: {
      type: String,
      default: "",
    },
    cancellationReason: { // ✅ new field
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

// ✅ Regular Indexes
maintenanceRequestSchema.index({ student: 1 });
maintenanceRequestSchema.index({ booking: 1 });
maintenanceRequestSchema.index({ pgOwner: 1 });
maintenanceRequestSchema.index({ status: 1, createdAt: -1 });

// ✅ TTL Index only for "in-progress" and older than 30 days
maintenanceRequestSchema.index(
  { createdAt: 1 },
  { 
    expireAfterSeconds: 2592000,
    partialFilterExpression: { status: { $in: ["in-progress", "cancelled"] }
    }
  }
);

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
