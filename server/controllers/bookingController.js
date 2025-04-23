const Booking = require('../modules/Booking');
const PgOwner = require("../modules/pgProvider");
const { sendNotification, NOTIFICATION_TYPES } = require('../services/notificationService');
const { notifyOwner, notifyStudent } = require("../sockets/bookingSocket");
const { Types } = require('mongoose');

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
    const { 
      student, 
      pgOwner, 
      room, 
      bedsBooked = 1,
      originalBedCount, 
      pricePerHead,
      period,
      payment
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

    // Find owner and room
    const owner = await PgOwner.findById(pgOwner);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    const roomInfo = owner.roomInfo.find(r => r.room === room);
    if (!roomInfo) {
      return res.status(400).json({ success: false, message: 'Room not found' });
    }

    // Validate room availability and bed configuration
    if (!roomInfo.roomAvailable) {
      return res.status(400).json({ success: false, message: 'Room not available' });
    }

    if (!roomInfo.bedContains || !bedCountToNumber[roomInfo.bedContains]) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid room configuration - missing bed count'
      });
    }

    const availableBeds = bedCountToNumber[roomInfo.bedContains];
    if (availableBeds < bedsBooked) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${availableBeds} bed${availableBeds !== 1 ? 's' : ''} available`,
        availableBeds
      });
    }

    // Create booking
    const booking = new Booking({
      student,
      pgOwner,
      room,
      bedsBooked,
      originalBedCount,
      pricePerHead,
      period: {
        startDate: period.startDate,
        durationMonths: period.durationMonths || 6
      },
      payment: payment || {
        totalAmount: pricePerHead * ((period.durationMonths || 6) + 1),
        deposit: pricePerHead,
        status: 'pending'
      },
      status: 'pending'
    });

    await booking.save();

    // Update room availability
    const updatedBeds = availableBeds - bedsBooked;
    roomInfo.bedContains = numberToBedCount[updatedBeds] || 'one';
    roomInfo.roomAvailable = updatedBeds > 0;
    await owner.save();

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
    notifyOwner(owner._id, "new-booking", { 
      _id: booking._id,
      room,
      bedsBooked,
      student: {
        _id: student,
        name: booking.student?.name || "Unknown User"
      },
      status: 'pending',
      period: booking.period,
      payment: booking.payment,
      createdAt: booking.createdAt
    });

    notifyStudent(student, "booking-created", {
      _id: booking._id,
      messName: owner.messName,
      room,
      status: 'pending',
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

// Get all bookings for owner dashboard

exports.getOwnerBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const ownerId = req.user._id; // From JWT

    // 1. Validate inputs
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Use: ${validStatuses.join(', ')}`
      });
    }

    // 2. Calculate pagination
    const safePage = Math.max(1, parseInt(page));
    const safeLimit = Math.min(50, parseInt(limit));
    const skip = (safePage - 1) * safeLimit;

    // 3. Run queries (modified for your schema)
    const [bookings, total] = await Promise.all([
      Booking.find({ 
        status, 
        pgOwner: ownerId // Using pgOwner field from your schema
      })
        .populate('student', 'firstName lastName email ') // Student info
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      
      Booking.countDocuments({ 
        status, 
        pgOwner: ownerId 
      })
    ]);

    // 4. Format response with calculated endDate
    const bookingsWithEndDate = bookings.map(booking => ({
      ...booking.toObject(),
      period: {
        ...booking.period,
        endDate: new Date(
          new Date(booking.period.startDate).setMonth(
            new Date(booking.period.startDate).getMonth() + booking.period.durationMonths
          )
        )
      }
    }));

    res.json({
      success: true,
      bookings: bookingsWithEndDate,
      pagination: {
        total,
        page: safePage,
        pages: Math.ceil(total / safeLimit),
        limit: safeLimit
      }
    });

  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
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
    if (status === 'rejected' && !rejectionReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a booking'
      });
    }

    const booking = await Booking.findById(id).populate('student pgOwner');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Validate booking can be updated
    if (booking.status !== 'pending') {
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
      const owner = await PgOwner.findById(booking.pgOwner._id);
      const room = owner.roomInfo.find(r => r.room === booking.room);
      
      if (room) {
        const currentBeds = bedCountToNumber[room.bedContains] || 0;
        const newBeds = currentBeds + booking.bedsBooked;
        room.bedContains = numberToBedCount[newBeds] || 'one';
        room.roomAvailable = true;
        await owner.save();
      }
    }

    await booking.save();

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

    // Socket notifications
    notifyStudent(booking.student._id, "booking-status-update", {
      _id: booking._id,
      status,
      message: notificationMessage,
      ...(status === 'rejected' && { rejectionReason })
    });

    // Notify owner if needed
    if (status === 'confirmed') {
      notifyOwner(booking.pgOwner._id, "booking-updated", booking.toObject());
    }

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
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled in ${booking.status} status`
      });
    }

    // Restore bed availability if booking was confirmed
    if (booking.status === 'confirmed') {
      const owner = await PgOwner.findById(booking.pgOwner._id);
      const room = owner.roomInfo.find(r => r.room === booking.room);
      
      if (room) {
        const currentBeds = bedCountToNumber[room.bedContains] || 0;
        const newBeds = currentBeds + booking.bedsBooked;
        room.bedContains = numberToBedCount[newBeds] || 'one';
        room.roomAvailable = true;
        await owner.save();
      }
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    
    if (booking.payment.status === 'paid') {
      booking.payment.status = 'refund_pending';
    }
    
    await booking.save();

    // Send notifications
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
    notifyStudent(booking.student._id, "booking-cancelled", {
      _id: booking._id,
      message: notificationMessage,
      cancellationReason
    });

    notifyOwner(booking.pgOwner._id, "booking-cancelled", {
      _id: booking._id,
      room: booking.room,
      studentId: booking.student._id,
      status: 'cancelled'
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