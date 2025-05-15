import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shipping & Delivery </h1>
      <p className="mb-4">
        Messmate is a digital platform facilitating online bookings for student accommodations and does not handle physical shipping or delivery of goods.
      </p>
      <p className="mb-4">
        For domestic and international services, all bookings and confirmations are processed electronically via our website and mobile applications.
      </p>
      <p className="mb-4">
        Upon successful booking confirmation, users receive notifications through email and/or the website interface.  
        Please ensure your contact details are accurate to avoid any delays.
      </p>
      <p className="mb-4">
        Messmate is not liable for any delay or failure in service delivery caused by third parties, including property owners or communication services.
      </p>
      <p className="mb-4">
        For any issues or questions regarding your booking or our services, please contact our support team:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Email: <a href="mailto:messmatecompany@gmail.com" className="text-blue-600 underline">messmatecompany@gmail.com</a></li>
        <li>Phone: <a href="tel:+917047299455" className="text-blue-600 underline">+91 70472 99455</a></li>
      </ul>
      <p>
        Last updated on May 15, 2025.
      </p>
    </div>
  );
};

export default ShippingPolicy;
