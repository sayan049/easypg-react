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
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { 
      student, 
      pgOwner, 
      room, 
      bedsBooked = 1, // Default to 1 bed
      originalBedCount, 
      pricePerHead, // Changed from pricePerMonth
      period,
      payment // Added payment object from frontend
    } = req.body;

    // Validate input
    const requiredFields = ['student', 'pgOwner', 'room', 'originalBedCount', 'pricePerHead', 'period.startDate'];
    const missingFields = requiredFields.filter(field => {
      const parts = field.split('.');
      let value = req.body;
      for (const part of parts) {
        value = value[part];
        if (value === undefined) break;
      }
      return value === undefined;
    });

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        missingFields
      });
    }

    // Validate bedsBooked is within allowed range
    if (bedsBooked <= 0 || bedsBooked > 5) {
      return res.status(400).json({
        success: false,
        message: 'Invalid number of beds requested (1-5 allowed)'
      });
    }

    // Find owner and room (with session for transaction)
    const owner = await PgOwner.findById(pgOwner).session(session);
    if (!owner) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    const roomInfo = owner.roomInfo.find(r => r.room === room);
    if (!roomInfo || !roomInfo.roomAvailable) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Room not available' });
    }

    // Check bed availability
    const availableBeds = bedCountToNumber[roomInfo.bedContains];
    if (availableBeds < bedsBooked) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: `Only ${availableBeds} bed${availableBeds !== 1 ? 's' : ''} available`,
        availableBeds
      });
    }

    // Create booking with simplified structure
    const booking = new Booking({
      student,
      pgOwner,
      room,
      bedsBooked,
      originalBedCount,
      pricePerHead, // Changed from pricePerMonth
      period: {
        startDate: period.startDate,
        durationMonths: period.durationMonths || 6 // Default to 6 months
      },
      payment: payment || { // Use provided payment or default
        totalAmount: pricePerHead * ((period.durationMonths || 6) + 1), // Rent + deposit
        deposit: pricePerHead,
        status: 'pending'
      },
      status: 'pending'
    });

    await booking.save({ session });

    // Update room availability (reduce available beds)
    const updatedBeds = availableBeds - bedsBooked;
    roomInfo.bedContains = numberToBedCount[updatedBeds];
    roomInfo.roomAvailable = updatedBeds > 0;
    await owner.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Send notifications (outside transaction)
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
    await session.abortTransaction();
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Handle booking approval/rejection
exports.handleBookingApproval = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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
    if (status === 'rejected' && !rejectionReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a booking'
      });
    }

    const booking = await Booking.findById(id)
      .populate('student pgOwner')
      .session(session);
      
    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Validate booking can be updated
    if (booking.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Booking cannot be updated from ${booking.status} status`
      });
    }

    // Update booking
    booking.status = status;
    if (status === 'rejected') {
      booking.rejectionReason = rejectionReason;
      
      // Restore bed availability
      const owner = await PgOwner.findById(booking.pgOwner._id).session(session);
      const room = owner.roomInfo.find(r => r.room === booking.room);
      
      if (room) {
        const currentBeds = bedCountToNumber[room.bedContains];
        const newBeds = currentBeds + booking.bedsBooked;
        
        if (newBeds <= bedCountToNumber[booking.originalBedCount]) {
          room.bedContains = numberToBedCount[newBeds];
          room.roomAvailable = true;
          await owner.save({ session });
        }
      }
    }

    await booking.save({ session });
    await session.commitTransaction();

    // Send notifications (outside transaction)
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
    await session.abortTransaction();
    console.error('Booking approval error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update booking status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(id)
      .populate('student pgOwner')
      .session(session);
      
    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Validate booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled in ${booking.status} status`
      });
    }

    // Restore bed availability if booking was confirmed
    if (booking.status === 'confirmed') {
      const owner = await PgOwner.findById(booking.pgOwner._id).session(session);
      const room = owner.roomInfo.find(r => r.room === booking.room);
      
      if (room) {
        const currentBeds = bedCountToNumber[room.bedContains];
        const newBeds = currentBeds + booking.bedsBooked;
        
        if (newBeds <= bedCountToNumber[booking.originalBedCount]) {
          room.bedContains = numberToBedCount[newBeds];
          room.roomAvailable = true;
          await owner.save({ session });
        }
      }
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    
    if (booking.payment.status === 'paid') {
      booking.payment.status = 'refund_pending';
    }
    
    await booking.save({ session });
    await session.commitTransaction();

    // Send notifications (outside transaction)
    const notificationMessage = cancellationReason
      ? `Your booking has been cancelled. Reason: ${cancellationReason}`
      : 'Your booking has been cancelled';

    await Promise.all([
      sendNotification(
        booking.student._id, 
        'User', 
        'Booking Cancelled', 
        notificationMessage,
        NOTIFICATION_TYPES.BOOKING,
        booking._id
      ),
      sendNotification(
        booking.pgOwner._id,
        'Pgowner',
        'Booking Cancelled',
        `Booking for ${booking.room} has been cancelled`,
        NOTIFICATION_TYPES.BOOKING,
        booking._id
      )
    ]);

    // Socket notifications
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
    await session.abortTransaction();
    console.error('Booking cancellation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};