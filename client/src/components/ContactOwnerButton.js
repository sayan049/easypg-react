import { useState } from "react";

const ContactOwnerButton = ({ mobileNo }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!mobileNo) return;

    try {
      await navigator.clipboard.writeText(mobileNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleCopy}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Contact Owner
      </button>
      {copied && (
        <p className="text-green-600 text-sm mt-1">Mobile number copied!</p>
      )}
    </div>
  );
};

export default ContactOwnerButton;
