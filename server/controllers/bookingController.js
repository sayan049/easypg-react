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
const User = require("../modules/user");
const moment = require("moment");
const mongoose = require("mongoose");
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

    // Start 2-minute expiration timer
// if i run cron here?

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

    // Emit socket event to owner's room
    const io = req.app.get("socketio"); // Get socket instance from app.js/server.js
    io.to(pgOwner.toString()).emit("new-booking-request", {
      booking: bookingPayload,
    });

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
    console.log("Authenticated User:", req.user);

    const ownerId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const statuses = ["pending", "confirmed", "rejected"];

    const queries = statuses.map((status) => {
      return Booking.find({ pgOwner: ownerId, status })
        .populate("student", "firstName lastName email")
        .populate("pgOwner", "messName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .hint("owner_management_index");
    });

    const countQueries = statuses.map((status) =>
      Booking.countDocuments({ pgOwner: ownerId, status })
    );

    const [results, counts] = await Promise.all([
      Promise.all(queries),
      Promise.all(countQueries),
    ]);

    const response = {};
    statuses.forEach((status, i) => {
      const bookingsWithEndDate = results[i].map((booking) => {
        const startDate = booking?.period?.startDate;
        const duration = booking?.period?.durationMonths;

        let endDate = null;
        if (startDate && typeof duration === "number") {
          endDate = new Date(
            new Date(startDate).setMonth(
              new Date(startDate).getMonth() + duration
            )
          );
        }

        return {
          ...booking,
          period: {
            ...booking.period,
            endDate,
          },
        };
      });

      response[status] = {
        bookings: bookingsWithEndDate,
        pagination: {
          total: counts[i],
          page,
          pages: Math.ceil(counts[i] / limit),
          limit,
        },
      };
    });

    const totalCount = counts.reduce((acc, cur) => acc + cur, 0);
    res.json({
      success: true,
      data: response,
      summary: {
        total: totalCount,
        pending: counts[0],
        confirmed: counts[1],
        rejected: counts[2],
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.getAllOwnerBookings = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user);

    const ownerId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 10;

    const statuses = ["pending", "confirmed", "rejected"];

    const queries = statuses.map(
      (status) =>
        Booking.find({ pgOwner: ownerId, status })
          .populate("student", "firstName lastName email")
          .populate("pgOwner", "messName")
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean()
      // .hint("owner_management_index")
    );

    const countQueries = statuses.map((status) =>
      Booking.countDocuments({ pgOwner: ownerId, status })
    );

    const [results, counts] = await Promise.all([
      Promise.all(queries),
      Promise.all(countQueries),
    ]);

    const response = {};
    statuses.forEach((status, i) => {
      const bookingsWithEndDate = results[i].map((booking) => {
        const startDate = booking?.period?.startDate;
        const duration = booking?.period?.durationMonths;

        let endDate = null;
        if (startDate && typeof duration === "number") {
          endDate = new Date(
            new Date(startDate).setMonth(
              new Date(startDate).getMonth() + duration
            )
          );
        }

        return {
          ...booking,
          period: {
            ...booking.period,
            endDate,
          },
        };
      });

      response[status] = {
        bookings: bookingsWithEndDate,
        total: counts[i],
      };
    });

    res.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Error in getAllOwnerBookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
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
        "room status bedsBooked pricePerHead period payment.totalAmount pgOwner userCancellationReason ownerRejectionReason"
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
      } else if (booking.status === "pending") {
        bookingType = "pending";
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
    const pendingStays = processedBookings.filter(
      (b) => b.bookingType === "pending"
    );

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
      pending: pendingStays.length,
      total: processedBookings.length,
    };

    res.json({
      success: true,
      currentStays,
      upcomingStays,
      pastStays,
      pendingStays,
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
      booking.ownerRejectionReason = rejectionReason;
    }
    await booking.save();

    const bookingPayload = {
      _id: booking._id,
      status: booking.status,
      ownerRejectionReason: booking.ownerRejectionReason,
    };
    const io = req.app.get("socketio"); // Get socket instance from app.js/server.js
    io.to(booking.student._id.toString()).emit("update-booking-status", {
      booking: bookingPayload,
    });

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
  const userId = req.user.id;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { studentId, bookingId, pgOwnerId, title, description } = req.body;
  if (userId !== req.body.studentId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

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
      return res.status(429).json({
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

exports.getRequestsByBookings = async (req, res) => {
  try {
    const { bookingIds } = req.query;

    if (!bookingIds) {
      return res.status(400).json({
        success: false,
        message: "Booking IDs are required",
      });
    }

    const idsArray = bookingIds.split(",");

    const requests = await MaintenanceRequest.find({
      booking: { $in: idsArray },
    })
      .populate({
        path: "student",
        select: "firstName lastName email",
      })
      .populate("booking", "_id ")
      .sort({ createdAt: -1 }) // Newest first
      .lean(); // Better performance

    // Format the response with only the required fields
    const formattedRequests = requests.map((request) => ({
      _id: request._id,
      title: request.title,
      description: request.description,
      status: request.status,
      student: {
        name: request.student
          ? `${request.student.firstName} ${request.student.lastName}`
          : "Unknown Student",
        email: request.student?.email || "",
      },
      booking: request.booking?._id || null, // <-- only _id here, not object
      createdAt: request.createdAt, // Optional: include if you need timestamps
    }));

    res.status(200).json({
      success: true,
      count: formattedRequests.length,
      requests: formattedRequests,
    });
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching maintenance requests",
      error: error.message,
    });
  }
};

// Controller for updating the maintenance request status
exports.updateMaintenanceStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status, message } = req.body; // ⬅️ Now also expect a message field

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const allowedStatuses = ["resolved", "cancelled", "in-progress"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Find the maintenance request by ID
    const maintenanceRequest = await MaintenanceRequest.findById(requestId);
    if (!maintenanceRequest) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    // Update fields based on the status
    maintenanceRequest.status = status;

    if (status === "resolved") {
      maintenanceRequest.response = message || ""; // Save response
      maintenanceRequest.cancellationReason = ""; // Clear cancellation reason if any
    } else if (status === "cancelled") {
      maintenanceRequest.cancellationReason = message || ""; // Save cancellation reason
      maintenanceRequest.response = ""; // Clear response if any
    } else {
      // If status is "in-progress", clear both response and cancellationReason
      maintenanceRequest.response = "";
      maintenanceRequest.cancellationReason = "";
    }

    await maintenanceRequest.save();

    return res.status(200).json({
      message: `Maintenance request ${status}`,
      request: maintenanceRequest,
    });
  } catch (error) {
    console.error("Error updating maintenance request:", error);
    return res
      .status(500)
      .json({ message: "Failed to update maintenance request status" });
  }
};
//get maintenance history for users
exports.getMaintenanceHistory = async (req, res) => {
  try {
    const { userId, type } = req.query;
    console.log(userId, type);
    if (!userId || type !== "student") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request body." });
    }

    // Verify that userId from body matches the one from JWT
    if (req.user.id !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access." });
    }

    // Fetch maintenance requests made by the student
    const requests = await MaintenanceRequest.find({ student: userId })
      .select(
        "title description status response cancellationReason createdAt booking pgOwner"
      ) // only select what's needed
      .populate({
        path: "booking",
        select: "room", // only bring in the room from booking
      })
      .populate({
        path: "pgOwner",
        select: "firstName lastName email messName", // only bring required fields from owner
      });

    const formatted = requests.map((req) => ({
      title: req.title,
      description: req.description,
      status: req.status,
      response: req.response,
      cancellationReason: req.cancellationReason,
      createdAt: req.createdAt,
      roomNo: req.booking?.room || "N/A",
      ownerEmail: req.pgOwner?.email || "N/A",
      messName: req.pgOwner?.messName || "N/A",
      name: req.pgOwner
        ? `${req.pgOwner.firstName} ${req.pgOwner.lastName}`
        : "Unknown Owner",
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.error("Maintenance history fetch error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// Cancel booking (BED RESTORATION ONLY FOR CONFIRMED BOOKINGS)
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const cancellationReason = req.body.reason || null;
    console.log("Booking ID:", bookingId);
    console.log("User ID:", userId);
    console.log("Cancellation Reason:", cancellationReason);

    // 1. Fetch booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // 2. Validate ownership
    if (booking.student.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    //3.get fullname of user
    const userName = await User.findById(userId);
    if (!userName) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const fullname = `${userName.firstName} ${userName.lastName}`;

    const now = new Date();
    const startDate = new Date(booking.period.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + booking.period.durationMonths);

    // 3. Pending booking → cancel directly
    if (booking.status === "pending") {
      booking.status = "cancelled";
      booking.userCancellationReason = cancellationReason || "";
      await booking.save();

      // Notifications
      const msg = cancellationReason
        ? `You cancelled your booking for ${booking.room}.Reason: ${cancellationReason}`
        : `You cancelled your booking for ${booking.room}`;

      await Promise.all([
        sendNotification(
          booking.student,
          "User",
          "Booking Cancelled",
          msg,
          NOTIFICATION_TYPES.BOOKING,
          booking._id
        ),
        sendNotification(
          booking.pgOwner,
          "PgOwner",
          "Booking Cancelled",
          `Booking for ${booking.room} has been cancelled by ${fullname} for reason: ${cancellationReason}`,
          NOTIFICATION_TYPES.BOOKING,
          booking._id
        ),
      ]);

      return res.json({
        success: true,
        message: "Pending booking cancelled successfully.",
      });
    }

    // 4. Confirmed booking → check timing
    if (booking.status === "confirmed") {
      const hoursDiff = (startDate - now) / (1000 * 60 * 60);

      // Current stays can't be cancelled
      if (now >= startDate && now <= endDate) {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel a booking that has already started.",
        });
      }

      // Too late to cancel
      if (startDate > now && hoursDiff <= 24) {
        return res.status(400).json({
          success: false,
          message: "Can only cancel more than 24 hours before check-in.",
        });
      }

      // 5. Restore beds
      const owner = await PgOwner.findById(booking.pgOwner);
      if (!owner) {
        return res
          .status(404)
          .json({ success: false, message: "PG Owner not found" });
      }

      const room = owner.roomInfo.find((r) => r.room === booking.room);
      if (!room) {
        return res
          .status(400)
          .json({ success: false, message: "Room not found in owner's data" });
      }

      const currentBeds = bedCountToNumber[room.bedContains] || 0;
      const restoredBeds = currentBeds + booking.bedsBooked;
      if (restoredBeds > 5) {
        return res.status(400).json({
          success: false,
          message: "Restored beds exceed room capacity.",
        });
      }

      room.bedContains = numberToBedCount[restoredBeds];
      room.roomAvailable = true;
      await owner.save();

      // 6. Cancel and notify
      booking.status = "cancelled";
      booking.userCancellationReason = cancellationReason || "";
      await booking.save();

      const msg = cancellationReason
        ? `You cancelled your booking for ${booking.room}.Reason: ${cancellationReason}`
        : `You cancelled your booking for ${booking.room}`;

      await Promise.all([
        sendNotification(
          booking.student._id,
          "User",
          "Booking Cancelled",
          msg,
          NOTIFICATION_TYPES.BOOKING,
          booking._id
        ),
        sendNotification(
          booking.pgOwner._id,
          "PgOwner",
          "Booking Cancelled",
          `Booking for ${booking.room} has been cancelled by ${fullname}`,
          NOTIFICATION_TYPES.BOOKING,
          booking._id
        ),
      ]);

      return res.json({
        success: true,
        message: "Upcoming booking cancelled and beds restored.",
      });
    }

    // 7. Past bookings or invalid status
    return res
      .status(400)
      .json({ success: false, message: "This booking cannot be cancelled." });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while cancelling booking.",
      error: error.message,
    });
  }
};

//feedback for booking from user
exports.submitFeedback = async (req, res) => {
  const userId = req.user.id;
  const { stayId, rating, comment } = req.body;
  console.log("User ID for ratings :", userId);
  console.log(req.body);
  if (!stayId || !rating) {
    return res.status(400).json({ message: "stayId and rating are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const fullname = `${user.firstName} ${user.lastName}`;

    const stay = await Booking.findById(stayId);
    if (!stay) {
      return res.status(404).json({ message: "Stay not found" });
    }

    // Ensure the user is the student who booked this stay and it's confirmed
    if (stay.student.toString() !== userId || stay.status !== "confirmed") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const pgOwnerId = stay.pgOwner;
    const pgOwner = await PgOwner.findById(pgOwnerId);
    if (!pgOwner) {
      return res.status(404).json({ message: "PG Owner not found" });
    }

    pgOwner.feedbacks = pgOwner.feedbacks || [];
    pgOwner.feedbacks.push({
      stayId,
      username: fullname,
      rating,
      comment,
    });

    await pgOwner.save();

    return res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    return res
      .status(500)
      .json({ message: "Server error while submitting feedback" });
  }
};
//ownerdashboard data and stats and recent activity

exports.getOwnerDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Total Revenue from confirmed bookings
    const confirmedBookings = await Booking.find({
      pgOwner: ownerId,
      status: "confirmed",
    });
    const totalRevenue = confirmedBookings.reduce(
      (sum, b) => sum + (b.payment?.totalAmount || 0),
      0
    );

    // Room stats
    const ownerData = await PgOwner.findById(ownerId);
    const totalRooms = Array.isArray(ownerData.roomInfo)
      ? ownerData.roomInfo.length
      : 0;

    const roomsAvailable = Array.isArray(ownerData.roomInfo)
      ? ownerData.roomInfo.filter((room) => room.roomAvailable === true).length
      : 0;

    // Maintenance requests
    const maintenanceRequests = await MaintenanceRequest.find({
      pgOwner: ownerId,
    });
    const pending = maintenanceRequests.filter(
      (r) => r.status === "in-progress"
    ).length;
    const completed = maintenanceRequests.filter(
      (r) => r.status === "resolved"
    ).length;

    // Pending bookings count
    const pendingBookings = await Booking.countDocuments({
      pgOwner: ownerId,
      status: "pending",
    });

    // Recent activity (from bookings and maintenance)
    const recentActivity = [];

    const recentBookings = await Booking.find({ pgOwner: ownerId })
      .sort({ updatedAt: -1 })
      .limit(10);

    recentBookings.forEach((b) => {
      if (b.status === "pending") {
        recentActivity.push({
          type: "booking_request",
          title: "New Booking Request",
          description: `Room ${b.room} – ${b.bedsBooked} bed(s)`,
          time: b.updatedAt.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
          }),
        });
      } else if (b.status === "confirmed") {
        recentActivity.push({
          type: "booking_confirmed",
          title: "Booking Confirmed",
          description: `Room ${b.room} confirmed`,
          time: b.updatedAt.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
          }),
        });
      } else if (b.status === "rejected") {
        recentActivity.push({
          type: "booking_rejected",
          title: "Booking Rejected",
          description: `Room ${b.room} was rejected`,
          time: b.updatedAt.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
          }),
        });
      }
    });

    maintenanceRequests
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10)
      .forEach((req) => {
        let type = "maintenance_new";
        if (req.status === "resolved") type = "maintenance_resolved";
        else if (req.status === "cancelled") type = "maintenance_cancelled";

        recentActivity.push({
          type,
          title: `Maintenance ${
            req.status.charAt(0).toUpperCase() + req.status.slice(1)
          }`,
          description: req.message,
          time: req.updatedAt.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
          }),
        });
      });

    // Sort all activity by latest time
    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Final response
    res.status(200).json({
      stats: {
        totalRevenue,
        revenueChangePercent: 12, // Static for now
        roomsAvailable,
        totalRooms,
        serviceRequests: {
          total: maintenanceRequests.length,
          pending,
          completed,
        },
        pendingBookings,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
//chart data for owner dashboard

// Helper function to aggregate bookings by time frame
const aggregateBookingsByTimeFrame = (bookings, timeFrame) => {
  const groupedData = {};

  bookings.forEach((booking) => {
    // Get time frame boundaries and labels
    const date = moment(booking.createdAt);
    let label, startDate;

    switch (timeFrame) {
      case "weekly":
        startDate = date.startOf("week").format("YYYY-MM-DD");
        label = `Week ${date.format("WW")}, ${date.format("YYYY")}`;
        break;
      case "monthly":
        startDate = date.startOf("month").format("YYYY-MM-DD");
        label = date.format("MMM YYYY");
        break;
      case "yearly":
        startDate = date.startOf("year").format("YYYY-MM-DD");
        label = date.format("YYYY");
        break;
    }

    // Initialize group if not exists
    if (!groupedData[startDate]) {
      groupedData[startDate] = {
        label,
        startDate,
        pending: 0,
        confirmed: 0,
        rejected: 0,
        revenue: 0,
      };
    }

    // Update counts
    const group = groupedData[startDate];
    if (booking.status === "pending") group.pending++;
    if (booking.status === "confirmed") group.confirmed++;
    if (booking.status === "rejected") group.rejected++;

    // Add revenue for confirmed bookings
    if (booking.status === "confirmed") {
      group.revenue += booking.payment?.totalAmount || 0;
    }
  });

  // Convert to array and sort chronologically
  return Object.values(groupedData)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .map(({ startDate, ...rest }) => rest); // Remove startDate from final output
};

exports.getChartStats = async (req, res) => {
  try {
    const { timeFrame } = req.query;
    const ownerId = req.user.id;

    // Validation
    if (!["weekly", "monthly", "yearly"].includes(timeFrame)) {
      return res.status(400).json({ error: "Invalid time frame" });
    }

    // Calculate date range
    const now = moment();
    const startDate = now.clone().startOf(timeFrame.slice(0, -2));

    // Get bookings with populated student data
    const bookings = await Booking.find({
      pgOwner: ownerId,
      status: { $in: ["pending", "confirmed", "rejected"] },
      createdAt: { $gte: startDate.toDate() },
    }).populate("student", "_id name");

    // Process data
    const chartData = aggregateBookingsByTimeFrame(bookings, timeFrame);
    const uniqueStudents = new Set(
      bookings.map((b) => b.student._id.toString())
    );
    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

    // Final response structure
    res.json({
      [timeFrame]: {
        bookings: chartData,
        metrics: {
          totalBookings: bookings.length,
          totalStudents: uniqueStudents.size,
          totalRevenue,
          avgRevenuePerBooking: totalRevenue / (bookings.length || 1),
        },
        timeframe: {
          start: startDate.toISOString(),
          end: now.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Error in getChartStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
