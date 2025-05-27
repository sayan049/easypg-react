module.exports = function bookingRequestOwnerTemplate({
  guest_name,
  guest_phone,

  booking_id,
  checkin_date,
  duration,
  requested_price,
  pg_name,
  pg_address,

  dashboard_link,
  terms_link,
  privacy_link,

  expiry_date,
}) {
  return {
    subject: "🔔 New Booking Request - Messmate",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Request</title>
</head>
<body style="margin:0;padding:0;font-family:'Montserrat',Arial,sans-serif;background:#ffffff;">
  <div style="max-width:600px;margin:auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png" alt="MessMate" style="width:40px;">
    </div>

    <div style="background:#ffffff;border-radius:12px;padding:40px;border:1px solid #e5e7eb;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="background:#f3f4f6;color:#1e40af;padding:8px 16px;border-radius:20px;display:inline-block;font-size:14px;font-weight:600;">
          NEW BOOKING REQUEST
        </div>
      </div>

      <h1 style="font-size:24px;color:#111827;text-align:center;margin:0 0 24px 0;">
        New Booking Alert! 🛎️
      </h1>

      <div style="margin-bottom:32px;">
        <h2 style="font-size:16px;color:#374151;margin:0 0 12px 0;">Guest Information</h2>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;">
          <div style="margin-bottom:8px;">
            <span style="color:#6b7280;font-size:14px;">Name:</span>
            <span style="color:#111827;font-weight:500;">${guest_name}</span>
          </div>
          <div style="margin-bottom:8px;">
            <span style="color:#6b7280;font-size:14px;">Contact:</span>
            <span style="color:#111827;font-weight:500;">${guest_phone}</span>
          </div>

        </div>
      </div>

      <div style="margin-bottom:32px;">
        <h2 style="font-size:16px;color:#374151;margin:0 0 12px 0;">Booking Details</h2>
        <div style="display:grid;grid-template-columns:repeat(1,1fr);gap:12px;">
          <div style="background:#f9fafb;border-radius:8px;padding:16px;">
            <div style="color:#6b7280;font-size:14px;">Booking ID</div>
            <div style="color:#111827;font-weight:600;">${booking_id}</div>
          </div>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;">
            <div style="color:#6b7280;font-size:14px;">Check-in Date</div>
            <div style="color:#111827;font-weight:600;">${checkin_date}</div>
          </div>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;">
            <div style="color:#6b7280;font-size:14px;">Duration</div>
            <div style="color:#111827;font-weight:600;">${duration} months</div>
          </div>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;">
            <div style="color:#6b7280;font-size:14px;">Requested Price</div>
            <div style="color:#111827;font-weight:600;">₹${requested_price}/mo</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom:32px;">
        <h2 style="font-size:16px;color:#374151;margin:0 0 12px 0;">Your Property</h2>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;">
          <div style="margin-bottom:8px;">
            <span style="color:#6b7280;font-size:14px;">PG Name:</span>
            <span style="color:#111827;font-weight:500;">${pg_name}</span>
          </div>
          <div>
            <span style="color:#6b7280;font-size:14px;">Address:</span>
            <span style="color:#111827;font-weight:500;">${pg_address}</span>
          </div>
        </div>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${dashboard_link}" style="display:inline-block;background:#1e40af;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
          View in Dashboard
        </a>
      </div>

      <div style="text-align:center;color:#6b7280;font-size:14px;margin-top:24px;">
        Please respond within 24 hours to maintain your response rate
      </div>
    </div>

    <div style="text-align:center;padding:32px 0;color:#6b7280;font-size:12px; background-color: #dbdbdb;
    border-radius: 10px;">
      <div style="margin-bottom:10px;">
        <a href="${terms_link}" style="color:#6b7280;text-decoration:none;margin:0 8px;">Terms</a>
        <a href="${privacy_link}" style="color:#6b7280;text-decoration:none;margin:0 8px;">Privacy</a>
      
      </div>
      <div>Messmate © ${new Date().getFullYear()}
 | All Rights Reserved</div>
      <div style="margin-top:8px;">This request expires on ${expiry_date}</div>
    </div>
  </div>
</body>
</html>`,
  };
};
