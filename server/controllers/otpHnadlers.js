const User = require("../modules/user");
const pgProvider = require("../modules/pgProvider");
const OTP = require("../modules/otp");
const nodemailer = require("nodemailer");

const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const existingProvider = await pgProvider.findOne({ email });
  if (existingProvider) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const code = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, code });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${code}. It will expire in 5 minutes.`,
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
