import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p>
        Welcome to Messmate. By accessing or using our platform, you agree to
        be bound by these Terms and Conditions. Please read them carefully.
      </p>

      <h2 className="text-2xl mt-6 mb-2">1. Use of Service</h2>
      <p>
        You agree to use Messmate only for lawful purposes and in a way that
        does not infringe the rights of others.
      </p>

      <h2 className="text-2xl mt-6 mb-2">2. Account Responsibility</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activities under your account.
      </p>

      <h2 className="text-2xl mt-6 mb-2">3. Booking & Payment</h2>
      <p>
        All bookings made through Messmate are subject to availability. Payment
        must be completed using authorized payment methods. Messmate is not
        responsible for payment disputes between tenants and owners.
      </p>

      <h2 className="text-2xl mt-6 mb-2">4. Service Fee</h2>
      <p>
        Messmate charges a service fee (currently 2%) on all transactions,
        which is non-refundable.
      </p>

      <h2 className="text-2xl mt-6 mb-2">5. Cancellation & Refunds</h2>
      <p>
        Cancellation policies are governed by the owners. Messmate acts as a
        facilitator only. Please refer to the Cancellation & Refunds page for
        details.
      </p>

      <h2 className="text-2xl mt-6 mb-2">6. Limitation of Liability</h2>
      <p>
        Messmate is not liable for any loss or damages arising from use of the
        platform or disputes between tenants and owners.
      </p>

      <h2 className="text-2xl mt-6 mb-2">7. Changes to Terms</h2>
      <p>
        We reserve the right to update these terms at any time, if so we will notify you via email. Continued use
        of the service constitutes acceptance of the updated terms.
      </p>

      <h2 className="text-2xl mt-6 mb-2">8. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:messmatecompany@gmail.com" className="text-blue-600 underline">
          messmatecompany@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default TermsAndConditions;
