const Booking = require('../modules/Booking');
const PgOwner = require("../modules/pgProvider");
const { sendNotification, NOTIFICATION_TYPES } = require('../services/notificationService');
const socketManager = require("../sockets/bookingSocket");
const mongoose = require('mongoose');

// Helper functions
const bedCountToNumber = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5
};

const numberToBedCount = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five"
};

// Create booking request
exports.createBookingRequest = async (req, res) => {
  try {
    const { student, pgOwner, room, bedsBooked, originalBedCount, pricePerMonth, period } = req.body;

    // Validate input
    if (!student || !pgOwner || !room || !originalBedCount || !pricePerMonth || !period?.startDate || !period?.durationMonths) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        requiredFields: ['student', 'pgOwner', 'room', 'originalBedCount', 'pricePerMonth', 'period.startDate', 'period.durationMonths']
      });
    }

    // Validate bedsBooked is a positive number
    if (bedsBooked <= 0 || bedsBooked > 5) {
      return res.status(400).json({
        success: false,
        message: 'Invalid number of beds requested (1-5 allowed)'
      });
    }

    // Find owner and room
    const owner = await PgOwner.findById(pgOwner);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    const roomInfo = owner.roomInfo.find(r => r.room === room);
    if (!roomInfo || !roomInfo.roomAvailable) {
      return res.status(400).json({ success: false, message: 'Room not available' });
    }

    // Check if requested beds are available
    const availableBeds = bedCountToNumber[roomInfo.bedContains];
    if (availableBeds < bedsBooked) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${availableBeds} bed${availableBeds !== 1 ? 's' : ''} available`,
        availableBeds
      });
    }

    // Calculate end date and total amount
    const endDate = calculateEndDate(period.startDate, period.durationMonths);
    const totalAmount = pricePerMonth * period.durationMonths;

    // Create booking
    const booking = new Booking({
      student,
      pgOwner,
      room,
      bedsBooked,
      originalBedCount,
      pricePerMonth,
      period: {
        startDate: period.startDate,
        durationMonths: period.durationMonths,
        endDate
      },
      payment: {
        totalAmount,
        deposit: pricePerMonth,
        status: 'pending'
      },
      status: 'pending'
    });

    await booking.save();

    // Send notifications
    const notificationPromises = [
      sendNotification(
        owner._id, 
        'Pgowner', 
        'New Booking Request', 
        `New booking request for ${room} (${bedsBooked} bed${bedsBooked > 1 ? 's' : ''})`,
        NOTIFICATION_TYPES.BOOKING,
        booking._id
      ),
      sendNotification(
        student, 
        'User', 
        'Booking Request Sent', 
        `Your booking request for ${owner.messName} has been submitted`,
        NOTIFICATION_TYPES.BOOKING,
        booking._id
      )
    ];

    await Promise.all(notificationPromises);

    // Socket notifications
    socketManager.notifyOwner(owner._id, "new-booking", { 
      bookingId: booking._id,
      room,
      bedsBooked,
      studentId: student,
      messName: owner.messName
    });

    socketManager.notifyStudent(student, "booking-created", {
      bookingId: booking._id,
      messName: owner.messName,
      room,
      startDate: period.startDate
    });

    res.status(201).json({ 
      success: true,
      booking: booking.toObject(),
      message: 'Booking request sent successfully' 
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Handle booking approval/rejection
exports.handleBookingApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status
    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status',
        allowedStatuses: ['confirmed', 'rejected']
      });
    }

    // Validate rejection reason if rejected
    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a booking'
      });
    }

    const booking = await Booking.findById(id).populate('student pgOwner');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Update booking status and rejection reason if provided
    booking.status = status;
    if (status === 'rejected') {
      booking.rejectionReason = rejectionReason;
      
      // If payment was made, initiate refund process
      if (booking.payment.status === 'paid') {
        booking.payment.status = 'refund_pending';
        // TODO: Integrate with payment gateway refund API
      }
    }

    await booking.save();

    // Update bed count if confirmed
    if (status === 'confirmed') {
      const owner = await PgOwner.findById(booking.pgOwner);
      const room = owner.roomInfo.find(r => r.room === booking.room);
      
      if (room) {
        const currentBeds = bedCountToNumber[room.bedContains];
        const newBeds = currentBeds - booking.bedsBooked;
        
        if (newBeds >= 0) {
          room.bedContains = numberToBedCount[newBeds];
          room.roomAvailable = newBeds > 0;
          await owner.save();
        }
      }

      // Update payment status if confirmed
      booking.payment.status = 'paid';
      await booking.save();
    }

    // Send notifications
    const notificationMessage = status === 'confirmed' 
      ? `Your booking for ${booking.pgOwner.messName} (Room: ${booking.room}) has been confirmed!` 
      : `Your booking request for ${booking.pgOwner.messName} was rejected. Reason: ${rejectionReason}`;

    await sendNotification(
      booking.student._id, 
      'User', 
      `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`, 
      notificationMessage,
      NOTIFICATION_TYPES.BOOKING,
      booking._id
    );

    socketManager.notifyStudent(booking.student._id, "booking-status-update", {
      bookingId: booking._id,
      status,
      message: notificationMessage,
      ...(status === 'rejected' && { rejectionReason })
    });

    res.status(200).json({ 
      success: true,
      message: `Booking ${status} successfully`,
      booking: booking.toObject()
    });

  } catch (error) {
    console.error('Booking approval error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update booking status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(id).populate('student pgOwner');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Validate booking can be cancelled
    if (booking.status !== 'confirmed' && booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled in its current state (${booking.status})`
      });
    }

    // Restore bed count if booking was confirmed
    if (booking.status === 'confirmed') {
      const owner = await PgOwner.findById(booking.pgOwner);
      const room = owner.roomInfo.find(r => r.room === booking.room);
      
      if (room) {
        const currentBeds = bedCountToNumber[room.bedContains];
        const newBeds = currentBeds + booking.bedsBooked;
        
        if (newBeds <= bedCountToNumber[booking.originalBedCount]) {
          room.bedContains = numberToBedCount[newBeds];
          room.roomAvailable = true;
          await owner.save();
        }
      }

      // Handle refund if payment was made
      if (booking.payment.status === 'paid') {
        booking.payment.status = 'refund_pending';
        // TODO: Integrate with payment gateway refund API
      }
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    await booking.save();

    // Send notifications
    const notificationMessage = cancellationReason
      ? `Your booking has been cancelled. Reason: ${cancellationReason}`
      : 'Your booking has been cancelled successfully';

    await sendNotification(
      booking.student._id, 
      'User', 
      'Booking Cancelled', 
      notificationMessage,
      NOTIFICATION_TYPES.BOOKING,
      booking._id
    );

    // Notify owner if needed
    await sendNotification(
      booking.pgOwner._id,
      'Pgowner',
      'Booking Cancelled',
      `Booking for ${booking.room} has been cancelled by student`,
      NOTIFICATION_TYPES.BOOKING,
      booking._id
    );

    socketManager.notifyStudent(booking.student._id, "booking-cancelled", {
      bookingId: booking._id,
      message: notificationMessage,
      cancellationReason
    });

    socketManager.notifyOwner(booking.pgOwner._id, "booking-cancelled", {
      bookingId: booking._id,
      room: booking.room,
      studentId: booking.student._id
    });

    res.status(200).json({ 
      success: true,
      message: 'Booking cancelled successfully',
      booking: booking.toObject()
    });

  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to calculate end date
function calculateEndDate(startDate, durationMonths) {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);
  return endDate;
}