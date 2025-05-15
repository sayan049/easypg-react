import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p>
        Messmate respects your privacy and is committed to protecting your
        personal information. This policy explains what data we collect, how we
        use it, and your rights.
      </p>

      <h2 className="text-2xl mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6">
        <li>Personal identification information (name, email, phone, etc.)</li>
        <li>Payment information via Razorpay (handled securely by Razorpay)</li>
        <li>Usage data and cookies to improve experience</li>
      </ul>

      <h2 className="text-2xl mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6">
        <li>To provide and manage bookings</li>
        <li>To process payments securely</li>
        <li>To communicate important updates and offers</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2 className="text-2xl mt-6 mb-2">3. Sharing Information</h2>
      <p>
        We do not sell or rent your personal data to third parties. We may share
        information with owners for booking purposes or with service providers
        who help us operate.
      </p>

      <h2 className="text-2xl mt-6 mb-2">4. Data Security</h2>
      <p>
        We implement security measures to protect your data but cannot guarantee
        100% security over the internet.
      </p>

      <h2 className="text-2xl mt-6 mb-2">5. Cookies</h2>
      <p>
        We use cookies to personalize your experience. You can control cookie
        settings through your browser.
      </p>

      <h2 className="text-2xl mt-6 mb-2">6. Your Rights</h2>
      <p>
        You may request access, correction, or deletion of your personal data by
        contacting us.
      </p>

      <h2 className="text-2xl mt-6 mb-2">7. Contact Us</h2>
      <p>
        For privacy-related inquiries, email us at{" "}
        <a href="mailto:messmatecompany@gmail.com" className="text-blue-600 underline">
          messmatecompany@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;

