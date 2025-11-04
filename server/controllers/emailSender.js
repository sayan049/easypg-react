const nodemailer = require("nodemailer");
require("dotenv").config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

async function sendmail(name, email, userId) {
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
const emailText=`Hi, ${name} 👋

Thanks for signing up! Let’s get your email verified so you can start enjoying all the perks.

Click the link below to verify your email:
${frontendUrl}/MailVerify?id=${userId}&email=${encodeURIComponent(email)}

 We’re excited to have you on board!

Need help? Contact us at: support@messmate.co.in
Messmate © ${currentYear} | All rights reserved.`;
  const mailOptions = {
    from: `"Messmate" <${USER_EMAIL}>`,
    to: email,
    subject: "Email Verification for Messmate User",
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

module.exports = sendmail;
