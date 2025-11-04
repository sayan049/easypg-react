const User = require("../modules/user");
const pgProvider = require("../modules/pgProvider");
const OTP = require("../modules/otp");
const nodemailer = require("nodemailer");
require("dotenv").config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const existingProvider = await pgProvider.findOne({ email });
  const existingUser = await User.findOne({ email });
  if (existingProvider || existingUser) {
    return res.status(400).json({ error: "Email already exists" });

  }
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in", // or smtp.zoho.com (if not India-based)
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  },
});

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const currentYear = new Date().getFullYear();
  const emailHtmlOtp=`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your OTP</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
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
      .otp-box {
        background: #d2e8eb;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        margin: 40px 0;
        font-weight: 600;
        font-size: 24px;
        letter-spacing: 2px;
        color: #2563eb;
        border: 1px solid #e5e7eb;
      }
      .security-note {
        font-size: 12px;
        color: #6b7280;
        text-align: center;
        margin: 25px 0;
        padding: 0 20px;
      }
      .team-msg {
        text-align: left;
        font-size: 14px;
        color: #4b5563;
        margin-top: 40px;
        line-height: 1.5;
      }
      .footer-box {
        background-color: #dddddd;
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
      .warning-icon {
        width: 20px;
        vertical-align: middle;
        margin-right: 8px;
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
        .otp-box {
          font-size: 20px;
          padding: 16px;
          margin: 30px 0;
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

      <h1 class="heading">Secure OTP Verification 🔒</h1>

      <div class="description">
        For your security, we've sent a One-Time Password (OTP) to verify your identity. 
        This code will expire in 5 minutes.
      </div>

      <div class="otp-box">
         ${code} 
      </div>

      <div class="security-note">
        <img src="https://img.icons8.com/fluency/48/000000/security-checked.png" class="warning-icon" width="20" alt="warning">
        Never share this code with anyone. Messmate will never ask for your OTP.
      </div>

      <div class="team-msg">
        Best,<br />
        The Messmate Security Team
      </div>

      <div class="footer-box">
        <div style="margin-bottom: 8px;">
          Need assistance? Contact our support team at<br/>
          <a href="mailto:support@messmate.co.in">support@messmate.co.in</a>
        </div>
        <div>
          Messmate © ${currentYear} | All rights reserved.<br/>
          <a href="https://messmate.co.in/privacy">Privacy Policy</a> |
          <a href="https://messmate.co.in/terms">Terms of Service</a>
        </div>
      </div>
    </div>
  </body>
</html>`;
const plainTextOtp=`Secure OTP Verification 🔒

For your security, we've sent a One-Time Password (OTP) to verify your identity. 
This code will expire in 5 minutes.

Your OTP code: ${code}

⚠️ Never share this code with anyone. Messmate will never ask for your OTP.

Best,  
The Messmate Security Team

–––––––––––––––––––––––––––––––––––

Need assistance? Contact our support team at: support@messmate.co.in

Messmate © ${currentYear} | All rights reserved.  
Privacy Policy: https://messmate.co.in/privacy  
Terms of Service: https://messmate.co.in/terms
`
  try {
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, code });

    // Send OTP via email
    await transporter.sendMail({
      from: `"Messmate" <${USER_EMAIL}>`,
      to: email,
      subject: "OTP Verification - Messmate",
      html: emailHtmlOtp,
      text: plainTextOtp,
    });

    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: "Email and OTP are required" });

  const record = await OTP.findOne({ email });

  if (!record)
    return res.status(400).json({ error: "OTP not found or expired" });
  if (record.attempts >= 3)
    return res.status(403).json({ error: "Maximum attempts exceeded" });

  if (record.code !== otp) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({ error: "Invalid OTP" });
  }

  await OTP.deleteOne({ _id: record._id }); // Delete on success
  res.status(200).json({ message: "OTP verified" });
};

module.exports = {
  sendOtp,
  verifyOtp,
};
