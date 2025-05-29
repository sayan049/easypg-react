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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Booking Cancelled</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f8fafc;">
  <!--[if mso]>
  <style type="text/css">
  body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; padding:25px 25px;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <!--[if mso]>
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" align="center">
        <tr><td>
        <![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png" alt="MessMate" width="40" style="display:block;border:0;max-width:100%;height:auto;">
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:2px solid #dc2626;padding:25px;">
              <!-- Status Badge -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="background:#fee2e2;color:#dc2626;padding:8px 24px;border-radius:24px;display:inline-block;font-size:14px;font-weight:600;max-width:280px;">
                      BOOKING CANCELLED
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="color:#7f1d1d;font-size:24px;font-weight:bold;padding-bottom:24px;line-height:1.3;">
                    ${user_name} Cancelled Booking
                  </td>
                </tr>

                <!-- Details Grid -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding:8px;">
                          <div style="background:#fef2f2;border-radius:12px;border:1px solid #fecaca;padding:16px;">
                            <div style="color:#dc2626;font-size:14px;">Booking ID</div>
                            <div style="color:#7f1d1d;font-size:16px;font-weight:600;">#${booking_id}</div>
                          </div>
                        </td>
                        <td width="50%" style="padding:8px;">
                          <div style="background:#fef2f2;border-radius:12px;border:1px solid #fecaca;padding:16px;">
                            <div style="color:#dc2626;font-size:14px;">Room Number</div>
                            <div style="color:#7f1d1d;font-size:16px;font-weight:600;">${room_number}</div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding:8px;">
                          <div style="background:#fef2f2;border-radius:12px;border:1px solid #fecaca;padding:16px;">
                            <div style="color:#dc2626;font-size:14px;">Cancelled On</div>
                            <div style="color:#7f1d1d;font-size:16px;font-weight:600;">${cancellation_date}</div>
                          </div>
                        </td>
                        <td width="50%" style="padding:8px;">
                          <div style="background:#fef2f2;border-radius:12px;border:1px solid #fecaca;padding:16px;">
                            <div style="color:#dc2626;font-size:14px;">Cancellation Reason</div>
                            <div style="color:#7f1d1d;font-size:16px;font-weight:600;">${cancellation_reason}</div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- User Details -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border-radius:12px;border:1px solid #7dd3fc;padding:16px;margin:24px 0;">
                      <tr>
                        <td style="color:#0c4a6e;font-weight:600;padding-bottom:8px;">
                          User Details:
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#0284c7;padding:4px 0;">
                          👤 ${user_name}
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#0284c7;padding:4px 0;">
                          📞 ${user_phone}
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#0284c7;padding:4px 0;">
                          📧 ${user_email}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 0;color:#64748b;font-size:14px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:4px 8px;">
                    <a href="${contact_us}" style="color:#2563eb;text-decoration:none;">Contact Us</a>
                  </td>
                  <td style="padding:4px 8px;">
                    <a href="${privacy_policy}" style="color:#2563eb;text-decoration:none;">Privacy</a>
                  </td>
                  <td style="padding:4px 8px;">
                    <a href="${terms_of_service}" style="color:#2563eb;text-decoration:none;">Terms</a>
                  </td>
                  <td style="padding:4px 8px;">
                    <a href="${cancellation_policy}" style="color:#2563eb;text-decoration:none;">Cancellation</a>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" style="padding-top:16px;">
                    MessMate © ${currentYear}
                  </td>
                </tr>
                <tr>
                  <td colspan="4" style="color:#94a3b8;font-size:12px;padding-top:8px;">
                    Update your availability in the PG Owner Dashboard
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
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
