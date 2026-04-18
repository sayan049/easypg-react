// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const USER_EMAIL = process.env.USER_EMAIL;
// const USER_PASSWORD = process.env.USER_PASSWORD;
// const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

// async function sendMailConfirmedBooking(
//   email,
//   pg_name,
//   checkin_date,
//   total_amount,
//   room_no,
//   beds_booked,
//   booking_id,
//   calendar_link,
//   host_name,
//   host_phone,
//   contact_us,
//   privacy_policy,
//   terms_of_service,
//   cancellation_policy
// ) {
// const transporter = nodemailer.createTransport({
//   host: "smtp.zoho.in", // or smtp.zoho.com (if not India-based)
//   port: 465,
//   secure: true, // true for 465, false for 587
//   auth: {
//     user: USER_EMAIL,
//     pass: USER_PASSWORD,
//   },
// });
//   /* The `mailOptions` object is being used to define the details of the email that will be sent. Here's
//    a breakdown of its properties: */
//   const currentYear = new Date().getFullYear();
//   const emailHtml = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1">
//   <title>Booking Confirmed</title>
// </head>
// <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f8fafc;">
//   <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;padding:25px 25px;">
//     <tr>
//       <td align="center">
//         <!--[if mso]>
//         <table role="presentation" cellpadding="0" cellspacing="0" width="600" align="center">
//         <tr><td>
//         <![endif]-->
//         <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:16px;border:2px solid #2563eb;padding:25px;margin:0 auto;">
//           <!-- Header -->
//           <tr>
//             <td align="center" style="padding-bottom:20px;">
//               <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png" alt="MessMate" width="40" style="display:block;border:0;max-width:100%;height:auto;">
//             </td>
//           </tr>

//           <!-- Status Badge -->
//           <tr>
//             <td align="center" style="padding-bottom:20px;">
//               <span style="background:#d1fae5;color:#2563eb;padding:8px 20px;border-radius:24px;display:inline-block;font-size:13px;font-weight:600;max-width:280px;">
//                 🎉 BOOKING CONFIRMED
//               </span>
//             </td>
//           </tr>

//           <!-- Title -->
//           <tr>
//             <td align="center" style="color:#1e3a8a;font-size:22px;font-weight:bold;padding-bottom:20px;line-height:1.3;">
//               Welcome to ${pg_name}!
//             </td>
//           </tr>

//           <!-- Details Grid -->
//           <tr>
//             <td>
//               <table role="presentation" cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;">
//                 <tr>
//                   <td style="display:block;width:100%;padding:8px 0;">
//                     <table role="presentation" cellpadding="8" cellspacing="0" width="100%">
//                       <tr>
//                         <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;margin-bottom:8px;">
//                           Check-in Date<br/>
//                           <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">${checkin_date}</span>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;margin-bottom:8px;">
//                           Monthly Rent<br/>
//                           <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">₹${total_amount}/month</span>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;margin-bottom:8px;">
//                           Room<br/>
//                           <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">${room_no}</span>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;margin-bottom:8px;">
//                           Total Beds Booked<br/>
//                           <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">${beds_booked}</span>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;">
//                           Booking ID<br/>
//                           <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">${booking_id}</span>
//                         </td>
//                       </tr>
//                     </table>
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>

//           <!-- Timeline -->
//           <tr>
//             <td style="padding:25px 0;">
//               <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
//                 <tr>
//                   <td align="center" style="padding:8px 0;">
//                     <div style="width:28px;height:28px;background:#2563eb;border-radius:50%;color:#fff;line-height:28px;margin:0 auto;font-size:12px;">1</div>
//                     <div style="color:#2563eb;font-size:11px;margin-top:6px;">Request Sent</div>
//                   </td>
//                   <td align="center" style="padding:8px 0;">
//                     <div style="width:28px;height:28px;background:#2563eb;border-radius:50%;color:#fff;line-height:28px;margin:0 auto;font-size:12px;">2</div>
//                     <div style="color:#2563eb;font-size:11px;margin-top:6px;">Approval</div>
//                   </td>
//                   <td align="center" style="padding:8px 0;">
//                     <div style="width:28px;height:28px;background:#2563eb;border-radius:50%;color:#fff;line-height:28px;margin:0 auto;font-size:12px;">3</div>
//                     <div style="color:#2563eb;font-size:11px;margin-top:6px;">Confirmed</div>
//                   </td>
//                   <td align="center" style="padding:8px 0;">
//                     <div style="width:28px;height:28px;background:#93c5fd;border-radius:50%;color:#fff;line-height:28px;margin:0 auto;font-size:12px;">4</div>
//                     <div style="color:#3b82f6;font-size:11px;margin-top:6px;">Check-in</div>
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>

//           <!-- CTA Button -->
//           <tr>
//             <td align="center" style="padding-bottom:25px;">
//               <a href="${calendar_link}" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;display:block;font-size:13px;max-width:280px;width:90%;margin:0 auto;">
//                 Add To Calendar
//               </a>
//             </td>
//           </tr>

//           <!-- Host Card -->
//           <tr>
//             <td style="background:#f0f9ff;border-radius:12px;border:1px solid #7dd3fc;text-align:center;padding:12px;">
//               <div style="display:inline-block;width:40px;height:40px;background:#0ea5e9;border-radius:8px;line-height:40px;color:#fff;font-size:18px;">
//                 👤
//               </div>
//               <div style="margin-top:10px;color:#0c4a6e;font-weight:600;font-size:14px;">
//                 PG Owner: ${host_name}
//               </div>
//               <div style="color:#0284c7;font-size:13px;">
//                 📞 ${host_phone}
//               </div>
//             </td>
//           </tr>
          
//           <!-- Footer -->
//           <tr>
//             <td align="center" style="padding-top:25px;padding-bottom:0;color:#64748b;font-size:13px;">
//               <a href="${contact_us}" style="color:#2563eb;text-decoration:none;display:block;margin:6px 0;">Contact Us</a>
//               <a href="${privacy_policy}" style="color:#2563eb;text-decoration:none;display:block;margin:6px 0;">Privacy</a>
//               <a href="${terms_of_service}" style="color:#2563eb;text-decoration:none;display:block;margin:6px 0;">Terms</a>
//               <a href="${cancellation_policy}" style="color:#2563eb;text-decoration:none;display:block;margin:6px 0;">Cancellation</a>
//             </td>
//           </tr>
//           <tr>
//             <td align="center" style="padding-top:12px;color:#64748b;font-size:13px;">
//               Messmate © ${currentYear}
//             </td>
//           </tr>
//           <tr>
//             <td align="center" style="padding-top:10px;color:#94a3b8;font-size:11px;">
//               This is an automated message
//             </td>
//           </tr>
//         </table>
//         <!--[if mso]>
//         </td></tr></table>
//         <![endif]-->
//       </td>
//     </tr>
//   </table>
// </body>
// </html>
// `;
//   const emailText = `🎉 Booking Confirmed – Messmate

// Hi, your booking at ${pg_name} is confirmed!

// 🗓 Check-in: ${checkin_date}
// 💰 Rent: ₹${total_amount}/month
// 🛏 Room No.: ${room_no}
// 👥 Beds Booked: ${beds_booked}
// 🆔 Booking ID: ${booking_id}

// —

// 📅 Add to your calendar:
// ${calendar_link}

// —

// Host Info
// 👤 ${host_name}
// 📞 ${host_phone}

// —

// Need help?
// Contact: ${contact_us}
// Privacy: ${privacy_policy}
// Terms: ${terms_of_service}
// Cancel Policy: ${cancellation_policy}

// —

// Messmate © ${currentYear}
// (This is an automated message)`;
//   const mailOptions = {
//     from:`"Messmate" <${USER_EMAIL}>`,
//     to: email,
//     subject: "Booking Confirmed – Messmate",

//     html: emailHtml,
//     text: emailText,
//   };
//   try {
//     const result = await transporter.sendMail(mailOptions);
//     console.log("email has ben sent succesfully");
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// }

// module.exports = sendMailConfirmedBooking;




// const nodemailer = require("nodemailer"); // ❌ REMOVED: Nodemailer will be replaced
const axios = require('axios'); // ✅ ADDED: For Zoho API calls
require("dotenv").config();

// Assuming these modules are available relative to this file's location:
const { refreshZohoToken } = require("../../controllers/zohoAuthController"); 
const ZohoToken = require("../../modules/zohoToken"); 

const USER_EMAIL = process.env.USER_EMAIL;
// const USER_PASSWORD = process.env.USER_PASSWORD; // No longer needed for OAuth API
const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

// BASE URL for Zoho Mail API
const ZOHO_MAIL_BASE_URL = "https://mail.zoho.in/api";

// --- Helper Function ---
/**
 * Fetches the user's Zoho Mail Account ID using the OAuth Access Token.
 * @param {string} accessToken - Valid Zoho OAuth Access Token.
 * @returns {string} The Zoho Account ID.
 */
async function getZohoAccountId(accessToken) {
    const url = `${ZOHO_MAIL_BASE_URL}/accounts`;
    
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
        },
        timeout: 10000 
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data[0].accountId; 
    }
    throw new Error("Could not retrieve Zoho Account ID from API. Check OAuth scopes.");
}
// -----------------------


async function sendMailConfirmedBooking(
    email,
    pg_name,
    checkin_date,
    total_amount,
    room_no,
    beds_booked,
    booking_id,
    calendar_link,
    host_name,
    host_phone,
    contact_us,
    privacy_policy,
    terms_of_service,
    cancellation_policy
) {
    try {
        // --- 1. Zoho Token Handling ---
        let tokenData = await ZohoToken.findOne().sort({ updatedAt: -1 });
        if (!tokenData) throw new Error("No Zoho token found in database for API.");

        if (tokenData.isExpired()) {
            const reqDummy = { query: { secret: process.env.ZOHO_CRON_SECRET } };
            const resDummy = { status: () => ({ json: () => {} }), json: () => {} };
            await refreshZohoToken(reqDummy, resDummy);
            tokenData = await ZohoToken.findOne().sort({ updatedAt: -1 });
        }

        // 🎯 2. Dynamic Account ID Retrieval
        const accountId = await getZohoAccountId(tokenData.access_token);
        const sendMailUrl = `${ZOHO_MAIL_BASE_URL}/accounts/${accountId}/messages`;
        
        // --- 3. Content Setup (KEPT AS IS) ---
        const currentYear = new Date().getFullYear();
        
        // HTML Content
        const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f8fafc;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;padding:25px 25px;">
    <tr>
      <td align="center">
        <!--[if mso]>
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" align="center">
        <tr><td>
        <![endif]-->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:16px;border:2px solid #2563eb;padding:25px;margin:0 auto;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png" alt="MessMate" width="40" style="display:block;border:0;max-width:100%;height:auto;">
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <span style="background:#d1fae5;color:#2563eb;padding:8px 20px;border-radius:24px;display:inline-block;font-size:13px;font-weight:600;max-width:280px;">
                🎉 BOOKING CONFIRMED
              </span>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="color:#1e3a8a;font-size:22px;font-weight:bold;padding-bottom:20px;line-height:1.3;">
              Welcome to ${pg_name}!
            </td>
          </tr>

          <!-- Details Grid -->
          <tr>
            <td>
              <table role="presentation" cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <tr>
                  <td style="display:block;width:100%;padding:8px 0;">
                    <table role="presentation" cellpadding="8" cellspacing="0" width="100%">
                      <tr>
                        <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;margin-bottom:8px;">
                          Check-in Date<br/>
                          <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">${checkin_date}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;margin-bottom:8px;">
                          Monthly Rent<br/>
                          <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">₹${total_amount}/month</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;margin-bottom:8px;">
                          Room<br/>
                          <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">${room_no}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;margin-bottom:8px;">
                          Total Beds Booked<br/>
                          <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">${beds_booked}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;color:#3b82f6;font-size:13px;font-weight:600;width:100%;">
                          Booking ID<br/>
                          <span style="color:#1e3a8a;font-weight:bold;font-size:15px;">${booking_id}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Timeline -->
          <tr>
            <td style="padding:25px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0;">
                    <div style="width:28px;height:28px;background:#2563eb;border-radius:50%;color:#fff;line-height:28px;margin:0 auto;font-size:12px;">1</div>
                    <div style="color:#2563eb;font-size:11px;margin-top:6px;">Request Sent</div>
                  </td>
                  <td align="center" style="padding:8px 0;">
                    <div style="width:28px;height:28px;background:#2563eb;border-radius:50%;color:#fff;line-height:28px;margin:0 auto;font-size:12px;">2</div>
                    <div style="color:#2563eb;font-size:11px;margin-top:6px;">Approval</div>
                  </td>
                  <td align="center" style="padding:8px 0;">
                    <div style="width:28px;height:28px;background:#2563eb;border-radius:50%;color:#fff;line-height:28px;margin:0 auto;font-size:12px;">3</div>
                    <div style="color:#2563eb;font-size:11px;margin-top:6px;">Confirmed</div>
                  </td>
                  <td align="center" style="padding:8px 0;">
                    <div style="width:28px;height:28px;background:#93c5fd;border-radius:50%;color:#fff;line-height:28px;margin:0 auto;font-size:12px;">4</div>
                    <div style="color:#3b82f6;font-size:11px;margin-top:6px;">Check-in</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom:25px;">
              <a href="${calendar_link}" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;display:block;font-size:13px;max-width:280px;width:90%;margin:0 auto;">
                Add To Calendar
              </a>
            </td>
          </tr>

          <!-- Host Card -->
          <tr>
            <td style="background:#f0f9ff;border-radius:12px;border:1px solid #7dd3fc;text-align:center;padding:12px;">
              <div style="display:inline-block;width:40px;height:40px;background:#0ea5e9;border-radius:8px;line-height:40px;color:#fff;font-size:18px;">
                👤
              </div>
              <div style="margin-top:10px;color:#0c4a6e;font-weight:600;font-size:14px;">
                PG Owner: ${host_name}
              </div>
              <div style="color:#0284c7;font-size:13px;">
                📞 ${host_phone}
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:25px;padding-bottom:0;color:#64748b;font-size:13px;">
              <a href="${contact_us}" style="color:#2563eb;text-decoration:none;display:block;margin:6px 0;">Contact Us</a>
              <a href="${privacy_policy}" style="color:#2563eb;text-decoration:none;display:block;margin:6px 0;">Privacy</a>
              <a href="${terms_of_service}" style="color:#2563eb;text-decoration:none;display:block;margin:6px 0;">Terms</a>
              <a href="${cancellation_policy}" style="color:#2563eb;text-decoration:none;display:block;margin:6px 0;">Cancellation</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:12px;color:#64748b;font-size:13px;">
              Messmate © ${currentYear}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:10px;color:#94a3b8;font-size:11px;">
              This is an automated message
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
        
        // Text Content
  const emailText = `🎉 Booking Confirmed – Messmate

Hi, your booking at ${pg_name} is confirmed!

🗓 Check-in: ${checkin_date}
💰 Rent: ₹${total_amount}/month
🛏 Room No.: ${room_no}
👥 Beds Booked: ${beds_booked}
🆔 Booking ID: ${booking_id}

—

📅 Add to your calendar:
${calendar_link}

—

Host Info
👤 ${host_name}
📞 ${host_phone}

—

Need help?
Contact: ${contact_us}
Privacy: ${privacy_policy}
Terms: ${terms_of_service}
Cancel Policy: ${cancellation_policy}

—

Messmate © ${currentYear}
(This is an automated message)`;

        // 💡 4. Construct API Payload
  const mailData = {
    fromAddress: `"Messmate" <${USER_EMAIL}>`,
    toAddress: email,
    subject: "Booking Confirmed – Messmate",
    content: emailHtml,
    mailFormat: 'html',
  };
        
        // --- 5. Send Email via Zoho API ---
        await axios.post(sendMailUrl, mailData, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`,
                'Content-Type': 'application/json'
            },
            timeout: 20000 
        });

    console.log("email has ben sent succesfully");
    return true;
  } catch (error) {
    console.error("Error: ", error.response?.data || error.message);
    return false;
  }
}

module.exports = sendMailConfirmedBooking;