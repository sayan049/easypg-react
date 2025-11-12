const express = require("express");
const router = express.Router();
const Booking = require("../modules/Booking");
const authenticateJWT = require("../middleware/is-auth");

router.post("/checkin/:booking_id", authenticateJWT, async (req, res) => {
  try {
    const { booking_id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      booking_id,
      { isCheckedIn: true },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "done" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
