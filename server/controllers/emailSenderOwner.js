// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const USER_EMAIL = process.env.USER_EMAIL;
// const USER_PASSWORD = process.env.USER_PASSWORD;
// const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";
// async function sendmailOwner(name, email, userId) {
// const transporter = nodemailer.createTransport({
//   host: "smtp.zoho.in", // or smtp.zoho.com (if not India-based)
//   port: 465,
//   secure: true, // true for 465, false for 587
//   auth: {
//     user: USER_EMAIL,
//     pass: USER_PASSWORD,
//   },
// });
//   const currentYear = new Date().getFullYear();
//   const emailHtml = `<!DOCTYPE html>
// <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Verify Your Email</title>
//     <link
//       href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
//       rel="stylesheet"
//     />
//     <style>
//       body {
//         margin: 0;
//         padding: 0;
//         background-color: #ffffff;
//         font-family: "Montserrat", sans-serif;
//         -webkit-font-smoothing: antialiased;
//       }
//       .email-container {
//         max-width: 400px;
//         margin: auto;
//         padding: 55px 24px;
//       }
//       .logo {
//         width: 40px;
//         margin-bottom: 24px;
//       }
//       .heading {
//         font-size: 20px;
//         font-weight: 600;
//         text-align: center;
//         color: #000000;
//         margin-bottom: 16px;
//       }
//       .description {
//         font-size: 14px;
//         color: #4b5563;
//         text-align: center;
//         margin-bottom: 30px;
//         line-height: 1.5;
//       }
//       .btn {
//         display: inline-block;
//         background-color: #2ca4b5;
//         color: #ffffff;
//         text-decoration: none;
//         padding: 12px 24px;
//         border-radius: 8px;
//         font-weight: 600;
//         font-size: 14px;
//         transition: opacity 0.3s ease;
//       }
//       .btn:hover {
//         background-color: #208696;
//       }
//       .team-msg {
//         text-align: left;
//         font-size: 14px;
//         color: #4b5563;
//         margin-top: 40px;
//         line-height: 1.5;
//       }
//       .footer-box {
//         background-color: #dbdbdb;
//         border-radius: 12px;
//         margin-top: 40px;
//         padding: 20px;
//         text-align: center;
//         font-size: 12px;
//         color: #6b7280;
//         border: 1px solid #e5e7eb;
//       }
//       .footer-box a {
//         color: #6b7280;
//         text-decoration: underline;
//         transition: color 0.3s ease;
//       }
//       .footer-box a:hover {
//         color: #2563eb;
//       }
//       @media (max-width: 480px) {
//         .email-container {
//           padding: 40px 16px;
//         }
//         .heading {
//           font-size: 18px;
//         }
//         .description {
//           font-size: 13px;
//         }
//         .btn {
         
//           box-sizing: border-box;
//         }
//         .logo {
//           width: 36px;
//         }
//         .footer-box {
//           margin-top: 30px;
//           padding: 16px;
//         }
//       }
//     </style>
//   </head>

//   <body>
//     <div class="email-container">
//       <div style="text-align: center">
//         <img
//           src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png"
//           alt="MessMate - Company Logo"
//           class="logo"
//         />
//       </div>

//       <h1 class="heading">Hi, ${name} 👋</h1>

//       <div class="description">
//         Thanks for signing up! Let’s get your email verified so you can start enjoying all the perks.
//       </div>

//       <div style="text-align: center; margin: 40px 0;">
//         <a href="${frontendUrl}/MailVerifyOwner?id=${userId}&email=${encodeURIComponent(
//     email
//   )}" class="btn">Verify Email</a>
//       </div>

//       <div class="team-msg">
//        We’re excited to have you on board!
//       </div>

//       <div class="footer-box">
//         <div style="margin-bottom: 8px;">
//           Need help? Contact us anytime at<br/>
//           <a href="mailto:support@messmate.co.in">support@messmate.co.in</a>
//         </div>
//         <div>
//           Messmate © ${currentYear} | All rights reserved.
//         </div>
//       </div>
//     </div>
//   </body>
// </html>
// `;
//   const emailText = `Hi, ${name} 👋

// Thanks for signing up! Let’s get your email verified so you can start enjoying all the perks.

// Click the link below to verify your email:
// ${frontendUrl}/MailVerifyOwner?id=${userId}&email=${encodeURIComponent(email)}

//  We’re excited to have you on board!

// Need help? Contact us at: support@messmate.co.in
// Messmate © ${currentYear} | All rights reserved.`;
//   const mailOptions = {
//     from: `"Messmate" <${USER_EMAIL}>`,
//     to: email,
//     subject: "Email Verification for Messmate Owner",
//     // html:'<h3>Hi, '+name+' Click <a href="https://easypg-react-client.onrender.com/MailVerifyOwner?id='+userId+'">here</a> to verify you email </h3>'
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

// module.exports = sendmailOwner;

const axios = require('axios'); // Required for API calls
// const nodemailer = require("nodemailer"); // Removed Nodemailer
require("dotenv").config();

// Assuming these modules are available in the scope where this file is used:
const { refreshZohoToken } = require("../controllers/zohoAuthController");
const ZohoToken = require("../modules/zohoToken"); 

const USER_EMAIL = process.env.USER_EMAIL;
// USER_PASSWORD is not used in the API method, so it's safe to keep it, but it's unnecessary here.
// const USER_PASSWORD = process.env.USER_PASSWORD; 
const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

// BASE URL for Zoho Mail API
const ZOHO_MAIL_BASE_URL = "https://mail.zoho.in/api";

/**
 * Helper function to fetch the user's Zoho Mail Account ID.
 * (Copied from the previous successful implementation)
 */
async function getZohoAccountId(accessToken) {
    // We reuse the logic from the previously working function
    const url = `${ZOHO_MAIL_BASE_URL}/accounts`;
    
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
        },
        timeout: 10000 
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
        const accountId = response.data.data[0].accountId; 
        return accountId;
    }
    throw new Error("Could not retrieve Zoho Account ID from API.");
}


async function sendmailOwner(name, email, userId) {
    try {
        console.log("📡 [Owner Mail] Checking Zoho token...");

        // 🔹 1. Token Fetch and Refresh Logic
        let tokenData = await ZohoToken.findOne().sort({ updatedAt: -1 });
        if (!tokenData) throw new Error("No Zoho token found in database");

        if (tokenData.isExpired()) {
            console.log("⚠️ [Owner Mail] Zoho access token expired — refreshing...");
            const req = { query: { secret: process.env.ZOHO_CRON_SECRET } };
            const res = { status: () => ({ json: () => {} }), json: () => {} };
            await refreshZohoToken(req, res);
            tokenData = await ZohoToken.findOne().sort({ updatedAt: -1 });
            console.log("✅ [Owner Mail] Token refreshed successfully.");
        }

        // 🎯 2. Get the correct Account ID
        const accountId = await getZohoAccountId(tokenData.access_token);
        const sendMailUrl = `${ZOHO_MAIL_BASE_URL}/accounts/${accountId}/messages`;

        // --- Content setup (KEPT AS IS) ---
        const currentYear = new Date().getFullYear();
        
        // Note: The HTML and Text content remains the same structure as your input.
        const emailHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #ffffff;
        font-family: "Montserrat", sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .email-container {
        max-width: 400px;
        margin: auto;
        padding: 55px 24px;
      }
      .logo {
        width: 40px;
        margin-bottom: 24px;
      }
      .heading {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        color: #000000;
        margin-bottom: 16px;
      }
      .description {
        font-size: 14px;
        color: #4b5563;
        text-align: center;
        margin-bottom: 30px;
        line-height: 1.5;
      }
      .btn {
        display: inline-block;
        background-color: #2ca4b5;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        transition: opacity 0.3s ease;
      }
      .btn:hover {
        background-color: #208696;
      }
      .team-msg {
        text-align: left;
        font-size: 14px;
        color: #4b5563;
        margin-top: 40px;
        line-height: 1.5;
      }
      .footer-box {
        background-color: #dbdbdb;
        border-radius: 12px;
        margin-top: 40px;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
        border: 1px solid #e5e7eb;
      }
      .footer-box a {
        color: #6b7280;
        text-decoration: underline;
        transition: color 0.3s ease;
      }
      .footer-box a:hover {
        color: #2563eb;
      }
      @media (max-width: 480px) {
        .email-container {
          padding: 40px 16px;
        }
        .heading {
          font-size: 18px;
        }
        .description {
          font-size: 13px;
        }
        .btn {
         
          box-sizing: border-box;
        }
        .logo {
          width: 36px;
        }
        .footer-box {
          margin-top: 30px;
          padding: 16px;
        }
      }
    </style>
  </head>

  <body>
    <div class="email-container">
      <div style="text-align: center">
        <img
          src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png"
          alt="MessMate - Company Logo"
          class="logo"
        />
      </div>

      <h1 class="heading">Hi, ${name} 👋</h1>

      <div class="description">
        Thanks for signing up! Let’s get your email verified so you can start enjoying all the perks.
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${frontendUrl}/MailVerifyOwner?id=${userId}&email=${encodeURIComponent(
    email
  )}" class="btn">Verify Email</a>
      </div>

      <div class="team-msg">
       We’re excited to have you on board!
      </div>

      <div class="footer-box">
        <div style="margin-bottom: 8px;">
          Need help? Contact us anytime at<br/>
          <a href="mailto:support@messmate.co.in">support@messmate.co.in</a>
        </div>
        <div>
          Messmate © ${currentYear} | All rights reserved.
        </div>
      </div>
    </div>
  </body>
</html>
`;
        
        const emailText = `Hi, ${name} 👋

            Thanks for signing up! Let’s get your email verified so you can start enjoying all the perks.

            Click the link below to verify your email:
            ${frontendUrl}/MailVerifyOwner?id=${userId}&email=${encodeURIComponent(email)}

            We’re excited to have you on board!

            Need help? Contact us at: support@messmate.co.in
            Messmate © ${currentYear} | All rights reserved.`;

        // 💡 3. Construct the Zoho API Payload
        const mailData = {
            fromAddress: `"Messmate" <${USER_EMAIL}>`,
            toAddress: email,
            subject: "Email Verification for Messmate Owner",
            content: emailHtml,
            mailFormat: 'html', 
        };

        console.log("🚀 [Owner Mail] Sending email via Zoho Mail API...");

        // 💡 4. Make the HTTP POST request using Axios
        const result = await axios.post(sendMailUrl, mailData, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`,
                'Content-Type': 'application/json'
            },
            timeout: 20000 
        });

        if (result.status === 200 || result.status === 201) {
            console.log("✅ [Owner Mail] Email sent successfully via Zoho API:", result.data);
            return true;
        } else {
            console.error("[Owner Mail] Zoho API returned unexpected status:", result.status, result.data);
            return false;
        }

    } catch (error) {
        console.error("❌ [Owner Mail] Error while sending email via Zoho API:", error.response?.data || error.message);
        return false;
    }
}

module.exports = sendmailOwner;
