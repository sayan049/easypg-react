const cron = require("node-cron");
const Booking = require("../models/booking");

const startExpirationJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    const now = new Date();
    const expiredThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
      const result = await Booking.updateMany(
        { status: "pending", createdAt: { $lte: expiredThreshold } },
        { $set: { status: "expired" } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${result.modifiedCount} pending bookings expired`);
      }
    } catch (err) {
      console.error("❌ Error expiring bookings:", err);
    }
  });
};

module.exports = startExpirationJob;
