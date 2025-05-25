const cron = require("node-cron");
const Booking = require("../modules/Booking");

const startExpirationJob = (io) => {
  cron.schedule("*/10 * * * *", async () => {
    const now = new Date();
    // const expiredThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const expiredThreshold = new Date(now.getTime() - 2 * 60 * 1000);

    try {
      console.log("🕒 Cron running...");
      const result = await Booking.updateMany(
        { status: "pending", createdAt: { $lte: expiredThreshold } },
        { $set: { status: "expired" } }
      );

      expiredBookings.forEach((booking) => {
        const ownerId = booking.pgOwner.toString();
        io.to(`owner_${ownerId}`).emit("bookingExpired", {
          bookingId: booking._id,
          room: booking.room,
        });
      });
      if (result.modifiedCount > 0) {
        console.log(`✅ ${result.modifiedCount} pending bookings expired`);
      }
    } catch (err) {
      console.error("❌ Error expiring bookings:", err);
    }
  });
};

module.exports = startExpirationJob;
