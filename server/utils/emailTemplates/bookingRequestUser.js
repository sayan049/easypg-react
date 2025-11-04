// module.exports = function bookingRequestUserTemplate({

// }) {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <title>Booking Request Submitted</title>
// </head>
// <body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; -webkit-font-smoothing: antialiased; background-color: #ffffff;">
//   <div style="max-width: 600px; margin: auto; padding: 30px 20px;">
//     <div style="text-align: center; margin-bottom: 40px;">
//       <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png"
//            alt="MessMate"
//            style="width: 60px; height: 60px; margin-bottom: 20px;">
//     </div>

//     <div style="background: #ffffff; border-radius: 8px; padding: 30px; border: 1px solid #e5e7eb;">
//       <div style="background: #fffbeb; color: #d97706;  border-radius: 20px;
//                   display: inline-block; margin: 0 auto 25px; text-align: center; width: 100%;">
//         <span style="font-weight: 600; font-size: 14px;">✓ REQUEST SUBMITTED</span>
//       </div>

//       <h1 style="font-size: 24px; color: #1f2937; text-align: center; margin: 0 0 25px 0;">
//         Your PG Request is Processing
//       </h1>

//       <table style="width: 100%; margin: 30px 0; border-collapse: collapse;">
//         <tr>
//           <td style="padding: 12px; background: #f3f4f6; border: 1px solid #e5e7eb; width: 50%;">
//             <span style="font-size: 13px; color: #6b7280;">Booking ID</span><br>
//             <strong style="font-size: 16px; color: #1f2937;">${requestId}</strong>
//           </td>
//           <td style="padding: 12px; background: #f3f4f6; border: 1px solid #e5e7eb; width: 50%;">
//             <span style="font-size: 13px; color: #6b7280;">Submitted On</span><br>
//             <strong style="font-size: 16px; color: #1f2937;">${submissionDate}<br>${submissionTime}</strong>
//           </td>
//         </tr>
//         <tr>
//           <td style="padding: 12px; border: 1px solid #e5e7eb; width: 50%;">
//             <span style="font-size: 13px; color: #6b7280;">PG Name</span><br>
//             <strong style="font-size: 16px; color: #1f2937;">${pgName}</strong>
//           </td>
//           <td style="padding: 12px; border: 1px solid #e5e7eb; width: 50%;">
//             <span style="font-size: 13px; color: #6b7280;">Owner Contact</span><br>
//             <strong style="font-size: 16px; color: #1f2937;">${hostContact}</strong>
//           </td>
//         </tr>
//       </table>

//       <div style="margin: 35px 0; text-align: center;">
//         <div style="display: inline-block; position: relative; width: 100%; max-width: 400px;">
//           <div style="position: absolute; top: 15px; left: 20%; right: 20%; height: 2px; background: #e5e7eb;"></div>

//           <div style="display: flex; justify-content: space-between;">
//             <div style="position: relative; z-index: 1;">
//               <div style="width: 32px; height: 32px; background: #3b82f6; border-radius: 50%;
//                           color: white; line-height: 32px; margin: 0 auto 8px;">1</div>
//               <span style="font-size: 12px; color: #3b82f6;">Request Sent</span>
//             </div>
//             <div style="position: relative; z-index: 1;">
//               <div style="width: 32px; height: 32px; background: #e5e7eb; border-radius: 50%;
//                           color: #6b7280; line-height: 32px; margin: 0 auto 8px;">2</div>
//               <span style="font-size: 12px; color: #6b7280;">Owner Approval</span>
//             </div>
//             <div style="position: relative; z-index: 1;">
//               <div style="width: 32px; height: 32px; background: #e5e7eb; border-radius: 50%;
//                           color: #6b7280; line-height: 32px; margin: 0 auto 8px;">3</div>
//               <span style="font-size: 12px; color: #6b7280;">Confirmation</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 25px 0;">
//         <h3 style="color: #15803d; margin: 0 0 15px 0;">What's Next?</h3>
//         <ul style="margin: 0; padding-left: 20px; color: #64748b;">
//           <li style="margin-bottom: 8px;">Owner will respond within ${responseTime}</li>
//           <li style="margin-bottom: 8px;">You'll receive confirmation email once approved</li>
//           <li>Payment will be collected after confirmation</li>
//         </ul>
//       </div>

//       <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
//         Need help? Contact us at
//         <a href="mailto:helpmessmate@gmail.com"
//            style="color: #3b82f6; text-decoration: none;">helpmessmate@gmail.com</a>
//       </div>
//     </div>

//     <div style="text-align: center; margin-top: 40px; color: #9ca3af; font-size: 12px;">
//       <p style="margin: 8px 0;">
//         Messmate © ${new Date().getFullYear()}

//         <a href="${termsLink}" style="color: #9ca3af; text-decoration: none;">Terms</a> •
//         <a href="${privacyLink}" style="color: #9ca3af; text-decoration: none;">Privacy</a>
//       </p>
//         <p style="margin: 0;">This is an automated message. Please do not reply directly to this email.</p>
//     </div>
//   </div>
// </body>
// </html>`;
// };

const nodemailer = require("nodemailer");
require("dotenv").config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

async function sendEmailForUserBookingRequest(
  email,
  requestId,
  submissionDate,
  submissionTime,
  pgName,
  hostContact,
  responseTime,
  termsLink,
  privacyLink
) {
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in", // or smtp.zoho.com (if not India-based)
  port: 465,
  secure: true, // true for 465, false for 587
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
  <title>Booking Request Submitted</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#ffffff;">
  <!--[if mso]>
  <style type="text/css">
  body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:30px 20px;">
        <!--[if mso]>
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" align="center">
        <tr><td>
        <![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png" alt="MessMate" width="40" style="display:block;border:0;max-width:100%;height:auto;margin:0 auto 20px;">
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;padding:30px;">
              <!-- Status Badge -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:25px;">
                    <div style="background:#fffbeb;color:#d97706;border-radius:20px;display:inline-block;font-weight:600;font-size:14px;padding:8px 24px;">
                      ✓ REQUEST SUBMITTED
                    </div>
                  </td>
                </tr>
                
                <!-- Details Table -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:30px 0;">
                      <tr>
                        <td width="50%" style="padding:12px;background:#f3f4f6;border:1px solid #e5e7eb;">
                          <span style="font-size:13px;color:#6b7280;">Booking ID</span><br />
                          <strong style="font-size:16px;color:#1f2937;">${requestId}</strong>
                        </td>
                        <td width="50%" style="padding:12px;background:#f3f4f6;border:1px solid #e5e7eb;">
                          <span style="font-size:13px;color:#6b7280;">Submitted On</span><br />
                          <strong style="font-size:16px;color:#1f2937;">${submissionDate}<br />${submissionTime}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding:12px;border:1px solid #e5e7eb;">
                          <span style="font-size:13px;color:#6b7280;">PG Name</span><br />
                          <strong style="font-size:16px;color:#1f2937;">${pgName}</strong>
                        </td>
                        <td width="50%" style="padding:12px;border:1px solid #e5e7eb;">
                          <span style="font-size:13px;color:#6b7280;">Owner Contact</span><br />
                          <strong style="font-size:16px;color:#1f2937;">${hostContact}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Progress Steps -->
                <tr>
                  <td align="center" style="padding:30px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:100%;">
                      <tr>
                        <!-- Step 1 -->
                        <td width="33%" style="text-align:center;">
                          <div style="width:28px;height:28px;background:#3b82f6;color:white;font-size:12px;font-weight:bold;line-height:28px;border-radius:50%;margin:0 auto 4px;">
                            1
                          </div>
                          <div style="font-size:10px;color:#3b82f6;">Request Sent</div>
                        </td>
                        
                        <!-- Step 2 -->
                        <td width="33%" style="text-align:center;">
                          <div style="width:28px;height:28px;background:#e5e7eb;color:#6b7280;font-size:12px;font-weight:bold;line-height:28px;border-radius:50%;margin:0 auto 4px;">
                            2
                          </div>
                          <div style="font-size:10px;color:#6b7280;">Owner Approval</div>
                        </td>
                        
                        <!-- Step 3 -->
                        <td width="34%" style="text-align:center;">
                          <div style="width:28px;height:28px;background:#e5e7eb;color:#6b7280;font-size:12px;font-weight:bold;line-height:28px;border-radius:50%;margin:0 auto 4px;">
                            3
                          </div>
                          <div style="font-size:10px;color:#6b7280;">Confirmation</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- What's Next -->
                <tr>
                  <td style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:25px 0;">
                    <h3 style="color:#15803d;margin:0 0 15px 0;">What's Next?</h3>
                    <ul style="margin:0;padding-left:20px;color:#64748b;">
                      <li style="margin-bottom:8px;">Owner will respond within ${responseTime}</li>
                      <li style="margin-bottom:8px;">You'll receive confirmation email once approved</li>
                      <li>Payment will be collected after confirmation</li>
                    </ul>
                  </td>
                </tr>
                
                <!-- Contact Info -->
                <tr>
                  <td align="center" style="color:#6b7280;font-size:14px;padding-top:30px;">
                    Need help? Contact us at
                    <a href="mailto:support@messmate.co.in" style="color:#3b82f6;text-decoration:none;">
                      support@messmate.co.in
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="color:#9ca3af;font-size:12px;padding-top:40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    Messmate © ${currentYear}
                    <a href="${termsLink}" style="color:#9ca3af;text-decoration:none;">Terms</a>
                    •
                    <a href="${privacyLink}" style="color:#9ca3af;text-decoration:none;">Privacy</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;">
                    This is an automated message. Please do not reply directly to this email.
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
  const emailText = `✓ REQUEST SUBMITTED

Hello,

A new booking request has been submitted.

Booking ID: ${requestId}
Submitted On: ${submissionDate} at ${submissionTime}

PG Name: ${pgName}
Owner Contact: ${hostContact}

--- Booking Progress ---
1. Request Sent
2. Owner Approval
3. Confirmation

What's Next?
- Owner will respond within ${responseTime}
- You'll receive confirmation email once approved
- Payment will be collected after confirmation

Need help? Contact us at support@messmate.co.in

----------------------------------------
Messmate © ${currentYear}
Terms: ${termsLink}
Privacy: ${privacyLink}

This is an automated message. Please do not reply directly to this email.
`;
  const mailOptions = {
    from: `"Messmate" <${USER_EMAIL}>`,
    to: email,
    subject: "Booking Request Submitted",
    
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

module.exports = sendEmailForUserBookingRequest;
