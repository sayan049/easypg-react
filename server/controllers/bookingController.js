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
const MaintenanceRequest = require("../modules/MaintenanceRequest");
const rateLimiters = new Map(); // In-memory rate limiter per studentId
const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute
const {
  sendNotification,
  NOTIFICATION_TYPES,
} = require("../services/notificationService");
// const SocketManager = require("../sockets/bookingSocket");
const { Types } = require("mongoose");
const PDFDocument = require("pdfkit");
const fs = require("fs");

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
  console.log("studentId", req.user.id);
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
        .populate("pgOwner", "messName")
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
// const mongoose = require('mongoose');
// const Booking = require('../models/Booking');

exports.getUserBookings = async (req, res) => {
  console.log("Authenticated User:", req.user);
  try {
    const userId = req.user.id;
    const now = new Date();

    // Find all bookings for this user
    const bookings = await Booking.find({ student: userId })
      .select(
        "room status bedsBooked pricePerHead period payment.totalAmount pgOwner"
      )
      .populate({
        path: "pgOwner",
        select:
          "firstName lastName email mobileNo messName address gender facility roomInfo profilePhoto",
      })
      .populate({
        path: "student", // Populate student field
        select: "email ", // Only select email and id
      })
      .sort({ "period.startDate": 1 }) // Important: Sort by startDate ascending
      .lean();

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        success: true,
        bookings: [],
        stats: {
          upcoming: 0,
          current: 0,
          past: 0,
          total: 0,
        },
        currentStays: [],
        upcomingStays: [],
        pastStays: [],
      });
    }

    const processedBookings = bookings.map((booking) => {
      const startDate = new Date(booking.period.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + booking.period.durationMonths);

      let bookingType = "none"; // default is none now

      if (booking.status === "confirmed") {
        if (now >= startDate && now <= endDate) {
          bookingType = "current";
        } else if (startDate > now) {
          bookingType = "upcoming";
        } else if (endDate < now) {
          bookingType = "past";
        }
      }

      return {
        ...booking,
        period: {
          startDate: booking.period.startDate,
          durationMonths: booking.period.durationMonths,
          endDate,
        },
        bookingType,
      };
    });

    // Get all stays of each type
    const currentStays = processedBookings.filter(
      (b) => b.bookingType === "current"
    );
    const upcomingStays = processedBookings.filter(
      (b) => b.bookingType === "upcoming"
    );
    const pastStays = processedBookings.filter((b) => b.bookingType === "past");

    // Calculate days remaining for current stays (taking the earliest ending one)
    let daysRemaining = 0;
    if (currentStays.length > 0) {
      // Find the current stay that ends soonest
      const soonestEndingStay = currentStays.reduce((prev, current) =>
        new Date(prev.period.endDate) < new Date(current.period.endDate)
          ? prev
          : current
      );
      const endDate = new Date(soonestEndingStay.period.endDate);
      const diffTime = Math.max(endDate - now, 0); // Make sure no negative
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // milliseconds -> days
    }

    // Calculate total amount of confirmed bookings
    const totalAmountConfirmed = processedBookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + (b.payment?.totalAmount || 0), 0);

    // Calculate stats
    const stats = {
      upcoming: upcomingStays.length,
      current: currentStays.length,
      past: pastStays.length,
      total: processedBookings.length,
    };

    res.json({
      success: true,
      currentStays,
      upcomingStays,
      pastStays,
      daysRemaining,
      totalAmountConfirmed,
      bookings: processedBookings,
      stats,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Generate invoice

exports.downloadInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .select(
        "room bedsBooked pricePerHead period.startDate period.durationMonths payment.totalAmount pgOwner student"
      )
      .populate("pgOwner", "messName address")
      .populate("student", "firstName lastName email")
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Calculate end date
    const endDate = new Date(booking.period.startDate);
    endDate.setMonth(endDate.getMonth() + booking.period.durationMonths);

    // Generate PDF invoice (example using pdfkit)
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${booking._id}.pdf`
    );

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add invoice content
    doc.fontSize(20).text("Booking Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Booking ID: ${booking._id}`);
    doc.moveDown();
    doc.text(`PG Name: ${booking.pgOwner.messName}`);
    doc.text(`Address: ${booking.pgOwner.address}`);
    doc.moveDown();
    doc.text(
      `Student: ${booking.student.firstName} ${booking.student.lastName}`
    );
    doc.text(`Email: ${booking.student.email}`);
    doc.moveDown();
    doc.text(`Room: ${booking.room}`);
    doc.text(`Beds Booked: ${booking.bedsBooked}`);
    doc.moveDown();
    doc.text(
      `Period: ${new Date(
        booking.period.startDate
      ).toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    );
    doc.moveDown();
    doc.text(`Amount: ₹${booking.payment.totalAmount}`);
    doc.moveDown();
    doc.text(`Payment Status: Paid`);
    doc.moveDown();
    doc.text("Thank you for your booking!");

    doc.end();
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({
      message: "Failed to generate invoice",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
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
//maintenance request from user
exports.maintenanceRequestHandler = async (req, res) => {
  const userId=req.user.id;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { studentId, bookingId, pgOwnerId, title, description } = req.body;
  if(userId !== req.body.studentId){
    return res.status(403).json({ message: "Unauthorized" }); }

  // Validation
  if (!studentId || !bookingId || !pgOwnerId || !title || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Rate limiting per student
    const lastRequestTime = rateLimiters.get(studentId);
    const now = Date.now();

    if (lastRequestTime && now - lastRequestTime < RATE_LIMIT_DURATION) {
      const secondsLeft = Math.ceil(
        (RATE_LIMIT_DURATION - (now - lastRequestTime)) / 1000
      );
      return res
        .status(429)
        .json({
          message: `Please wait ${secondsLeft}s before submitting again.`,
        });
    }

    // Update rate limiter
    rateLimiters.set(studentId, now);

    // Create maintenance request
    const maintenanceRequest = new MaintenanceRequest({
      student: studentId,
      booking: bookingId,
      pgOwner: pgOwnerId,
      title,
      description,
    });

    await maintenanceRequest.save();

    return res
      .status(201)
      .json({ message: "Maintenance request submitted successfully." });
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again later." });
  }
};
//maintenance request for owner
// controllers/maintenanceController.js
// const MaintenanceRequest = require('../models/MaintenanceRequest');

// const MaintenanceRequest = require('../models/MaintenanceRequest');

exports.getRequestsByBookings = async (req, res) => {
  try {
    const { bookingIds } = req.query;
    
    if (!bookingIds) {
      return res.status(400).json({
        success: false,
        message: 'Booking IDs are required'
      });
    }

    const idsArray = bookingIds.split(',');

    const requests = await MaintenanceRequest.find({
      booking: { $in: idsArray }
    })
    .populate({
      path: 'student',
      select: 'firstName lastName email',
      
    })
    .populate("booking", "_id ")
    .sort({ createdAt: -1 }) // Newest first
    .lean(); // Better performance

    // Format the response with only the required fields
    const formattedRequests = requests.map(request => ({
      title: request.title,
      description: request.description,
      status: request.status,
      student: {
        name: request.student ? 
              `${request.student.firstName} ${request.student.lastName}` : 
              'Unknown Student',
        email: request.student?.email || ''
      },
      booking: request.booking?._id || null, // <-- only _id here, not object
      createdAt: request.createdAt // Optional: include if you need timestamps
    }));

    res.status(200).json({
      success: true,
      count: formattedRequests.length,
      requests: formattedRequests
    });

  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching maintenance requests',
      error: error.message
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
