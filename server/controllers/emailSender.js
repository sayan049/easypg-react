// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const USER_EMAIL = process.env.USER_EMAIL;
// const USER_PASSWORD = process.env.USER_PASSWORD;
// const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";
// const { refreshZohoToken } = require("../controllers/zohoAuthController");
// const ZohoToken = require("../modules/zohoToken");

// async function sendmail(name, email, userId) {
// console.log("Connecting to Zoho...");
// const transporter = nodemailer.createTransport({
//   host: "smtp.zoho.in",
//   port: 465,
//   secure: true,
//   auth: {
//     user: USER_EMAIL,
//     pass: USER_PASSWORD,
//   },
//   logger: true,
//   debug: true,
//   connectionTimeout: 15000,
// });
// console.log("Transporter created, sending...");
//   /* The `mailOptions` object is being used to define the details of the email that will be sent. Here's
//    a breakdown of its properties: */
//    const currentYear = new Date().getFullYear();
//    const emailHtml=`<!DOCTYPE html>
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
//         <a href="${frontendUrl}/MailVerify?id=${userId}&email=${encodeURIComponent(
//       email
//     )}" class="btn">Verify Email</a>
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
// const emailText=`Hi, ${name} 👋

// Thanks for signing up! Let’s get your email verified so you can start enjoying all the perks.

// Click the link below to verify your email:
// ${frontendUrl}/MailVerify?id=${userId}&email=${encodeURIComponent(email)}

//  We’re excited to have you on board!

// Need help? Contact us at: support@messmate.co.in
// Messmate © ${currentYear} | All rights reserved.`;
//   const mailOptions = {
//     from: `"Messmate" <${USER_EMAIL}>`,
//     to: email,
//     subject: "Email Verification for Messmate User",
//     // html: '<h3>Hi, ' + name + ' Click <a href="https://easypg-react-client.onrender.com/MailVerify?id=' + userId + '">here</a> to verify you email </h3>'
//     //    html: `<h3>Hi, ${name}. Click <a href="${frontendUrl}/MailVerify?id=${userId}&email=${encodeURIComponent(email)}">here</a> to verify your email.</h3>`
//     html: emailHtml,
//     text: emailText,
//   };
// try {
//   console.log("Attempting to send email via Zoho...");
//   const result = await transporter.sendMail(mailOptions);
//   console.log("Email has been sent successfully:", result.response);
//   return true; // ✅ always return something to avoid hanging
// } catch (error) {
//   console.error("Error while sending email:", error);
//   return false;
// }

// }

// module.exports = sendmail;
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const USER_EMAIL = process.env.USER_EMAIL;
// const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";
// const { refreshZohoToken } = require("../controllers/zohoAuthController");
// const ZohoToken = require("../modules/zohoToken");

// async function sendmail(name, email, userId) {
//   try {
//     console.log("📡 Checking Zoho token...");

//     // 🔹 Get the latest token from DB
//     let tokenData = await ZohoToken.findOne().sort({ updatedAt: -1 });
//     if (!tokenData) throw new Error("No Zoho token found in database");

//     // 🔹 Check if expired
//     if (tokenData.isExpired()) {
//       console.log("⚠️ Zoho access token expired — refreshing...");
//       const req = { query: { secret: process.env.ZOHO_CRON_SECRET } };
//       const res = {
//         status: () => ({ json: () => {} }),
//         json: () => {},
//       };
//       await refreshZohoToken(req, res);

//       // Fetch the updated token
//       tokenData = await ZohoToken.findOne().sort({ updatedAt: -1 });
//       console.log(
//         "✅ Token refreshed successfully at:",
//         tokenData.last_updated
//       );
//     }

//     console.log("🚀 Creating transporter...");
//     const transporter = nodemailer.createTransport({
//       host: "smtp.zoho.in",
//       port: 465,
//       secure: true,
//       auth: {
//         type: "OAuth2",
//         user: USER_EMAIL,
//         accessToken: tokenData.access_token,
//         clientId: process.env.ZOHO_CLIENT_ID,
//         clientSecret: process.env.ZOHO_CLIENT_SECRET,
//         refreshToken: tokenData.refresh_token,
//       },
//       logger: true,
//       debug: true,
//       connectionTimeout: 50000,
//     });

//     const currentYear = new Date().getFullYear();
//     const emailHtml = `<!DOCTYPE html>
//  <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
//    <head>
//      <meta charset="UTF-8" />
//      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//      <title>Verify Your Email</title>
//      <link
//        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
//        rel="stylesheet"
//      />
//      <style>
//        body {
//          margin: 0;
//          padding: 0;
//          background-color: #ffffff;
//          font-family: "Montserrat", sans-serif;
//          -webkit-font-smoothing: antialiased;
//        }
//        .email-container {
//          max-width: 400px;
//          margin: auto;
//          padding: 55px 24px;
//        }
//        .logo {
//          width: 40px;
//          margin-bottom: 24px;
//        }
//        .heading {
//          font-size: 20px;
//          font-weight: 600;
//          text-align: center;
//          color: #000000;
//          margin-bottom: 16px;
//        }
//        .description {
//          font-size: 14px;
//          color: #4b5563;
//          text-align: center;
//          margin-bottom: 30px;
//          line-height: 1.5;
//        }
//        .btn {
//          display: inline-block;
//          background-color: #2ca4b5;
//          color: #ffffff;
//          text-decoration: none;
//          padding: 12px 24px;
//          border-radius: 8px;
//          font-weight: 600;
//          font-size: 14px;
//          transition: opacity 0.3s ease;
//        }
//        .btn:hover {
//          background-color: #208696;
//        }
//        .team-msg {
//          text-align: left;
//          font-size: 14px;
//          color: #4b5563;
//          margin-top: 40px;
//          line-height: 1.5;
//        }
//        .footer-box {
//          background-color: #dbdbdb;
//          border-radius: 12px;
//          margin-top: 40px;
//          padding: 20px;
//          text-align: center;
//          font-size: 12px;
//          color: #6b7280;
//          border: 1px solid #e5e7eb;
//        }
//        .footer-box a {
//          color: #6b7280;
//          text-decoration: underline;
//          transition: color 0.3s ease;
//        }
//        .footer-box a:hover {
//          color: #2563eb;
//        }
//        @media (max-width: 480px) {
//          .email-container {
//            padding: 40px 16px;
//          }
//          .heading {
//            font-size: 18px;
//          }
//          .description {
//            font-size: 13px;
//          }
//          .btn {       
//            box-sizing: border-box;
//          }
//          .logo {
//            width: 36px;
//          }
//          .footer-box {
//            margin-top: 30px;
//            padding: 16px;
//          }
//        }
//      </style>
//    </head
//    <body>
//      <div class="email-container">
//        <div style="text-align: center">
//          <img
//            src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png"
//            alt="MessMate - Company Logo"
//            class="logo"
//          />
//        </div
//        <h1 class="heading">Hi, ${name} 👋</h1
//        <div class="description">
//          Thanks for signing up! Let’s get your email verified so you can start enjoying all the perks.
//        </div
//        <div style="text-align: center; margin: 40px 0;">
//          <a href="${frontendUrl}/MailVerify?id=${userId}&email=${encodeURIComponent(
//       email
//     )}" class="btn">Verify Email</a>
//        </div
//        <div class="team-msg">
//         We’re excited to have you on board!
//        </div
//        <div class="footer-box">
//          <div style="margin-bottom: 8px;">
//            Need help? Contact us anytime at<br/>
//            <a href="mailto:support@messmate.co.in">support@messmate.co.in</a>
//          </div>
//          <div>
//            Messmate © ${currentYear} | All rights reserved.
//          </div>
//        </div>
//      </div>
//    </body>
//  </html>
//  `;

//     const emailText = `Hi, ${name} 👋
// Thanks for signing up! Let’s get your email verified.

// Click the link below to verify your email:
// ${frontendUrl}/MailVerify?id=${userId}&email=${encodeURIComponent(email)}

// We’re excited to have you on board!
// Need help? Contact us at support@messmate.co.in
// Messmate © ${currentYear} | All rights reserved.`;

//     const mailOptions = {
//       from: `"Messmate" <${USER_EMAIL}>`,
//       to: email,
//       subject: "Email Verification for Messmate User",
//       html: emailHtml,
//       text: emailText,
//     };

//     console.log("📧 Sending email...");
//     const result = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully:", result.response);

//     return true;
//   } catch (error) {
//     console.error("❌ Error while sending email:", error);
//     return false;
//   }
// }

// module.exports = sendmail;
const axios = require('axios');
// const nodemailer = require("nodemailer"); // Nodemailer is no longer needed
require("dotenv").config();

const USER_EMAIL = process.env.USER_EMAIL;
const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";
const { refreshZohoToken } = require("../controllers/zohoAuthController");
const ZohoToken = require("../modules/zohoToken");

// BASE URL for Zoho Mail API
const ZOHO_MAIL_BASE_URL = "https://mail.zoho.in/api";

/**
 * Fetches the user's Zoho Mail Account ID using the OAuth Access Token.
 * @param {string} accessToken - Valid Zoho OAuth Access Token.
 * @returns {string} The Zoho Account ID.
 */
async function getZohoAccountId(accessToken) {
    console.log("🔍 Fetching Zoho Account ID...");
    const url = `${ZOHO_MAIL_BASE_URL}/accounts`;
    
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
        },
        timeout: 10000 
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
        // The first account in the list is typically the main account
        const accountId = response.data.data[0].accountId; 
        console.log(`✅ Retrieved Account ID: ${accountId}`);
        return accountId;
    }

    throw new Error("Could not retrieve Zoho Account ID from API. Check OAuth scopes.");
}


async function sendmail(name, email, userId) {
    try {
        console.log("📡 Checking Zoho token...");

        // 🔹 Token Fetch and Refresh Logic (KEPT AS IS)
        let tokenData = await ZohoToken.findOne().sort({ updatedAt: -1 });
        if (!tokenData) throw new Error("No Zoho token found in database");

        if (tokenData.isExpired()) {
            console.log("⚠️ Zoho access token expired — refreshing...");
            const req = { query: { secret: process.env.ZOHO_CRON_SECRET } };
            const res = { status: () => ({ json: () => {} }), json: () => {} };
            await refreshZohoToken(req, res);

            // Fetch the updated token
            tokenData = await ZohoToken.findOne().sort({ updatedAt: -1 });
            console.log(
                "✅ Token refreshed successfully at:",
                tokenData.last_updated
            );
        }

        // 🎯 NEW STEP: Get the correct Account ID
        const accountId = await getZohoAccountId(tokenData.access_token);

        // Final send mail URL uses the retrieved accountId
        const sendMailUrl = `${ZOHO_MAIL_BASE_URL}/accounts/${accountId}/messages`;
        
        // --- Existing HTML and Text generation (KEPT AS IS) ---
        const currentYear = new Date().getFullYear();
           const emailHtml=`<!DOCTYPE html>
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
        <a href="${frontendUrl}/MailVerify?id=${userId}&email=${encodeURIComponent(
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
Thanks for signing up! Let’s get your email verified.

Click the link below to verify your email:
${frontendUrl}/MailVerify?id=${userId}&email=${encodeURIComponent(email)}

We’re excited to have you on board!
Need help? Contact us at support@messmate.co.in
Messmate © ${currentYear} | All rights reserved.`;

    // 💡 1. Construct the Zoho API Payload
    const mailData = {
        fromAddress: `"Messmate" <${USER_EMAIL}>`,
        toAddress: email,
        subject: "Email Verification for Messmate User",
        content: emailHtml, // Zoho API uses 'content' for the HTML body
        mailFormat: 'html', // Specify that the content is HTML
        // Note: Zoho API handles the "from" name based on your account settings
    };

    console.log("🚀 Sending email via Zoho Mail API...");

    // 💡 2. Make the HTTP POST request using Axios
    const result = await axios.post(sendMailUrl, mailData, {
        headers: {
            // Use the valid access token for authorization
            'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`,
            'Content-Type': 'application/json'
        },
        timeout: 20000 // Set a 20-second timeout for the API call
    });


    // 💡 3. Check Response Status
    if (result.status === 200 || result.status === 201) {
        console.log("✅ Email sent successfully via Zoho API:");
        return true;
    } else {
        // This is a catch for unexpected non-error statuses (e.g., 202, 300)
        console.error("Zoho API returned unexpected status:", result.status);
        return false;
    }

  } catch (error) {
    // Catch axios-related errors and handle the API response body if available
    console.error("❌ Error while sending email via Zoho API:", error.response?.data || error.message);
    return false;
  }
}

module.exports = sendmail;
