import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shipping Policy</h1>
      <p className="mb-4">
        <strong>Note:</strong> Messmate is a digital service platform and does not deal with the shipping or delivery of physical goods.
      </p>
      <p className="mb-4">
        All services provided by Messmate are rendered electronically through our website and/or mobile applications. As such, there is no shipping involved.
      </p>
      <p className="mb-4">
        Upon successful booking confirmation, the user is notified instantly via the website interface, email, or other communication methods. Users are responsible for reporting any discrepancies within 24 hours.
      </p>
      <p>
        If you have any questions regarding our policies, feel free to reach out to us at <a href="mailto:messmatecompany@gmail.com" className="text-blue-600 underline">messmatecompany@gmail.com</a>.
      </p>
    </div>
  );
};

export default ShippingPolicy;
