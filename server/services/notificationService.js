// const nodemailer = require("nodemailer");
// const mongoose = require("mongoose"); // Add this line
// const Notification = require("../modules/Notification");
// const bookingRequestUserTemplate = require("../utils/emailTemplates/bookingRequestUser");
// const bookingRequestOwnerTemplate = require("../utils/emailTemplates/bookingRequestOwner");
// require("dotenv").config();

// // Email configuration
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE || "gmail",
//   auth: {
//     user: process.env.USER_EMAIL,
//     pass: process.env.USER_PASSWORD,
//   },
//   pool: true, // Use connection pooling
//   maxConnections: 5,
//   maxMessages: 100
// });

// // Notification types
// const NOTIFICATION_TYPES = {
//   BOOKING: 'booking',
//   PAYMENT: 'payment',
//   SYSTEM: 'system',
//   OTHER: 'other'
// };

// /**
//  * Send notification to user/owner (saves to DB and sends email)
//  * @param {string} recipientId - ID of the recipient
//  * @param {string} recipientType - 'User' or 'Pgowner'
//  * @param {string} title - Notification title
//  * @param {string} message - Notification content
//  * @param {string} type - Notification type (booking/payment/system/other)
//  * @param {string} relatedId - Related booking/payment ID
//  * @returns {Promise<{dbNotification: object, emailSent: boolean}>}
//  */
// exports.sendNotification = async (recipientId, recipientType, title, message, type = NOTIFICATION_TYPES.BOOKING, relatedId = null) => {
//   try {
//     // 1. Save to database first
//     const dbNotification = new Notification({
//       recipient: recipientId,
//       recipientModel: recipientType,
//       title,
//       message,
//       type,
//       relatedId
//     });
//     await dbNotification.save();

//     // 2. Send email (if recipient email exists)
//     let emailSent = false;
//     if (recipientId) { // Only try to find recipient if ID is provided
//       const recipient = await mongoose.model(recipientType).findById(recipientId).select('email');
      
//       if (recipient?.email) {
//         const mailOptions = {
//           from: `PG Booking System <${process.env.USER_EMAIL}>`,
//           to: recipient.email,
//           subject: title,
//           html: generateEmailTemplate(title, message, type),
//           text: message // Fallback text version
//         };

//         await transporter.sendMail(mailOptions);
//         emailSent = true;
//       }
//     }

//     return { dbNotification, emailSent };
//   } catch (error) {
//     console.error('Notification error:', error);
//     throw error; // Let the caller handle the error
//   }
// };

// /**
//  * Generate HTML email template
//  */
// function generateEmailTemplate(title, message, type) {
//   const colors = {
//     booking: '#2CA4B5',
//     payment: '#4CAF50',
//     system: '#607D8B',
//     other: '#9C27B0'
//   };

//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <div style="background-color: ${colors[type] || '#2CA4B5'}; padding: 20px; color: white;">
//         <h1 style="margin: 0;">${title}</h1>
//       </div>
//       <div style="padding: 20px; background-color: #f9f9f9;">
//         <p>${message}</p>
//         <p style="color: #666; font-size: 0.9em;">
//           This is an automated message. Please do not reply directly to this email.
//         </p>
//       </div>
//       <div style="background-color: #eee; padding: 10px 20px; text-align: center; font-size: 0.8em;">
//         © ${new Date().getFullYear()} PG Booking System
//       </div>
//     </div>
//   `;
// }

// /**
//  * Simple email-only notification (legacy support)
//  */
// exports.sendNotificationEmail = async (email, subject, message) => {
//   try {
//     const mailOptions = {
//       from: `PG Booking System <${process.env.USER_EMAIL}>`,
//       to: email,
//       subject: subject,
//       html: generateEmailTemplate(subject, message, NOTIFICATION_TYPES.SYSTEM),
//       text: message
//     };

//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error('Legacy email notification error:', error);
//     return false;
//   }
// };

// module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Notification = require("../modules/Notification");
const bookingRequestUserTemplate = require("../utils/emailTemplates/bookingRequestUser");
const bookingRequestOwnerTemplate = require("../utils/emailTemplates/bookingRequestOwner");
const confirmedBookingUserTemplate = require("../utils/emailTemplates/confirmedbookingUser");
const rejectedBookingUser = require("../utils/emailTemplates/rejectedBookingUser");
require("dotenv").config();

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

// Notification types
const NOTIFICATION_TYPES = {
  BOOKING: "booking",
  PAYMENT: "payment",
  SYSTEM: "system",
  OTHER: "other",
};

/**
 * Send notification to user/owner (saves to DB and sends email)
 * @param {string} recipientId - ID of the recipient
 * @param {string} recipientType - 'User' or 'Pgowner'
 * @param {string} title - Notification title
 * @param {string} message - Notification content
 * @param {string} type - Notification type (booking/payment/system/other)
 * @param {string} relatedId - Related booking/payment ID
 * @param {object} templateData - Optional extra data to populate HTML email
 * @returns {Promise<{dbNotification: object, emailSent: boolean}>}
 */
exports.sendNotification = async (
  recipientId,
  recipientType,
  title,
  message,
  type = NOTIFICATION_TYPES.BOOKING,
  relatedId = null,
  templateData = {}
) => {
  try {
    // 1. Save to database first
    const dbNotification = new Notification({
      recipient: recipientId,
      recipientModel: recipientType,
      title,
      message,
      type,
      relatedId,
    });
    await dbNotification.save();

    // 2. Send email (if recipient email exists)
    let emailSent = false;
    if (recipientId) {
      const recipient = await mongoose
        .model(recipientType)
        .findById(recipientId)
        .select("email");

      if (recipient?.email) {
        const htmlTemplate =
          type === NOTIFICATION_TYPES.BOOKING
            ? generateBookingEmailTemplate(recipientType, templateData)
            : generateEmailTemplate(title, message, type);

        const mailOptions = {
          from: `PG Booking System <${process.env.USER_EMAIL}>`,
          to: recipient.email,
          subject: title,
          html: htmlTemplate,
          text: message,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
      }
    }

    return { dbNotification, emailSent };
  } catch (error) {
    console.error("Notification error:", error);
    throw error;
  }
};

/**
 * Generate booking email HTML based on user type
 */
function generateBookingEmailTemplate(recipientType, data) {
  if (recipientType === "User") {
    if (data.status === "confirmed") {
      return confirmedBookingUserTemplate(data);
    } else if (data.status === "rejected") {
      return rejectedBookingUser(data);
    }
    return bookingRequestUserTemplate(data); 
  } else if (recipientType === "PgOwner") {
    return bookingRequestOwnerTemplate(data);
  }
  return generateEmailTemplate("Booking Notification", "A new booking update occurred.", NOTIFICATION_TYPES.BOOKING);
}


/**
 * Default simple email template
 */
function generateEmailTemplate(title, message, type) {
  const colors = {
    booking: "#2CA4B5",
    payment: "#4CAF50",
    system: "#607D8B",
    other: "#9C27B0",
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: ${colors[type] || "#2CA4B5"}; padding: 20px; color: white;">
        <h1 style="margin: 0;">${title}</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>${message}</p>
        <p style="color: #666; font-size: 0.9em;">
          This is an automated message. Please do not reply directly to this email.
        </p>
      </div>
      <div style="background-color: #eee; padding: 10px 20px; text-align: center; font-size: 0.8em;">
        © ${new Date().getFullYear()} PG Booking System
      </div>
    </div>
  `;
}

/**
 * Simple email-only notification (legacy support)
 */
exports.sendNotificationEmail = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: `PG Booking System <${process.env.USER_EMAIL}>`,
      to: email,
      subject: subject,
      html: generateEmailTemplate(subject, message, NOTIFICATION_TYPES.SYSTEM),
      text: message,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Legacy email notification error:", error);
    return false;
  }
};

module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
