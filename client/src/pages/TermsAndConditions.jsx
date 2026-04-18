// import React from "react";

// import { useEffect } from "react";

// const TermsAndConditions = () => {
//    useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);
//   return (
//     <div className="container mx-auto p-6 max-w-3xl">
//       <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
//       <p>
//         Welcome to Messmate. By accessing or using our platform, you agree to
//         be bound by these Terms and Conditions. Please read them carefully.
//       </p>

//       <h2 className="text-2xl mt-6 mb-2">1. Use of Service</h2>
//       <p>
//         You agree to use Messmate only for lawful purposes and in a way that
//         does not infringe the rights of others.
//       </p>

//       <h2 className="text-2xl mt-6 mb-2">2. Account Responsibility</h2>
//       <p>
//         You are responsible for maintaining the confidentiality of your account
//         credentials and for all activities under your account.
//       </p>

//       <h2 className="text-2xl mt-6 mb-2">3. Booking & Payment</h2>
//       <p>
//         All bookings made through Messmate are subject to availability. Payment
//         must be completed using authorized payment methods. Messmate is not
//         responsible for payment disputes between tenants and owners.
//       </p>

//       <h2 className="text-2xl mt-6 mb-2">4. Service Fee</h2>
//       <p>
//         Messmate charges a service fee (currently 2%) on all transactions,
//         which is non-refundable.
//       </p>

//       <h2 className="text-2xl mt-6 mb-2">5. Cancellation & Refunds</h2>
//       <p>
//         Cancellation policies are governed by the owners. Messmate acts as a
//         facilitator only. Please refer to the Cancellation & Refunds page for
//         details.
//       </p>

//       <h2 className="text-2xl mt-6 mb-2">6. Limitation of Liability</h2>
//       <p>
//         Messmate is not liable for any loss or damages arising from use of the
//         platform or disputes between tenants and owners.
//       </p>

//       <h2 className="text-2xl mt-6 mb-2">7. Changes to Terms</h2>
//       <p>
//         We reserve the right to update these terms at any time, if so we will notify you via email. Continued use
//         of the service constitutes acceptance of the updated terms.
//       </p>

//       <h2 className="text-2xl mt-6 mb-2">8. Contact Us</h2>
//       <p>
//         If you have any questions about these Terms, please contact us at{" "}
//         <a href="mailto:messmatecompany@gmail.com" className="text-blue-600 underline">
//           messmatecompany@gmail.com
//         </a>
//         .
//       </p>
//     </div>
//   );
// };

// export default TermsAndConditions;
import React, { useEffect } from "react";

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p>
        Welcome to Messmate. By using our platform, you agree to comply with
        these Terms and Conditions. Please read them carefully before
        proceeding.
      </p>

      <div className="prose prose-sm text-gray-700 mb-6">
        <h3 className="font-semibold">1. Platform Usage</h3>
        <p>
          By using MessMate, you acknowledge that we are a platform that helps
          users discover nearby mess accommodations. We do not charge any fees
          for using the service and do not facilitate bookings or transactions.
        </p>

        <h3 className="font-semibold mt-4">2. Payment Terms</h3>
        <p>
          MessMate does not handle payments or deposits. All financial
          transactions are to be made directly between users and property
          owners. We do not charge any service or gateway fees.
        </p>

        <h3 className="font-semibold mt-4">3. Rental Agreement</h3>
        <p>
          Users are advised to enter into a written rental agreement with the
          mess owner before making any payments. MessMate is not a party to such
          agreements and does not mediate or enforce any terms.
        </p>

        <h3 className="font-semibold mt-4">4. Refund Policy</h3>
        <p>
          As MessMate does not process payments, we do not offer or handle
          refunds. Any security deposit or payment-related refunds must be
          addressed with the mess owner directly.
        </p>

        <h3 className="font-semibold mt-4">5. Legal Compliance</h3>
        <p>
          MessMate is a location discovery service. All legal and financial
          responsibilities rest with the tenant and the property owner. Users
          are encouraged to verify property documents and meet owners in person
          before making commitments.
        </p>

        <h3 className="font-semibold mt-4">6. Dispute Resolution</h3>
        <p>
          For disputes involving mess listings or agreements, users must resolve
          issues directly with the property owner. MessMate may assist with
          contact details but is not liable for any outcomes. Legal recourse may
          be pursued under applicable Indian consumer protection laws.
        </p>
      </div>

      <h2 className="text-2xl mt-6 mb-2">Additional Terms</h2>
      <p>
        Welcome to Messmate. By accessing or using our platform, you agree to be
        bound by these Terms and Conditions. Please read them carefully.
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

      <h2 className="text-2xl mt-6 mb-2">4. Cancellation & Refunds</h2>
      <p>
        Cancellation policies are governed by the owners. Messmate acts as a
        facilitator only. Please refer to the Cancellation & Refunds page for
        details.
      </p>

      <h2 className="text-2xl mt-6 mb-2">5. Limitation of Liability</h2>
      <p>
        Messmate is not liable for any loss or damages arising from use of the
        platform or disputes between tenants and owners.
      </p>

      <h2 className="text-2xl mt-6 mb-2">6. Changes to Terms</h2>
      <p>
        We reserve the right to update these terms at any time, if so we will
        notify you via email. Continued use of the service constitutes
        acceptance of the updated terms.
      </p>

      <h2 className="text-2xl mt-6 mb-2">7. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a
          href="mailto:support@messmate.co.in"
          className="text-blue-600 underline"
        >
          support@messmate.co.in
        </a>
        .
      </p>
    </div>
  );
};

export default TermsAndConditions;
