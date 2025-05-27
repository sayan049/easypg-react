module.exports = function confirmedBookingUserTemplate({
  pg_name,
  checkin_date,
  total_amount,
  host_name,
  host_phone,
  booking_id,
  contact_us,
  privacy_policy,
  terms_of_service,
  cancellation_policy,
  calendar_link,
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed</title>
    <style type="text/css">
        @media only screen and (max-width: 600px) {
            .container { padding: 20px 15px !important; }
            .main-card { padding: 25px 15px !important; border-radius: 12px !important; }
            
            .grid-2 { 
                grid-template-columns: 1fr !important;
                gap: 12px !important;
            }
            
            .timeline-container { 
                overflow-x: auto;
                padding-bottom: 10px;
                -webkit-overflow-scrolling: touch;
            }
            
            .timeline-steps { 
                min-width: 500px;
                padding: 0 15px;
            }
            
            .timeline-step {
                width: 28px !important;
                height: 28px !important;
                line-height: 28px !important;
                font-size: 12px !important;
            }
            
            .timeline-text {
                font-size: 10px !important;
                white-space: nowrap;
            }
            
            h1 { 
                font-size: 22px !important;
                line-height: 1.3 !important;
            }
            
            .cta-button {
                padding: 12px 20px !important;
               
                font-size: 14px !important;
            }
            
            .host-card {
                padding: 12px !important;
                flex-direction: column !important;
                text-align: center !important;
            }
            
            .host-card div:first-child {
                margin-bottom: 12px !important;
            }
            
            .footer-links a {
                display: block !important;
                margin: 8px 0 !important;
                font-size: 13px !important;
            }
        }
    </style>
</head>
<body style="margin:0;padding:0;font-family:'Montserrat',Arial,sans-serif;background:#f8fafc;">
    <div
      class="container"
      style="max-width: 600px; margin: auto; padding: 40px 20px"
    >
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px">
        <img
          src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png"
          alt="MessMate"
          style="width: 40px; max-width: 100%; padding: 4px"
        />
      </div>

      <!-- Main Card -->
      <div
        class="main-card"
        style="
          background: #ffffff;
          border-radius: 16px;
          padding: 40px;
          border: 2px solid #2563eb;
        "
      >
        <!-- Status Badge -->
        <div style="text-align: center; margin-bottom: 24px">
          <div
            style="
              background: #d1fae5;
              color: #2563eb;
              padding: 8px 24px;
              border-radius: 24px;
              display: inline-block;
              font-size: 14px;
              font-weight: 600;
            "
          >
            🎉 BOOKING CONFIRMED
          </div>
        </div>

        <h1
          style="
            font-size: 28px;
            color: #1e3a8a;
            text-align: center;
            margin: 0 0 24px 0;
          "
        >
          Welcome to ${pg_name}!
        </h1>

        <!-- Color Blocks -->
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
                    <div style="color:#3b82f6;font-size:14px;">Booking ID</div>
                    <div style="color:#1e3a8a;font-size:16px;font-weight:600;">${booking_id}</div>
                </div>
            </div>


        <!-- Timeline -->
        <div style="margin-bottom: 32px; position: relative">
          <div
            style="
              height: 2px;
              background: #dbeafe;
              position: absolute;
              top: 16px;
              left: 0;
              right: 0;
            "
          ></div>
          <div style="display: flex; justify-content: space-between">
            <div
              style="
                text-align: center;
                z-index: 1;
                flex: 1;
                min-width: 70px;
                padding: 0 5px;
              "
            >
              <div
                class="timeline-step"
                style="
                  width: 32px;
                  height: 32px;
                  background: #2563eb;
                  border-radius: 50%;
                  color: #fff;
                  line-height: 32px;
                  margin: 0 auto;
                "
              >
                1
              </div>
              <div
                class="timeline-text"
                style="color: #2563eb; font-size: 14px; margin-top: 8px"
              >
                Request Sent
              </div>
            </div>
            <div
              style="
                text-align: center;
                z-index: 1;
                flex: 1;
                min-width: 70px;
                padding: 0 5px;
              "
            >
              <div
                class="timeline-step"
                style="
                  width: 32px;
                  height: 32px;
                  background: #2563eb;
                  border-radius: 50%;
                  color: #fff;
                  line-height: 32px;
                  margin: 0 auto;
                "
              >
                2
              </div>
              <div
                class="timeline-text"
                style="color: #2563eb; font-size: 14px; margin-top: 8px"
              >
                Owner Approval
              </div>
            </div>
            <div
              style="
                text-align: center;
                z-index: 1;
                flex: 1;
                min-width: 70px;
                padding: 0 5px;
              "
            >
              <div
                class="timeline-step"
                style="
                  width: 32px;
                  height: 32px;
                  background: #2563eb;
                  border-radius: 50%;
                  color: #fff;
                  line-height: 32px;
                  margin: 0 auto;
                "
              >
                3
              </div>
              <div
                class="timeline-text"
                style="color: #2563eb; font-size: 14px; margin-top: 8px"
              >
                Confirmed
              </div>
            </div>
            <div
              style="
                text-align: center;
                z-index: 1;
                flex: 1;
                min-width: 70px;
                padding: 0 5px;
              "
            >
              <div
                class="timeline-step"
                style="
                  width: 32px;
                  height: 32px;
                  background: #93c5fd;
                  border-radius: 50%;
                  color: #fff;
                  line-height: 32px;
                  margin: 0 auto;
                "
              >
                4
              </div>
              <div
                class="timeline-text"
                style="color: #3b82f6; font-size: 14px; margin-top: 8px"
              >
                Check-in
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0">
          <a
            href="${calendar_link}"
            class="cta-button"
            target="_blank"
            style="
              display: inline-block;
              background: #2563eb;
              color: #ffffff;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
            "
          >
            Add To Calendar
          </a>
        </div>

        <!-- Host Card -->
        <div
          class="host-card"
          style="
            background: #f0f9ff;
            border-radius: 12px;
            padding: 16px;
            margin: 24px 0;
            border: 1px solid #7dd3fc;
          "
        >
          <div style="display: flex; align-items: center; gap: 16px">
            <div
              style="
                width: 48px;
                height: 48px;
                background: #0ea5e9;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 20px;
              "
            >
              👤
            </div>
            <div>
              <div style="color: #0c4a6e; font-weight: 600">
                PG Owner: ${host_name}
              </div>
              <div style="color: #0284c7">📞 ${host_phone}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        style="
          text-align: center;
          padding: 32px 0;
          color: #64748b;
          font-size: 14px;
        "
      >
        <div style="margin-bottom: 16px">
          <a
            href="${contact_us}"
            style="color: #2563eb; text-decoration: none; margin: 0 12px"
            >Contact Us</a
          >
          <a
            href="${privacy_policy}"
            style="color: #2563eb; text-decoration: none; margin: 0 12px"
            >Privacy</a
          >
          <a
            href="${terms_of_service}"
            style="color: #2563eb; text-decoration: none; margin: 0 12px"
            >Terms</a
          >
          <a
            href="${cancellation_policy}"
            style="color: #2563eb; text-decoration: none; margin: 0 12px"
            >Cancellation</a
          >
        </div>
        <div>MessMate © ${new Date().getFullYear()}</div>
        <div style="margin-top: 12px; font-size: 12px; color: #94a3b8">
          This is an automated message
        </div>
      </div>
    </div>
  </body>
</html>

`;
};
