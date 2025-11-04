import React from "react";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="privacy-policy container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        <strong>Last updated:</strong> May 29, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          This Privacy Policy describes how MessMate ("we", "us", or "our")
          collects, uses, and protects your information when you use our
          platform.
        </p>
        <p className="mb-4">
          MessMate helps users find and connect with mess accommodations. We do
          not handle rental payments or participate in legal agreements between
          users and property owners.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
        <h3 className="text-xl font-medium mb-2">Personal Data</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Email address</li>
          <li>First and last name</li>
          <li>Phone number</li>
          <li>Address information</li>
        </ul>

        <h3 className="text-xl font-medium mb-2">Usage Data</h3>
        <p className="mb-4">
          Includes IP address, browser type, device type, visited pages, and
          diagnostic data used to improve the platform.
        </p>
        <h3 className="text-xl font-medium mb-2">Third-Party Services</h3>
        <p className="mb-4">
          We use third-party services to provide key features in our platform.
          These include:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Google Maps & Places API</strong> – for showing locations
            and calculating distances.
          </li>
          <li>
            <strong>Google Login (OAuth 2.0)</strong> – to simplify user
            authentication.
          </li>
          <li>
            <strong>Cloudinary</strong> – for secure image uploads and optimized
            delivery.
          </li>
          <li>
            <strong>Socket.IO</strong> – for real-time messaging and booking
            updates.
          </li>
          <li>
            <strong>Analytics tools</strong> – to monitor usage trends and
            improve user experience.
          </li>
        </ul>
        <p className="mb-4">
          These services may collect data according to their own privacy
          policies. We recommend reviewing them for more information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
        <ul className="list-disc pl-6">
          <li>To provide and improve our platform</li>
          <li>To communicate important updates</li>
          <li>To personalize your experience</li>
          <li>To ensure compliance with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
        <p className="mb-4">
          We do not sell your personal data. We may share your information with
          trusted service providers, legal authorities (if required), or as
          necessary to operate our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Security</h2>
        <p className="mb-4">
          We use industry-standard measures to protect your data, but no
          platform is completely secure. Always use caution when sharing
          sensitive information online.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal data at
          any time. You can do this via your account settings or by contacting
          us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-2">
          Email:{" "}
          <a href="mailto:support@messmate.co.in" className="text-blue-600">
            support@messmate.co.in
          </a>
        </p>
        <p>
          Website:{" "}
          <a
            href="https://www.messmate.co.in/#contactus"
            className="text-blue-600"
          >
            https://www.messmate.co.in/
          </a>
        </p>
      </section>

      <p className="text-sm text-gray-600">
        We may update this Privacy Policy from time to time. Please review this
        page periodically for any changes.
      </p>
    </div>
    // <div className="privacy-policy container mx-auto p-6">
    //   <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
    //   <p className="mb-4">
    //     <strong>Last updated:</strong> May 23, 2025
    //   </p>

    //   <section className="mb-8">
    //     <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
    //     <p className="mb-4">
    //       This Privacy Policy describes how Messmate ("we", "us", or "our")
    //       collects, uses, and discloses your information when you use our
    //       service.
    //     </p>
    //   </section>

    //   <section className="mb-8">
    //     <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
    //     <h3 className="text-xl font-medium mb-2">Personal Data</h3>
    //     <ul className="list-disc pl-6 mb-4">
    //       <li>Email address</li>
    //       <li>First and last name</li>
    //       <li>Phone number</li>
    //       <li>Address information</li>
    //     </ul>

    //     <h3 className="text-xl font-medium mb-2">Usage Data</h3>
    //     <p className="mb-4">
    //       Includes IP address, browser type, pages visited, device information,
    //       and other diagnostic data.
    //     </p>
    //   </section>

    //   <section className="mb-8">
    //     <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
    //     <ul className="list-disc pl-6">
    //       <li>Provide and maintain our service</li>
    //       <li>Manage your account</li>
    //       <li>Contact you with updates</li>
    //       <li>Improve our services</li>
    //       <li>Legal compliance</li>
    //     </ul>
    //   </section>

    //   <section className="mb-8">
    //     <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
    //     <p className="mb-4">
    //       We may share your information with service providers, business
    //       partners, or when required by law. We never sell your personal data.
    //     </p>
    //   </section>

    //   <section className="mb-8">
    //     <h2 className="text-2xl font-semibold mb-4">Security</h2>
    //     <p className="mb-4">
    //       We use reasonable security measures to protect your data, but no
    //       system is 100% secure.
    //     </p>
    //   </section>

    //   <section className="mb-8">
    //     <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
    //     <p className="mb-4">
    //       You can request to access, update, or delete your personal information
    //       through your account settings or by contacting us.
    //     </p>
    //   </section>

    //   <section className="mb-8">
    //     <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
    //     <p className="mb-2">
    //       Email:{" "}
    //       <a href="mailto:messmatecompany@gmail.com" className="text-blue-600">
    //         messmatecompany@gmail.com
    //       </a>
    //     </p>
    //     <p>
    //       Website:{" "}
    //       <a
    //         href="https://www.messmate.co.in/#contactus"
    //         className="text-blue-600"
    //       >
    //         https://www.messmate.co.in/
    //       </a>
    //     </p>
    //   </section>

    //   <p className="text-sm text-gray-600">
    //     We may update this policy periodically. Please review this page for
    //     changes.
    //   </p>
    // </div>
  );
};

export default PrivacyPolicy;
