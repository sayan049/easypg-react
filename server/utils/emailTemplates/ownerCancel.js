const nodemailer = require("nodemailer");
require("dotenv").config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

async function sendMailCancelOwner(
  email,
  user_name,
  booking_id,
  room_number,
  cancellation_date,
  cancellation_reason,
  
  user_phone,
  user_email,
  contact_us,
  privacy_policy,
  terms_of_service,
  cancellation_policy
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: USER_PASSWORD,
    },
  });
  /* The `mailOptions` object is being used to define the details of the email that will be sent. Here's
   a breakdown of its properties: */
  const currentYear = new Date().getFullYear();
  const emailHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Cancelled</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Montserrat', Arial, sans-serif;
      background: #f8fafc;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        width: 100%;
        box-sizing: border-box;
      "
    >
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px">
        <img
          src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png"
          alt="MessMate"
          style="width: 40px; max-width: 100%; padding: 4px; height: auto"
        />
      </div>

      <!-- Main Card -->
      <div
        style="
          background: #ffffff;
          border-radius: 16px;
          padding: 25px;
          border: 2px solid #dc2626;
          margin: 0 auto;
        "
      >
        <!-- Status Badge -->
        <div style="text-align: center; margin-bottom: 24px">
          <div
            style="
              background: #fee2e2;
              color: #dc2626;
              padding: 8px 24px;
              border-radius: 24px;
              display: inline-block;
              font-size: 14px;
              font-weight: 600;
              max-width: 280px;
            "
          >
            BOOKING CANCELLED
          </div>
        </div>

        <h1
          style="
            font-size: 24px;
            color: #7f1d1d;
            text-align: center;
            margin: 0 0 24px 0;
            line-height: 1.3;
          "
        >
          ${user_name} Cancelled Booking
        </h1>

        <!-- Details Grid -->
        <div
          style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 32px"
        >
          <div
            style="
              background: #fef2f2;
              border-radius: 12px;
              padding: 16px;
              border: 1px solid #fecaca;
              flex: 1;
              min-width: 200px;
            "
          >
            <div style="color: #dc2626; font-size: 14px">Booking ID</div>
            <div style="color: #7f1d1d; font-size: 16px; font-weight: 600">
              #${booking_id}
            </div>
          </div>
          <div
            style="
              background: #fef2f2;
              border-radius: 12px;
              padding: 16px;
              border: 1px solid #fecaca;
              flex: 1;
              min-width: 200px;
            "
          >
            <div style="color: #dc2626; font-size: 14px">Room Number</div>
            <div style="color: #7f1d1d; font-size: 16px; font-weight: 600">
              ${room_number}
            </div>
          </div>
          <div
            style="
              background: #fef2f2;
              border-radius: 12px;
              padding: 16px;
              border: 1px solid #fecaca;
              flex: 1;
              min-width: 200px;
            "
          >
            <div style="color: #dc2626; font-size: 14px">Cancelled On</div>
            <div style="color: #7f1d1d; font-size: 16px; font-weight: 600">
              ${cancellation_date}
            </div>
          </div>
           <div
            style="
              background: #fef2f2;
              border-radius: 12px;
              padding: 16px;
              border: 1px solid #fecaca;
              flex: 1;
              min-width: 200px;
            "
          >
            <div style="color: #dc2626; font-size: 14px">Cancellation Reason</div>
            <div style="color: #7f1d1d; font-size: 16px; font-weight: 600">
              ${cancellation_reason}
            </div>
          </div>
        </div>

        <!-- User Details -->
        <div
          style="
            background: #f0f9ff;
            border-radius: 12px;
            padding: 16px;
            margin: 24px 0;
            border: 1px solid #7dd3fc;
          "
        >
          <div style="color: #0c4a6e; font-weight: 600; margin-bottom: 8px">
            User Details:
          </div>
          <div style="color: #0284c7">👤 ${user_name}</div>
          <div style="color: #0284c7">📞 ${user_phone}</div>
          <div style="color: #0284c7">📧 ${user_email}</div>
        </div>


      </div>

      <!-- Footer -->
      <div
        style="
          text-align: center;
          padding: 32px 0;
          color: #64748b;
          font-size: 14px;
        "
      >
        <div style="margin-bottom: 16px">
          <a
            href="${contact_us}"
            style="color: #2563eb; text-decoration: none; margin: 0 12px"
            >Contact Us</a
          >
          <a
            href="${privacy_policy}"
            style="color: #2563eb; text-decoration: none; margin: 0 12px"
            >Privacy</a
          >
          <a
            href="${terms_of_service}"
            style="color: #2563eb; text-decoration: none; margin: 0 12px"
            >Terms</a
          >
          <a
            href="${cancellation_policy}"
            style="color: #2563eb; text-decoration: none; margin: 0 12px"
            >Cancellation</a
          >
        </div>
        <div>MessMate © ${currentYear}</div>
        <div style="margin-top: 12px; font-size: 12px; color: #94a3b8">
          Update your availability in the PG Owner Dashboard
        </div>
      </div>
    </div>
  </body>
</html>

`;
  const emailText = `Subject: Booking Cancelled by ${user_name}

📢 Booking Cancelled

${user_name} has cancelled their booking.

🔖 Booking ID: #${booking_id}
🛏️ Room Number: ${room_number}
📅 Cancelled On: ${cancellation_date}
cancellation_reason: ${cancellation_reason}

👤 User Details
Name: ${user_name}
Phone: ${user_phone}
Email: ${user_email}

🔗 Quick Links:

Contact Us: ${contact_us}

Privacy Policy: ${privacy_policy}

Terms of Service: ${terms_of_service}

Cancellation Policy: ${cancellation_policy}

© ${currentYear} MessMate
💡 Update your availability in the PG Owner Dashboard`;
  const mailOptions = {
    from: USER_EMAIL,
    to: email,
    subject: "Booking Cancelled – Messmate",

    html: emailHtml,
    text: emailText,
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("email has ben sent succesfully");
  } catch (error) {
    console.log("Error: ", error);
  }
}

module.exports = sendMailCancelOwner;
