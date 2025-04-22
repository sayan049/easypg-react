const Booking = require('../modules/Booking');
const User = require("../modules/user");
const PgOwner = require("../modules/pgProvider");
const { sendNotificationEmail } = require('../services/notificationService'); // Example of using notification service
const { notifyOwner } = require("../sockets/bookingSocket"); // Import the notifyOwner function
const { notifyStudent } = require("../sockets/bookingSocket"); // Import the notifyStudent function for student notifications

// User initiating booking request
exports.createBookingRequest = async (req, res) => {
  try {
    const { studentId, ownerId, room, bedContains, pricePerHead } = req.body;

    // Find the owner and the room info
    const owner = await PgOwner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const roomInfo = owner.roomInfo.find(r => r.room === room);

    if (!roomInfo || roomInfo.bedContains === '0') {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Create the booking record
    const booking = new Booking({
      studentId,
      ownerId,
      roomSnapshot: {
        room,
        bedContains: roomInfo.bedContains,
        pricePerHead: roomInfo.pricePerHead
      }
    });

    await booking.save();

    // Send notification to owner via email and real-time
    sendNotificationEmail(owner.email, 'New Booking Request', `A new booking request has been made by user ${studentId}.`);

    const io = req.app.locals.io; // Retrieve the io instance from app.locals

    // Real-time notification for the owner
    notifyOwner(ownerId, "new-booking-request", { 
      message: `New booking request for Room ${room}`, 
      bookingId: booking._id,
      studentId,
      room,
      bedContains,
      pricePerHead
    }, io);

    // Real-time notification for the student
    notifyStudent(studentId, "booking-request-created", { 
      message: `Your booking request for Room ${room} has been created successfully.`,
      bookingId: booking._id
    }, io);

    res.status(200).json({ message: 'Booking request sent successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Owner approving or rejecting booking
exports.handleBookingApproval = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;  // 'accepted' or 'rejected'

    // Validate the status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the booking and update the status
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // If accepted, update room availability
    if (status === 'accepted') {
      const owner = await PgOwner.findById(booking.ownerId);
      const room = owner.roomInfo.find(r => r.room === booking.roomSnapshot.room);

      if (room) {
        room.bedContains = (parseInt(room.bedContains) - 1).toString(); // Reduce bed availability by 1
        await owner.save();
      }
    }

    // Send notification to user via email
    sendNotificationEmail(booking.studentId, 'Booking Status Update', `Your booking has been ${status} by the owner.`);

    // Real-time notification for the student
    const io = req.app.locals.io;
    notifyStudent(booking.studentId, "booking-status-update", { 
      message: `Your booking request has been ${status} by the owner.`,
      bookingId: booking._id,
      status
    }, io);

    res.status(200).json({ message: `Booking ${status} successfully`, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User canceling booking
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If the booking is accepted, update room availability
    if (booking.status === 'accepted') {
      const owner = await PgOwner.findById(booking.ownerId);
      const room = owner.roomInfo.find(r => r.room === booking.roomSnapshot.room);

      if (room) {
        room.bedContains = (parseInt(room.bedContains) + 1).toString(); // Increase bed availability by 1
        await owner.save();
      }
    }

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    // Send notification to user via email
    sendNotificationEmail(booking.studentId, 'Booking Canceled', 'Your booking has been canceled successfully.');

    // Real-time notification for the student
    const io = req.app.locals.io;
    notifyStudent(booking.studentId, "booking-canceled", { 
      message: 'Your booking has been canceled successfully.',
      bookingId: booking._id
    }, io);

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
