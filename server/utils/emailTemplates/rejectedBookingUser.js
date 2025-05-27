module.exports = function rejectedBookingUser({ pg_name, request_id, host_message, browse_link,  contact_us, privacy_policy, terms_of_service }) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Declined</title>
    <style type="text/css">
      @media only screen and (max-width: 600px) {
        .container {
          padding: 15px 10px !important;
        }
        .main-card {
          padding: 25px 15px !important;
          border-radius: 12px !important;
        }
        .header-img {
          width: 35px !important;
        }
        .grid-2 {
          grid-template-columns: 1fr !important;
          gap: 12px !important;
        }
        .cta-button {
          padding: 12px 16px !important;
          font-size: 14px !important;
        }
        .footer-links a {
          display: block !important;
          margin: 8px 0 !important;
        }
        h1 {
          font-size: 22px !important;
          line-height: 1.3 !important;
        }
        .rejection-details {
          padding: 12px !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background: #f8fafc;">
    <div class="container" style="max-width: 600px; margin: auto; padding: 40px 20px">
      <div style="text-align: center; margin-bottom: 30px">
        <img src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748370229/png_company_xskvfs.png" alt="MessMate" class="header-img" style="width: 40px; max-width: 100%; padding: 4px" />
      </div>

      <div class="main-card" style="background: #ffffff; border-radius: 16px; padding: 40px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 24px">
          <div style="background: #fee2e2; color: #dc2626; padding: 8px 24px; border-radius: 24px; display: inline-block; font-size: 14px; font-weight: 600;">
            ❌ BOOKING REJECTED
          </div>
        </div>

        <h1 style="font-size: 28px; color: #7f1d1d; text-align: center; margin: 0 0 24px 0;">
          Request Not Accepted
        </h1>

        <div class="timeline-container" style="margin-bottom:32px;width:100%;">
          <div class="timeline-steps" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; position: relative; padding: 0 8px;">
            <div class="timeline-step" style="flex:1;min-width:0;text-align:center;position:relative;">
              <div style="position:relative;z-index:1;">
                <div style="width:32px;height:32px;background:#2563eb;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;font-weight:600;">1</div>
                <div style="color:#2563eb;font-size:14px;margin-top:8px;font-weight:500;">Request Sent</div>
              </div>
              <div style="position:absolute;top:16px;left:50%;right:-50%;height:2px;background:#2563eb;z-index:0;"></div>
            </div>

            <div class="timeline-step" style="flex:1;min-width:0;text-align:center;position:relative;">
              <div style="position:relative;z-index:1;">
                <div style="width:32px;height:32px;background:#2563eb;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:14px;font-weight:600;">2</div>
                <div style="color:#2563eb;font-size:14px;margin-top:8px;font-weight:500;">Owner Approval</div>
              </div>
              <div style="position:absolute;top:16px;left:50%;right:-50%;height:2px;background:#dc2626;z-index:0;"></div>
            </div>

            <div class="timeline-step" style="flex:1;min-width:0;text-align:center;position:relative;">
              <div style="position:relative;z-index:1;">
                <div style="width:32px;height:32px;background:#dc2626;border-radius:50%;color:#fff;line-height:32px;margin:0 auto;font-size:16px;font-weight:bold;">✖</div>
                <div style="color:#dc2626;font-size:14px;margin-top:8px;font-weight:500;">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        <div class="rejection-details" style="background: #fef2f2; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #fecaca;">
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
          <a href="${browse_link}" class="cta-button" style="display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); transition: all 0.2s ease;">
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
        <div>MessMate © ${new Date().getFullYear()} | All Rights Reserved</div>
        <div style="margin-top: 12px; font-size: 12px; color: #94a3b8">This is an automated message</div>
      </div>
    </div>
  </body>
</html>
`;
};
