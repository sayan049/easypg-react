const nodemailer = require("nodemailer");
require("dotenv").config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

async function sendMailCancelUser(
  email,
  pg_name,
  booking_id,
  room_number,
  cancellation_date,
  cancellation_reason,
  rebook_link,
  contact_us,
  privacy_policy,
  terms_of_service,
  cancellation_policy,
  faq_link
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
          Your Booking at ${pg_name} is Cancelled
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
            <div style="color: #dc2626; font-size: 14px">Cancelled Reason</div>
            <div style="color: #7f1d1d; font-size: 16px; font-weight: 600">
              ${cancellation_reason}
            </div>
          </div>
        </div>

        <!-- Refund Details
            <div style="background:#fffbeb;border-radius:12px;padding:16px;margin:24px 0;border:1px solid #fde68a;">
                <div style="color:#d97706;font-size:14px;margin-bottom:8px;">Refund Status</div>
                <div style="color:#92400e;font-size:16px;font-weight:600;">₹${refund_amount} will be refunded within 5-7 working days</div>
            </div> -->

        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0">
          <a
            href="${rebook_link}"
            style="
              display: block;
              background: #2563eb;
              color: #ffffff;
              text-decoration: none;
              padding: 14px 20px;
              border-radius: 8px;
              font-weight: 600;
              max-width: 280px;
              margin: 0 auto;
              font-size: 14px;
            "
          >
            Re-book Now
          </a>
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
            style="
              color: #2563eb;
              text-decoration: none;
              display: block;
              margin: 8px 0;
            "
            >Contact Support</a
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
            style="
              color: #2563eb;
              text-decoration: none;
              display: block;
              margin: 8px 0;
            "
            >Cancellation Policy</a>
             
             <a
            href="${faq_link}"
            style="
              color: #2563eb;
              text-decoration: none;
              display: block;
              margin: 8px 0;
            "
            >FAQs</a>
          
        </div>
        <div>Messmate © ${currentYear}</div>
      </div>
    </div>
  </body>
</html>


`;
  const emailText = `Subject: Booking Cancelled – ${pg_name}

Your Booking at ${pg_name} is Cancelled

📌 Booking ID: #${booking_id}
🛏️ Room Number: ${room_number}
❌ Cancelled On: ${cancellation_date}
Cancellation Reason: ${cancellation_reason}

If you'd like to book again, click the link below:
🔗 Re-book Now: ${rebook_link}

Need Help?
Contact Support: ${contact_us}
Privacy Policy: ${privacy_policy}
Terms of Service: ${terms_of_service}
FAQs: ${faq_link}

Messmate © ${currentYear}`;
  const mailOptions = {
    from: USER_EMAIL,
    to: email,
    subject: "Booking Cancelled – Messmate",
    // html: '<h3>Hi, ' + name + ' Click <a href="https://easypg-react-client.onrender.com/MailVerify?id=' + userId + '">here</a> to verify you email </h3>'
    //    html: `<h3>Hi, ${name}. Click <a href="${frontendUrl}/MailVerify?id=${userId}&email=${encodeURIComponent(email)}">here</a> to verify your email.</h3>`
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

module.exports = sendMailCancelUser;
