const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pgOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pgowner",
      required: true,
    },
    room: {
      type: String,  // Matches roomInfo.room in PgOwner
      required: true
    },
    bedsBooked: {  // Number of beds being booked (usually 1)
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 5
    },
    originalBedCount: {  // Snapshot of bedContains at booking time ("one", "two", etc.)
      type: String,
      enum: ["one", "two", "three", "four", "five"],
      required: true
    },
    pricePerMonth: {
      type: Number,
      required: true
    },
    period: {
      startDate: {
        type: Date,
        required: true
      },
      durationMonths: {
        type: Number,
        required: true,
        min: 1,
        max: 24
      },
      endDate: Date
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "rejected", "completed"],
      default: "pending"
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

// Convert bedCount string to number
const bedCountToNumber = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5
};

// Convert number to bedCount string
const numberToBedCount = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five"
};

// Update bed availability when booking is confirmed/cancelled
bookingSchema.post('save', async function(doc) {
  if (doc.status === 'confirmed' || doc.status === 'cancelled') {
    const PgOwner = mongoose.model('Pgowner');
    const pgOwner = await PgOwner.findById(doc.pgOwner);
    
    const roomIndex = pgOwner.roomInfo.findIndex(r => r.room === doc.room);
    if (roomIndex === -1) return;

    const currentBedCount = bedCountToNumber[pgOwner.roomInfo[roomIndex].bedContains];
    const bedsAvailable = currentBedCount - (doc.status === 'confirmed' ? doc.bedsBooked : -doc.bedsBooked);
    
    // Update bedContains if within valid range
    if (bedsAvailable >= 1 && bedsAvailable <= 5) {
      pgOwner.roomInfo[roomIndex].bedContains = numberToBedCount[bedsAvailable];
      pgOwner.roomInfo[roomIndex].roomAvailable = bedsAvailable > 0;
      await pgOwner.save();
    }
  }
});

// Check room availability before booking
bookingSchema.statics.checkAvailability = async function(pgOwnerId, roomNumber) {
  const PgOwner = mongoose.model('Pgowner');
  const pgOwner = await PgOwner.findById(pgOwnerId);
  
  const room = pgOwner.roomInfo.find(r => r.room === roomNumber);
  if (!room) throw new Error("Room not found");
  
  return {
    available: room.roomAvailable,
    bedsAvailable: bedCountToNumber[room.bedContains],
    price: room.pricePerHead
  };
};

// Indexes for better performance
bookingSchema.index({ pgOwner: 1, room: 1 });
bookingSchema.index({ student: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ "period.startDate": 1 });
bookingSchema.index({ "period.endDate": 1 });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;