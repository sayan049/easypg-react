import React from "react";
import { useEffect } from "react";

const CancellationRefunds = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    // <div className="container mx-auto p-6 max-w-3xl">
    //   <h1 className="text-3xl font-bold mb-4">Cancellation & Refunds</h1>

    //   <p>
    //     This page explains the policies regarding booking cancellations and
    //     refunds on Messmate.
    //   </p>

    //   <h2 className="text-2xl mt-6 mb-2">1. Cancellation Policy</h2>
    //   <p>
    //     Cancellations must be made at least 48 hours prior to the scheduled
    //     check-in date to qualify for a refund.
    //   </p>

    //   <h2 className="text-2xl mt-6 mb-2">2. Refund Process</h2>
    //   <p>
    //     Approved refunds will be processed within 7 business days after
    //     cancellation.
    //   </p>

    //   <h2 className="text-2xl mt-6 mb-2">3. Service Fee</h2>
    //   <p>
    //     Messmate charges a non-refundable service fee of 2% on all transactions.
    //   </p>

    //   <h2 className="text-2xl mt-6 mb-2">4. Disputes</h2>
    //   <p>
    //     Any refund disputes should be addressed directly with the owner as
    //     Messmate acts only as a booking facilitator.
    //   </p>

    //   <h2 className="text-2xl mt-6 mb-2">5. Contact Us</h2>
    //   <p>
    //     For any cancellation or refund questions, contact us at{" "}
    //     <a href="mailto:messmatecompany@gmail.com" className="text-blue-600 underline">
    //       messmatecompany@gmail.com
    //     </a>
    //     .
    //   </p>
    // </div>
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Cancellation & Refunds</h1>

      <p>
        This page outlines the cancellation and refund terms for bookings made
        through MessMate. Please note, MessMate only facilitates connections and
        does not handle payments or enforce agreements.
      </p>

      <h2 className="text-2xl mt-6 mb-2">1. Cancellation by User</h2>
      <p>
        Users may cancel their booking request within 2 days of the owner's
        acceptance. Cancellations beyond this period are subject to the owner's
        individual policy.
      </p>

      <h2 className="text-2xl mt-6 mb-2">2. Rejection by Owner</h2>
      <p>
        Property owners reserve the right to reject any booking request before
        confirmation if they encounter any concerns or discrepancies. Users will
        be notified promptly in such cases.
      </p>

      <h2 className="text-2xl mt-6 mb-2">3. Refund Process</h2>
      <p>
        As MessMate does not process payments, all refund matters must be
        resolved between the user and the mess owner, based on the owner's
        refund policy.
      </p>

      <h2 className="text-2xl mt-6 mb-2">4. Service Fee</h2>
      <p>
        MessMate does not charge any service or transaction fees. All financial
        arrangements are made directly between the user and the property owner.
      </p>

      <h2 className="text-2xl mt-6 mb-2">5. Disputes</h2>
      <p>
        Any disputes regarding cancellations or refunds must be addressed
        between the user and the mess owner. MessMate is not liable for
        disagreements or financial losses.
      </p>

      <h2 className="text-2xl mt-6 mb-2">6. Contact Us</h2>
      <p>
        For general inquiries, please reach out to us at{" "}
        <a
          href="mailto:messmatecompany@gmail.com"
          className="text-blue-600 underline"
        >
          messmatecompany@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default CancellationRefunds;
