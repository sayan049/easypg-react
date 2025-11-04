import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Shipping & Delivery Policy</h1>

      <p className="mb-4">
        Messmate is a digital platform dedicated to facilitating online bookings
        for student accommodations. We do not ship or deliver physical goods.
      </p>

      <p className="mb-4">
        All services are processed electronically through our website and mobile
        application. Upon successful booking, confirmation details are delivered
        via email and/or displayed in your account dashboard.
      </p>

      <p className="mb-4">
        Please ensure your email address and contact number are accurate and
        up-to-date to avoid delays in communication or booking confirmation.
      </p>

      <p className="mb-4">
        Messmate is not responsible for service delays or failures caused by
        third parties such as property owners, network providers, or technical
        issues.
      </p>

      <p className="mb-4">
        If you experience any issues related to bookings or service access,
        please reach out to our support team:
      </p>

      <ul className="list-disc list-inside mb-4">
        <li>
          Email:{" "}
          <a
            href="mailto:support@messmate.co.in"
            className="text-blue-600 underline"
          >
            support@messmate.co.in
          </a>
        </li>
        <li>
          Phone:{" "}
          <a href="tel:+917479170108" className="text-blue-600 underline">
            +91 7479170108
          </a>
        </li>
      </ul>

      <p className="text-sm text-gray-600">Last updated: May 15, 2025</p>
    </div>
    // <div className="p-6 max-w-3xl mx-auto">
    //   <h1 className="text-2xl font-bold mb-4">Shipping & Delivery </h1>
    //   <p className="mb-4">
    //     Messmate is a digital platform facilitating online bookings for student accommodations and does not handle physical shipping or delivery of goods.
    //   </p>
    //   <p className="mb-4">
    //     For domestic and international services, all bookings and confirmations are processed electronically via our website and mobile applications.
    //   </p>
    //   <p className="mb-4">
    //     Upon successful booking confirmation, users receive notifications through email and/or the website interface.
    //     Please ensure your contact details are accurate to avoid any delays.
    //   </p>
    //   <p className="mb-4">
    //     Messmate is not liable for any delay or failure in service delivery caused by third parties, including property owners or communication services.
    //   </p>
    //   <p className="mb-4">
    //     For any issues or questions regarding your booking or our services, please contact our support team:
    //   </p>
    //   <ul className="list-disc list-inside mb-4">
    //     <li>Email: <a href="mailto:messmatecompany@gmail.com" className="text-blue-600 underline">messmatecompany@gmail.com</a></li>
    //     <li>Phone: <a href="tel:+917047299455" className="text-blue-600 underline">+91 70472 99455</a></li>
    //   </ul>
    //   <p>
    //     Last updated on May 15, 2025.
    //   </p>
    // </div>
  );
};

export default ShippingPolicy;
