// const Booking = require('../modules/Booking');
// const PgOwner = require("../modules/pgProvider");
// const { sendNotification, NOTIFICATION_TYPES } = require('../services/notificationService');
// const SocketManager = require("../sockets/bookingSocket");
// const { Types } = require('mongoose');

// // Helper functions
// const bedCountToNumber = {
//   one: 1,
//   two: 2,
//   three: 3,
//   four: 4,
//   five: 5
// };

// const numberToBedCount = {
//   1: "one",
//   2: "two",
//   3: "three",
//   4: "four",
//   5: "five"
// };

// // Create booking request
// exports.createBookingRequest = async (req, res) => {
//   try {
//     const {
//       student,
//       pgOwner,
//       room,
//       bedsBooked = 1,
//       originalBedCount,
//       pricePerHead,
//       period,
//       payment
//     } = req.body;

//     // Validate input
//     const requiredFields = ['student', 'pgOwner', 'room', 'originalBedCount', 'pricePerHead', 'period.startDate'];
//     const missingFields = requiredFields.filter(field => {
//       const parts = field.split('.');
//       let value = req.body;
//       for (const part of parts) {
//         value = value[part];
//         if (value === undefined) break;
//       }
//       return value === undefined;
//     });

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields',
//         missingFields
//       });
//     }

//     // Validate bedsBooked is within allowed range
//     if (bedsBooked <= 0 || bedsBooked > 5) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid number of beds requested (1-5 allowed)'
//       });
//     }

//     // Find owner and room
//     const owner = await PgOwner.findById(pgOwner);
//     if (!owner) {
//       return res.status(404).json({ success: false, message: 'Owner not found' });
//     }

//     const roomInfo = owner.roomInfo.find(r => r.room === room);
//     if (!roomInfo) {
//       return res.status(400).json({ success: false, message: 'Room not found' });
//     }

//     // Validate room availability and bed configuration
//     if (!roomInfo.roomAvailable) {
//       return res.status(400).json({ success: false, message: 'Room not available' });
//     }

//     if (!roomInfo.bedContains || !bedCountToNumber[roomInfo.bedContains]) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid room configuration - missing bed count'
//       });
//     }

//     const availableBeds = bedCountToNumber[roomInfo.bedContains];
//     if (availableBeds < bedsBooked) {
//       return res.status(400).json({
//         success: false,
//         message: `Only ${availableBeds} bed${availableBeds !== 1 ? 's' : ''} available`,
//         availableBeds
//       });
//     }

//     // Create booking
//     const booking = new Booking({
//       student,
//       pgOwner,
//       room,
//       bedsBooked,
//       originalBedCount,
//       pricePerHead,
//       period: {
//         startDate: period.startDate,
//         durationMonths: period.durationMonths || 6
//       },
//       payment: payment || {
//         totalAmount: pricePerHead * ((period.durationMonths || 6) + 1),
//         deposit: pricePerHead,
//         status: 'pending'
//       },
//       status: 'pending'
//     });

//     await booking.save();

//     // Update room availability
//     const updatedBeds = availableBeds - bedsBooked;
//     roomInfo.bedContains = numberToBedCount[updatedBeds] || 'one';
//     roomInfo.roomAvailable = updatedBeds > 0;
//     await owner.save();

//     // Send notifications
//     const notificationPromises = [
//       sendNotification(
//         owner._id,
//         'Pgowner',
//         'New Booking Request',
//         `New booking request for ${room} (${bedsBooked} bed${bedsBooked > 1 ? 's' : ''})`,
//         NOTIFICATION_TYPES.BOOKING,
//         booking._id
//       ),
//       sendNotification(
//         student,
//         'User',
//         'Booking Request Sent',
//         `Your booking request for ${owner.messName} has been submitted`,
//         NOTIFICATION_TYPES.BOOKING,
//         booking._id
//       )
//     ];

//     await Promise.all(notificationPromises);

//     // Socket notifications
//     notifyOwner(owner._id, "new-booking", {
//       _id: booking._id,
//       room,
//       bedsBooked,
//       student: {
//         _id: student,
//         name: booking.student?.name || "Unknown User"
//       },
//       status: 'pending',
//       period: booking.period,
//       payment: booking.payment,
//       createdAt: booking.createdAt
//     });

//     notifyStudent(student, "booking-created", {
//       _id: booking._id,
//       messName: owner.messName,
//       room,
//       status: 'pending',
//       startDate: period.startDate
//     });

//     res.status(201).json({
//       success: true,
//       booking: booking.toObject(),
//       message: 'Booking request sent successfully'
//     });

//   } catch (error) {
//     console.error('Booking creation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create booking',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Get all bookings for owner dashboard

// exports.getOwnerBookings = async (req, res) => {
//   try {
//     console.log("Authenticated User:", req.user); // Debug JWT payload

//     const { status = 'pending', page = 1, limit = 10 } = req.query;
//     const ownerId = req.user.id;

//     // Debug: Check raw bookings count
//     const rawCount = await Booking.countDocuments({ pgOwner: ownerId });
//     console.log(`Total bookings for owner ${ownerId}:`, rawCount);

//     // Debug: Check bookings with status filter
//     const filteredCount = await Booking.countDocuments({
//       pgOwner: ownerId,
//       status
//     });
//     console.log(`Bookings with status ${status}:`, filteredCount);

//     const [bookings, total] = await Promise.all([
//       Booking.find({
//         pgOwner: ownerId,
//         status
//       })
//       .populate('student', 'firstName lastName email ')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .lean(), // Convert to plain JS objects

//       Booking.countDocuments({ pgOwner: ownerId, status })
//     ]);

//     console.log("Found bookings:", bookings.length); // Debug actual results

//     const bookingsWithEndDate = bookings.map(booking => ({
//       ...booking,
//       period: {
//         ...booking.period,
//         endDate: new Date(
//           new Date(booking.period.startDate).setMonth(
//             new Date(booking.period.startDate).getMonth() +
//             booking.period.durationMonths
//           )
//         )
//       }
//     }));

//     res.json({
//       success: true,
//       bookings: bookingsWithEndDate,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / limit),
//         limit: parseInt(limit)
//       }
//     });

//   } catch (error) {
//     console.error('Error details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message // Include actual error message
//     });
//   }
// };

// // Handle booking approval/rejection
// exports.handleBookingApproval = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, rejectionReason } = req.body;

//     // Validate status
//     if (!['confirmed', 'rejected'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status',
//         allowedStatuses: ['confirmed', 'rejected']
//       });
//     }

//     // Validate rejection reason if rejected
//     if (status === 'rejected' && !rejectionReason?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Rejection reason is required when rejecting a booking'
//       });
//     }

//     const booking = await Booking.findById(id).populate('student pgOwner');
//     if (!booking) {
//       return res.status(404).json({ success: false, message: 'Booking not found' });
//     }

//     // Validate booking can be updated
//     if (booking.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: `Booking cannot be updated from ${booking.status} status`
//       });
//     }

//     // Update booking
//     booking.status = status;
//     if (status === 'rejected') {
//       booking.rejectionReason = rejectionReason;

//       // Restore bed availability
//       const owner = await PgOwner.findById(booking.pgOwner._id);
//       const room = owner.roomInfo.find(r => r.room === booking.room);

//       if (room) {
//         const currentBeds = bedCountToNumber[room.bedContains] || 0;
//         const newBeds = currentBeds + booking.bedsBooked;
//         room.bedContains = numberToBedCount[newBeds] || 'one';
//         room.roomAvailable = true;
//         await owner.save();
//       }
//     }

//     await booking.save();

//     // Send notifications
//     const notificationMessage = status === 'confirmed'
//       ? `Your booking for ${booking.pgOwner.messName} (Room: ${booking.room}) has been confirmed!`
//       : `Your booking request for ${booking.pgOwner.messName} was rejected. Reason: ${rejectionReason}`;

//     await sendNotification(
//       booking.student._id,
//       'User',
//       `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
//       notificationMessage,
//       NOTIFICATION_TYPES.BOOKING,
//       booking._id
//     );

//     // Socket notifications
//     notifyStudent(booking.student._id, "booking-status-update", {
//       _id: booking._id,
//       status,
//       message: notificationMessage,
//       ...(status === 'rejected' && { rejectionReason })
//     });

//     // Notify owner if needed
//     if (status === 'confirmed') {
//       notifyOwner(booking.pgOwner._id, "booking-updated", booking.toObject());
//     }

//     res.status(200).json({
//       success: true,
//       message: `Booking ${status} successfully`,
//       booking: booking.toObject()
//     });

//   } catch (error) {
//     console.error('Booking approval error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update booking status',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Cancel booking
// exports.cancelBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { cancellationReason } = req.body;

//     const booking = await Booking.findById(id).populate('student pgOwner');
//     if (!booking) {
//       return res.status(404).json({ success: false, message: 'Booking not found' });
//     }

//     // Validate booking can be cancelled
//     if (!['pending', 'confirmed'].includes(booking.status)) {
//       return res.status(400).json({
//         success: false,
//         message: `Booking cannot be cancelled in ${booking.status} status`
//       });
//     }

//     // Restore bed availability if booking was confirmed
//     if (booking.status === 'confirmed') {
//       const owner = await PgOwner.findById(booking.pgOwner._id);
//       const room = owner.roomInfo.find(r => r.room === booking.room);

//       if (room) {
//         const currentBeds = bedCountToNumber[room.bedContains] || 0;
//         const newBeds = currentBeds + booking.bedsBooked;
//         room.bedContains = numberToBedCount[newBeds] || 'one';
//         room.roomAvailable = true;
//         await owner.save();
//       }
//     }

//     // Update booking status
//     booking.status = 'cancelled';
//     booking.cancellationReason = cancellationReason;
//     booking.cancelledAt = new Date();

//     if (booking.payment.status === 'paid') {
//       booking.payment.status = 'refund_pending';
//     }

//     await booking.save();

//     // Send notifications
//     const notificationMessage = cancellationReason
//       ? `Your booking has been cancelled. Reason: ${cancellationReason}`
//       : 'Your booking has been cancelled';

//     await Promise.all([
//       sendNotification(
//         booking.student._id,
//         'User',
//         'Booking Cancelled',
//         notificationMessage,
//         NOTIFICATION_TYPES.BOOKING,
//         booking._id
//       ),
//       sendNotification(
//         booking.pgOwner._id,
//         'Pgowner',
//         'Booking Cancelled',
//         `Booking for ${booking.room} has been cancelled`,
//         NOTIFICATION_TYPES.BOOKING,
//         booking._id
//       )
//     ]);

//     // Socket notifications
//     notifyStudent(booking.student._id, "booking-cancelled", {
//       _id: booking._id,
//       message: notificationMessage,
//       cancellationReason
//     });

//     notifyOwner(booking.pgOwner._id, "booking-cancelled", {
//       _id: booking._id,
//       room: booking.room,
//       studentId: booking.student._id,
//       status: 'cancelled'
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Booking cancelled successfully',
//       booking: booking.toObject()
//     });

//   } catch (error) {
//     console.error('Booking cancellation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to cancel booking',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };
const Booking = require("../modules/Booking");
const PgOwner = require("../modules/pgProvider");
const {
  sendNotification,
  NOTIFICATION_TYPES,
} = require("../services/notificationService");
// const SocketManager = require("../sockets/bookingSocket");
const { Types } = require("mongoose");
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Helper functions
const bedCountToNumber = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

const numberToBedCount = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
};

// Create booking request (NO BED DEDUCTION HERE)
exports.createBookingRequest = async (req, res) => {
  console.log("studentId",req.user.id);
  try {
    const {
      student,
      pgOwner,
      room,
      bedsBooked = 1,
      originalBedCount,
      pricePerHead,
      period,
      payment,
    } = req.body;

    // Validate input
    const requiredFields = [
      "student",
      "pgOwner",
      "room",
      "originalBedCount",
      "pricePerHead",
      "period.startDate",
    ];
    const missingFields = requiredFields.filter((field) => {
      const parts = field.split(".");
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
        message: "Missing required fields",
        missingFields,
      });
    }

    if (bedsBooked <= 0 || bedsBooked > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid number of beds requested (1-5 allowed)",
      });
    }

    const owner = await PgOwner.findById(pgOwner);
    if (!owner) {
      return res
        .status(404)
        .json({ success: false, message: "Owner not found" });
    }

    const roomInfo = owner.roomInfo.find((r) => r.room === room);
    if (!roomInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Room not found" });
    }
    // Check if student has already requested this room from same owner
    const existingBooking = await Booking.findOne({
      student,
      pgOwner,
      room,
      status: { $in: ["pending", "confirmed"] }, // Don't allow duplicates if already requested or booked
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already made a booking request for this room.",
      });
    }

    // Only check availability, don't modify
    const availableBeds = bedCountToNumber[roomInfo.bedContains] || 0;
    if (availableBeds < bedsBooked) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableBeds} bed${
          availableBeds !== 1 ? "s" : ""
        } available`,
        availableBeds,
      });
    }

    // Create booking without modifying beds
    const booking = new Booking({
      student,
      pgOwner,
      room,
      bedsBooked,
      originalBedCount,
      pricePerHead,
      period: {
        startDate: period.startDate,
        durationMonths: period.durationMonths || 6,
      },
      payment: payment || {
        totalAmount: pricePerHead * ((period.durationMonths || 6) + 1),
        deposit: pricePerHead,
        status: "pending",
      },
      status: "pending",
    });

    await booking.save();

    // Send notifications
    const notificationPromises = [
      sendNotification(
        owner._id,
        "PgOwner",
        "New Booking Request",
        `New booking request for ${room} (${bedsBooked} bed${
          bedsBooked > 1 ? "s" : ""
        })`,
        NOTIFICATION_TYPES.BOOKING,
        booking._id
      ),
      sendNotification(
        student,
        "User",
        "Booking Request Sent",
        `Your booking request for ${owner.messName} has been submitted`,
        NOTIFICATION_TYPES.BOOKING,
        booking._id
      ),
    ];

    await Promise.all(notificationPromises);

    // Socket notifications
    const bookingPayload = {
      _id: booking._id,
      room,
      bedsBooked,
      student: {
        _id: student,
        firstName: booking.student?.firstName || "Unknown",
        lastName: booking.student?.lastName || "User",
      },
      status: "pending",
      period: booking.period,
      payment: booking.payment,
      createdAt: booking.createdAt,
    };

    // SocketManager.notifyOwnerNewBooking(owner._id, bookingPayload);
    // SocketManager.notifyStudentBookingStatus(student, {
    //   ...bookingPayload,
    //   messName: owner.messName,
    //   startDate: period.startDate
    // });

    res.status(201).json({
      success: true,
      booking: booking.toObject(),
      message: "Booking request sent successfully",
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
exports.getOwnerBookings = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Debug JWT payload

    const { status = "pending", page = 1, limit = 10 } = req.query;
    const ownerId = req.user.id;

    // Debug: Check raw bookings count
    const rawCount = await Booking.countDocuments({ pgOwner: ownerId });
    console.log(`Total bookings for owner ${ownerId}:`, rawCount);

    // Debug: Check bookings with status filter
    const filteredCount = await Booking.countDocuments({
      pgOwner: ownerId,
      status,
    });
    console.log(`Bookings with status ${status}:`, filteredCount);

    const [bookings, total] = await Promise.all([
      Booking.find({
        pgOwner: ownerId,
        status,
      })
        .populate("student", "firstName lastName email ")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(), // Convert to plain JS objects

      Booking.countDocuments({ pgOwner: ownerId, status }),
    ]);

    console.log("Found bookings:", bookings.length); // Debug actual results

    const bookingsWithEndDate = bookings.map((booking) => ({
      ...booking,
      period: {
        ...booking.period,
        endDate: new Date(
          new Date(booking.period.startDate).setMonth(
            new Date(booking.period.startDate).getMonth() +
              booking.period.durationMonths
          )
        ),
      },
    }));

    res.json({
      success: true,
      bookings: bookingsWithEndDate,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message, // Include actual error message
    });
  }
};
// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query to use student_portal_index efficiently
    const query = { 
      student: req.user.id,
      ...(status && { status }) // Optional status filter
    };

    // Optimized query using covering index pattern
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .select('room status period.startDate period.durationMonths payment.totalAmount pgOwner')
        .populate('pgOwner', 'messName address')
        .sort({ createdAt: -1 }) // Uses owner_management_index sort
        .skip(skip)
        .limit(limit)
        .lean(), // Convert to plain JS objects
      
      Booking.countDocuments(query)
    ]);

    // Calculate end dates without modifying original objects
    const processedBookings = bookings.map(booking => ({
      ...booking,
      period: {
        startDate: booking.period.startDate,
        durationMonths: booking.period.durationMonths,
        endDate: new Date(
          new Date(booking.period.startDate).setMonth(
            new Date(booking.period.startDate).getMonth() + 
            booking.period.durationMonths
        )
    )}
    }));

    res.json({
      bookings: processedBookings,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Booking fetch error:', error);
    res.status(500).json({ 
      message: 'Failed to load bookings',
        error: error.message })
    };
  
};

// Generate invoice

exports.generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('student', 'firstName lastName email phone')
      .populate('pgOwner', 'messName address phoneNumber gstNumber');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${booking._id}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add invoice header
    doc.fontSize(20)
       .text('INVOICE', { align: 'center' })
       .moveDown(0.5);
    
    // Add invoice details
    doc.fontSize(12)
       .text(`Invoice #: INV-${booking._id.toString().slice(-8).toUpperCase()}`, { align: 'left' })
       .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' })
       .moveDown(1);

    // Add divider
    doc.moveTo(50, 150)
       .lineTo(550, 150)
       .stroke();

    // Add billing information
    doc.font('Helvetica-Bold')
       .text('Bill To:', 50, 170)
       .font('Helvetica')
       .text(`${booking.student.firstName} ${booking.student.lastName}`, 50, 190)
       .text(booking.student.email, 50, 210)
       .text(booking.student.phone || 'N/A', 50, 230)
       .moveDown(1);

    // Add PG information
    doc.font('Helvetica-Bold')
       .text('PG Details:', 300, 170)
       .font('Helvetica')
       .text(booking.pgOwner.messName, 300, 190)
       .text(booking.pgOwner.address, 300, 210)
       .text(`Phone: ${booking.pgOwner.phoneNumber}`, 300, 230)
       .text(`GST: ${booking.pgOwner.gstNumber || 'N/A'}`, 300, 250)
       .moveDown(2);

    // Add booking details table
    doc.font('Helvetica-Bold')
       .text('Booking Details', { underline: true })
       .moveDown(0.5);

    const tableTop = 320;
    const itemCodeX = 50;
    const descriptionX = 150;
    const amountX = 450;

    // Table header
    doc.font('Helvetica-Bold')
       .text('Item', itemCodeX, tableTop)
       .text('Description', descriptionX, tableTop)
       .text('Amount', amountX, tableTop)
       .moveDown(0.5);

    // Table row
    doc.font('Helvetica')
       .text('1', itemCodeX, tableTop + 30)
       .text(`Room ${booking.room} (${booking.bedsBooked} bed(s))`, descriptionX, tableTop + 30)
       .text(`₹${booking.payment.totalAmount}`, amountX, tableTop + 30)
       .moveDown(1);

    // Add stay period
    const endDate = new Date(booking.period.startDate);
    endDate.setMonth(endDate.getMonth() + booking.period.durationMonths);
    
    doc.text(`Stay Period: ${booking.period.startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`)
       .moveDown(1);

    // Add payment status
    doc.font('Helvetica-Bold')
       .text(`Payment Status: ${booking.payment.status.toUpperCase()}`, { align: 'right' })
       .moveDown(2);

    // Add thank you message
    doc.font('Helvetica-Oblique')
       .text('Thank you for your booking!', { align: 'center' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Handle booking approval/rejection (BED DEDUCTION ONLY ON CONFIRMATION)
exports.handleBookingApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    console.log(id, status, rejectionReason);
    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
        allowedStatuses: ["confirmed", "rejected"],
      });
    }

    if (status === "rejected" && !rejectionReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required when rejecting a booking",
      });
    }

    const booking = await Booking.findById(id).populate("student pgOwner");
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be updated from ${booking.status} status`,
      });
    }

    // Handle bed deduction only for confirmation
    if (status === "confirmed") {
      const owner = await PgOwner.findById(booking.pgOwner._id);
      const room = owner.roomInfo.find((r) => r.room === booking.room);

      if (!room) {
        return res.status(400).json({
          success: false,
          message: "Room no longer exists",
        });
      }

      // Check current availability
      const currentAvailableBeds = bedCountToNumber[room.bedContains] || 0;

      if (currentAvailableBeds < booking.bedsBooked) {
        return res.status(400).json({
          success: false,
          message: `Not enough beds available (Requested: ${booking.bedsBooked}, Available: ${currentAvailableBeds})`,
        });
      }

      // Deduct beds
      const updatedBeds = currentAvailableBeds - booking.bedsBooked;
      room.bedContains = numberToBedCount[updatedBeds] || "one";
      room.roomAvailable = updatedBeds > 0;
      await owner.save();
    }

    // Update booking status
    booking.status = status;
    if (status === "rejected") {
      booking.rejectionReason = rejectionReason;
    }
    await booking.save();

    // Send notifications
    const notificationMessage =
      status === "confirmed"
        ? `Your booking for ${booking.pgOwner.messName} (Room: ${booking.room}) has been confirmed!`
        : `Your booking request for ${booking.pgOwner.messName} was rejected. Reason: ${rejectionReason}`;

    await sendNotification(
      booking.student._id,
      "User",
      `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      notificationMessage,
      NOTIFICATION_TYPES.BOOKING,
      booking._id
    );

    // Socket notifications
     const bookingData = booking.toObject();

    // SocketManager.notifyStudentBookingStatus(booking.student._id, {
    //   _id: booking._id,
    //   status,
    //   message: notificationMessage,
    //   ...(status === 'rejected' && { rejectionReason })
    // });

    // if (status === 'confirmed') {
    //   SocketManager.notifyOwnerBookingUpdate(booking.pgOwner._id, bookingData);
    // }

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: bookingData,
    });
  } catch (error) {
    console.error("Booking approval error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Cancel booking (BED RESTORATION ONLY FOR CONFIRMED BOOKINGS)
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(id).populate("student pgOwner");
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled in ${booking.status} status`,
      });
    }

    // Restore beds only if booking was confirmed
    if (booking.status === "confirmed") {
      const owner = await PgOwner.findById(booking.pgOwner._id);
      const room = owner.roomInfo.find((r) => r.room === booking.room);

      if (room) {
        const currentBeds = bedCountToNumber[room.bedContains] || 0;
        const newBeds = currentBeds + booking.bedsBooked;
        room.bedContains = numberToBedCount[newBeds] || "one";
        room.roomAvailable = newBeds > 0;
        await owner.save();
      }
    }

    // Update booking status
    booking.status = "cancelled";
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();

    if (booking.payment.status === "paid") {
      booking.payment.status = "refund_pending";
    }

    await booking.save();

    // Send notifications
    const notificationMessage = cancellationReason
      ? `Your booking has been cancelled. Reason: ${cancellationReason}`
      : "Your booking has been cancelled";

    await Promise.all([
      sendNotification(
        booking.student._id,
        "User",
        "Booking Cancelled",
        notificationMessage,
        NOTIFICATION_TYPES.BOOKING,
        booking._id
      ),
      sendNotification(
        booking.pgOwner._id,
        "Pgowner",
        "Booking Cancelled",
        `Booking for ${booking.room} has been cancelled`,
        NOTIFICATION_TYPES.BOOKING,
        booking._id
      ),
    ]);

    // Socket notifications
    const cancellationPayload = {
      _id: booking._id,
      message: notificationMessage,
      cancellationReason,
      status: "cancelled",
    };

    // SocketManager.notifyStudentBookingStatus(booking.student._id, cancellationPayload);
    // SocketManager.notifyOwnerBookingUpdate(booking.pgOwner._id, {
    //   ...cancellationPayload,
    //   room: booking.room,
    //   studentId: booking.student._id
    // });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: booking.toObject(),
    });
  } catch (error) {
    console.error("Booking cancellation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
