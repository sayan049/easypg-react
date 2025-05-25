import React from "react";
import { useEffect } from "react";

const CancellationRefunds = () => {
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Cancellation & Refunds</h1>

      <p>
        This page explains the policies regarding booking cancellations and
        refunds on Messmate.
      </p>

      <h2 className="text-2xl mt-6 mb-2">1. Cancellation Policy</h2>
      <p>
        Cancellations must be made at least 48 hours prior to the scheduled
        check-in date to qualify for a refund.
      </p>

      <h2 className="text-2xl mt-6 mb-2">2. Refund Process</h2>
      <p>
        Approved refunds will be processed within 7 business days after
        cancellation.
      </p>

      <h2 className="text-2xl mt-6 mb-2">3. Service Fee</h2>
      <p>
        Messmate charges a non-refundable service fee of 2% on all transactions.
      </p>

      <h2 className="text-2xl mt-6 mb-2">4. Disputes</h2>
      <p>
        Any refund disputes should be addressed directly with the owner as
        Messmate acts only as a booking facilitator.
      </p>

      <h2 className="text-2xl mt-6 mb-2">5. Contact Us</h2>
      <p>
        For any cancellation or refund questions, contact us at{" "}
        <a href="mailto:messmatecompany@gmail.com" className="text-blue-600 underline">
          messmatecompany@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default CancellationRefunds;
