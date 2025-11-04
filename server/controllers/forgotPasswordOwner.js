const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../modules/pgProvider");
require("dotenv").config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

const forgotPasswordUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that the user does not exist
      return res
        .status(200)
        .json({
          message: "If your email exists, a password reset email will be sent.",
        });
    }

    // Check if user is verified
    if (!user.is_verified_Owner) {
      return res.status(403).json({ message: "User account is not verified." });
    }
    if (user.googleId) {
      return res
        .status(400)
        .json({
          message:
            "You cannot reset your password because you signed up with Google.",
        });
    }
    // Generate a reset token with JWT (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set up email transport
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in", // or smtp.zoho.com (if not India-based)
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  },
});

    // Construct reset URL for the user
    const resetUrl = `${frontendUrl}/login/owner?resetToken=${resetToken}`;
    const currentYear = new Date().getFullYear();
    const htmlResetUrl = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset Request</title>
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
        margin: 20px 0;
      }
      .btn:hover {
        background-color: #208696;
      }
      .expiry-notice {
        color: #dc2626;
        font-size: 13px;
        text-align: center;
        margin: 15px 0;
        font-weight: 500;
        line-height: 1.5;
        
      }
      .manual-link {
        font-size: 12px;
        color: #6b7280;
        text-align: center;
        word-break: break-all;
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
        background-color: #e0e1e4;
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
      .security-note {
        font-size: 12px;
        color: #6b7280;
        text-align: center;
        margin: 25px 0 15px;
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

      <h1 class="heading">Reset Your Password 🔑</h1>

      <div class="description">
        We received a request to reset your Messmate account password. Click the button below to set up a new password.
      </div>

      <div style="text-align: center;">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </div>

      <div class="expiry-notice">
        ⏳ This link will expire in 1 hour
      </div>

     

      <div class="manual-link">
        If the button doesn't work, copy and paste this link in your browser:<br/>
        <a href="${resetUrl}">{{ reset_link }}</a>
      </div>

      <div class="team-msg">
        Best,<br />
        The Messmate Security Team
      </div>

      <div class="footer-box">
        <div style="margin-bottom: 8px;">
          Need help with your account? Contact us at<br/>
          <a href="mailto:support@messmate.co.in">support@messmate.co.in</a>
        </div>
        <div>
          Messmate © ${currentYear} | All rights reserved<br/>
           <a href="https://messmate.co.in/privacy">Privacy Policy</a> |
          <a href="https://messmate.co.in/terms">Terms of Service</a>
        </div>
      </div>
    </div>
  </body>
</html>`;
    const textResetUrl = `Reset Your Password 🔑



We received a request to reset your Messmate account password.

Click the link below to set a new password:  
${resetUrl}

⏳ This link will expire in 1 hour.

If the button doesn't work, copy and paste this link into your browser:  
${resetUrl}

Best,  
The Messmate Security Team

–––––––––––––––––––––––––––––––––––

Need help with your account? Contact us at: support@messmate.co.in

Messmate © ${currentYear} | All rights reserved  
Privacy Policy: https://messmate.co.in/privacy  
Terms of Service: https://messmate.co.in/terms
`;

    const mailOptions = {
      from: `"Messmate" <${USER_EMAIL}>`,
      to: email,
      subject: "Reset Your Messmate Owner Account Password",
      html: htmlResetUrl,
      text: textResetUrl,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent to the user" });
  } catch (error) {
    console.error("Error in forgotPasswordUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = forgotPasswordUser;
