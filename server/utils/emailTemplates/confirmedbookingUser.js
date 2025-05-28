const nodemailer = require("nodemailer");
require("dotenv").config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";

async function sendMailConfirmedBooking(email,pg_name,checkin_date,total_amount,room_no,beds_booked,booking_id,calendar_link,host_name,host_phone,contact_us,privacy_policy,terms_of_service,cancellation_policy) {
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
    <title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;font-family:'Montserrat',Arial,sans-serif;background:#f8fafc;">
    <div style="max-width:600px;margin:0 auto;padding:20px;width:100%;box-sizing:border-box;">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:30px;">
            <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png" 
                 alt="MessMate" 
                 style="width:40px;max-width:100%;padding:4px;height:auto;">
        </div>

        <!-- Main Card -->
        <div style="background:#ffffff;border-radius:16px;padding:25px;border:2px solid #2563eb;margin:0 auto;">
            <!-- Status Badge -->
            <div style="text-align:center;margin-bottom:24px;">
                <div style="background:#d1fae5;color:#2563eb;padding:8px 24px;border-radius:24px;display:inline-block;font-size:14px;font-weight:600;max-width:280px;">
                    🎉 BOOKING CONFIRMED
                </div>
            </div>

            <h1 style="font-size:24px;color:#1e3a8a;text-align:center;margin:0 0 24px 0;line-height:1.3;">
                Welcome to ${pg_name}!
            </h1>

            <!-- Details Grid -->
            <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:32px;">
                <div style="background:#eff6ff;border-radius:12px;padding:16px;border:1px solid #bfdbfe;flex:1;min-width:200px;">
                    <div style="color:#3b82f6;font-size:14px;">Check-in Date</div>
                    <div style="color:#1e3a8a;font-size:16px;font-weight:600;">${checkin_date}</div>
                </div>
                <div style="background:#eff6ff;border-radius:12px;padding:16px;border:1px solid #bfdbfe;flex:1;min-width:200px;">
                    <div style="color:#3b82f6;font-size:14px;">Monthly Rent</div>
                    <div style="color:#1e3a8a;font-size:16px;font-weight:600;">₹${total_amount}/month</div>
                </div>
                <div style="background:#eff6ff;border-radius:12px;padding:16px;border:1px solid #bfdbfe;flex:1;min-width:200px;">
                    <div style="color:#3b82f6;font-size:14px;">Room</div>
                    <div style="color:#1e3a8a;font-size:16px;font-weight:600;">${room_no}</div>
                </div>
                <div style="background:#eff6ff;border-radius:12px;padding:16px;border:1px solid #bfdbfe;flex:1;min-width:200px;">
                    <div style="color:#3b82f6;font-size:14px;">Total Beds Booked</div>
                    <div style="color:#1e3a8a;font-size:16px;font-weight:600;">${beds_booked}</div>
                </div>
                <div style="background:#eff6ff;border-radius:12px;padding:16px;border:1px solid #bfdbfe;flex:1;min-width:200px;">
                    <div style="color:#3b82f6;font-size:14px;">Booking ID</div>
                    <div style="color:#1e3a8a;font-size:16px;font-weight:600;">${booking_id}</div>
                </div>
            </div>

            <!-- Timeline -->
            <div style="margin-bottom:32px;position:relative;overflow-x:auto;">
                <div style="display:flex;justify-content:space-between;min-width:400px;position:relative;padding:0 15px;">
                    <div style="flex:1;text-align:center;min-width:80px;">
                        <div style="width:32px;height:32px;background:#2563eb;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;">1</div>
                        <div style="color:#2563eb;font-size:12px;margin-top:8px;">Request Sent</div>
                    </div>
                    <div style="flex:1;text-align:center;min-width:80px;">
                        <div style="width:32px;height:32px;background:#2563eb;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;">2</div>
                        <div style="color:#2563eb;font-size:12px;margin-top:8px;">Approval</div>
                    </div>
                    <div style="flex:1;text-align:center;min-width:80px;">
                        <div style="width:32px;height:32px;background:#2563eb;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;">3</div>
                        <div style="color:#2563eb;font-size:12px;margin-top:8px;">Confirmed</div>
                    </div>
                    <div style="flex:1;text-align:center;min-width:80px;">
                        <div style="width:32px;height:32px;background:#93c5fd;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;">4</div>
                        <div style="color:#3b82f6;font-size:12px;margin-top:8px;">Check-in</div>
                    </div>
                </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align:center;margin:32px 0;">
                <a href="${calendar_link}" 
                   style="display:block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:8px;font-weight:600;max-width:280px;margin:0 auto;font-size:14px;">
                    Add To Calendar
                </a>
            </div>

            <!-- Host Card -->
            <div style="background:#f0f9ff;border-radius:12px;padding:16px;margin:24px 0;border:1px solid #7dd3fc;text-align:center;">
                <div style="display:inline-block;width:48px;height:48px;background:#0ea5e9;border-radius:8px;line-height:48px;color:#fff;font-size:20px;">👤</div>
                <div style="margin-top:12px;">
                    <div style="color:#0c4a6e;font-weight:600;">PG Owner: ${host_name}</div>
                    <div style="color:#0284c7;">📞 ${host_phone}</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align:center;padding:32px 0;color:#64748b;font-size:14px;">
            <div style="margin-bottom:16px;">
                <a href="${contact_us}" style="color:#2563eb;text-decoration:none;display:block;margin:8px 0;">Contact Us</a>
                <a href="${privacy_policy}" style="color:#2563eb;text-decoration:none;display:block;margin:8px 0;">Privacy</a>
                <a href="${terms_of_service}" style="color:#2563eb;text-decoration:none;display:block;margin:8px 0;">Terms</a>
                <a href="${cancellation_policy}" style="color:#2563eb;text-decoration:none;display:block;margin:8px 0;">Cancellation</a>
            </div>
            <div>Messmate © ${currentYear}</div>
            <div style="margin-top:12px;font-size:12px;color:#94a3b8;">
                This is an automated message
            </div>
        </div>
    </div>
</body>
</html>
`;
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
  const mailOptions = {
    from: USER_EMAIL,
    to: email,
    subject: "Booking Confirmed – Messmate",
   
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

module.exports = sendMailConfirmedBooking;
