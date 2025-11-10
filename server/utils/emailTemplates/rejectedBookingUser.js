// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const USER_EMAIL = process.env.USER_EMAIL;
// const USER_PASSWORD = process.env.USER_PASSWORD;
// const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

// async function sendMailRejectedBooking(
//   email,
//   pg_name,
//   request_id,
//   host_message,
//   browse_link,
//   contact_us,
//   privacy_policy,
//   terms_of_service
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
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Booking Declined</title>
//   </head>
//   <body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background: #f8fafc;">
//     <div style="max-width: 600px; margin: auto; padding: 40px 20px">
//       <div style="text-align: center; margin-bottom: 30px">
//         <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png" alt="MessMate" style="width: 40px; max-width: 100%; padding: 4px" />
//       </div>

//       <div style="background: #ffffff; border-radius: 16px; padding: 40px; border: 2px solid #dc2626;">
//         <div style="text-align: center; margin-bottom: 24px">
//           <div style="background: #fee2e2; color: #dc2626; padding: 8px 24px; border-radius: 24px; display: inline-block; font-size: 14px; font-weight: 600;">
//             ❌ BOOKING REJECTED
//           </div>
//         </div>

//         <h1 style="font-size: 28px; color: #7f1d1d; text-align: center; margin: 0 0 24px 0;">
//           Request Not Accepted
//         </h1>

// <div class="timeline-container" style="margin-bottom:32px;width:100%;">
//   <div class="timeline-steps" style="display: flex; justify-content: space-between; padding: 0 8px;">
    
//     <div class="timeline-step" style="width:33.33%; text-align:center;">
//       <div>
//         <div style="width:32px;height:32px;background:#2563eb;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;font-weight:600;">1</div>
//         <div style="color:#2563eb;font-size:14px;margin-top:8px;font-weight:500;">Request Sent</div>
//       </div>
//     </div>

//     <div class="timeline-step" style="width:33.33%; text-align:center;">
//       <div>
//         <div style="width:32px;height:32px;background:#2563eb;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;font-weight:600;">2</div>
//         <div style="color:#2563eb;font-size:14px;margin-top:8px;font-weight:500;">Owner Approval</div>
//       </div>
//     </div>

//     <div class="timeline-step" style="width:33.33%; text-align:center;">
//       <div>
//         <div style="width:32px;height:32px;background:#dc2626;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:16px;font-weight:bold;">✖</div>
//         <div style="color:#dc2626;font-size:14px;margin-top:8px;font-weight:500;">Rejected</div>
//       </div>
//     </div>

//   </div>
// </div>


//         <div style="background: #fef2f2; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #fecaca;">
//           <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
//             <div>
//               <div style="color: #dc2626; font-size: 14px">PG Name</div>
//               <div style="color: #7f1d1d; font-weight: 600">${pg_name}</div>
//             </div>
//             <div>
//               <div style="color: #dc2626; font-size: 14px">Booking ID</div>
//               <div style="color: #7f1d1d; font-weight: 600">${request_id}</div>
//             </div>
//           </div>
//         </div>

//         <div style="background: #fff7f7; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
//           <div style="color: #dc2626; font-weight: 600; margin-bottom: 8px">Rejection Reason:</div>
//           <div style="color: #7f1d1d; font-style: italic">"${host_message}"</div>
//         </div>

//         <div style="text-align: center; margin: 32px 0">
//           <a href="${browse_link}" style="display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); transition: all 0.2s ease;">
//             Browse Other PGs →
//           </a>
//         </div>
//       </div>

//       <div style="text-align: center; padding: 32px 0; color: #64748b; font-size: 14px;">
//         <div style="margin-bottom: 16px">
//           <a href="${contact_us}" style="color: #2563eb; text-decoration: none; margin: 0 12px">Contact Us</a>
//           <a href="${privacy_policy}" style="color: #2563eb; text-decoration: none; margin: 0 12px">Privacy</a>
//           <a href="${terms_of_service}" style="color: #2563eb; text-decoration: none; margin: 0 12px">Terms</a>
//         </div>
//         <div>MessMate © ${currentYear} | All Rights Reserved</div>
//         <div style="margin-top: 12px; font-size: 12px; color: #94a3b8">This is an automated message</div>
//       </div>
//     </div>
//   </body>
// </html>
// `;
//   const emailText = `Messmate
// ❌ BOOKING REJECTED

// Request Not Accepted
// Booking Progress:

// Request Sent

// Owner Approval

// ❌ Rejected

// PG Name: ${pg_name}
// Booking ID: ${request_id}

// Rejection Reason:
// "${host_message}"

// Browse Other PGs →${browse_link}

// Links:
// Contact Us: ${contact_us}
// Privacy Policy: ${privacy_policy}
// Terms of Service: ${terms_of_service}

// MessMate © ${new Date().getFullYear()} | All Rights Reserved
// This is an automated message`;
//   const mailOptions = {
//     from: `"Messmate" <${USER_EMAIL}>`,
//     to: email,
//     subject: "Booking rejected – Messmate",

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

// module.exports = sendMailRejectedBooking;




// const nodemailer = require("nodemailer"); // ❌ REMOVED: Nodemailer will be replaced
const axios = require('axios'); // ✅ ADDED: For Zoho API calls
require("dotenv").config();

// Assuming these modules are available relative to this file's location:
const { refreshZohoToken } = require("../../controllers/zohoAuthController"); 
const ZohoToken = require(".../../modules/zohoToken"); 

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


async function sendMailRejectedBooking(
    email,
    pg_name,
    request_id,
    host_message,
    browse_link,
    contact_us,
    privacy_policy,
    terms_of_service
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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Declined</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background: #f8fafc;">
    <div style="max-width: 600px; margin: auto; padding: 40px 20px">
      <div style="text-align: center; margin-bottom: 30px">
        <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png" alt="MessMate" style="width: 40px; max-width: 100%; padding: 4px" />
      </div>

      <div style="background: #ffffff; border-radius: 16px; padding: 40px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 24px">
          <div style="background: #fee2e2; color: #dc2626; padding: 8px 24px; border-radius: 24px; display: inline-block; font-size: 14px; font-weight: 600;">
            ❌ BOOKING REJECTED
          </div>
        </div>

        <h1 style="font-size: 28px; color: #7f1d1d; text-align: center; margin: 0 0 24px 0;">
          Request Not Accepted
        </h1>

<div class="timeline-container" style="margin-bottom:32px;width:100%;">
  <div class="timeline-steps" style="display: flex; justify-content: space-between; padding: 0 8px;">
    
    <div class="timeline-step" style="width:33.33%; text-align:center;">
      <div>
        <div style="width:32px;height:32px;background:#2563eb;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;font-weight:600;">1</div>
        <div style="color:#2563eb;font-size:14px;margin-top:8px;font-weight:500;">Request Sent</div>
      </div>
    </div>

    <div class="timeline-step" style="width:33.33%; text-align:center;">
      <div>
        <div style="width:32px;height:32px;background:#2563eb;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;font-weight:600;">2</div>
        <div style="color:#2563eb;font-size:14px;margin-top:8px;font-weight:500;">Owner Approval</div>
      </div>
    </div>

    <div class="timeline-step" style="width:33.33%; text-align:center;">
      <div>
        <div style="width:32px;height:32px;background:#dc2626;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:16px;font-weight:bold;">✖</div>
        <div style="color:#dc2626;font-size:14px;margin-top:8px;font-weight:500;">Rejected</div>
      </div>
    </div>

  </div>
</div>


        <div style="background: #fef2f2; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #fecaca;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            <div>
              <div style="color: #dc2626; font-size: 14px">PG Name</div>
              <div style="color: #7f1d1d; font-weight: 600">${pg_name}</div>
            </div>
            <div>
              <div style="color: #dc2626; font-size: 14px">Booking ID</div>
              <div style="color: #7f1d1d; font-weight: 600">${request_id}</div>
            </div>
          </div>
        </div>

        <div style="background: #fff7f7; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <div style="color: #dc2626; font-weight: 600; margin-bottom: 8px">Rejection Reason:</div>
          <div style="color: #7f1d1d; font-style: italic">"${host_message}"</div>
        </div>

        <div style="text-align: center; margin: 32px 0">
          <a href="${browse_link}" style="display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); transition: all 0.2s ease;">
            Browse Other PGs →
          </a>
        </div>
      </div>

      <div style="text-align: center; padding: 32px 0; color: #64748b; font-size: 14px;">
        <div style="margin-bottom: 16px">
          <a href="${contact_us}" style="color: #2563eb; text-decoration: none; margin: 0 12px">Contact Us</a>
          <a href="${privacy_policy}" style="color: #2563eb; text-decoration: none; margin: 0 12px">Privacy</a>
          <a href="${terms_of_service}" style="color: #2563eb; text-decoration: none; margin: 0 12px">Terms</a>
        </div>
        <div>MessMate © ${currentYear} | All Rights Reserved</div>
        <div style="margin-top: 12px; font-size: 12px; color: #94a3b8">This is an automated message</div>
      </div>
    </div>
  </body>
</html>
`;
        
        // Text Content
  const emailText = `Messmate
❌ BOOKING REJECTED

Request Not Accepted
Booking Progress:

Request Sent

Owner Approval

❌ Rejected

PG Name: ${pg_name}
Booking ID: ${request_id}

Rejection Reason:
"${host_message}"

Browse Other PGs →${browse_link}

Links:
Contact Us: ${contact_us}
Privacy Policy: ${privacy_policy}
Terms of Service: ${terms_of_service}

MessMate © ${new Date().getFullYear()} | All Rights Reserved
This is an automated message`;

        // 💡 4. Construct API Payload
  const mailData = {
    fromAddress: `"Messmate" <${USER_EMAIL}>`,
    toAddress: email,
    subject: "Booking rejected – Messmate",
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

module.exports = sendMailRejectedBooking;