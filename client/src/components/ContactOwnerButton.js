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
    <div className="relative inline-block">
      {/* Tooltip */}
      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded shadow-lg z-10 transition-opacity duration-200 animate-fade-in">
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-green-600" />
          Mobile number copied!
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleCopy}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 relative"
      >
        Contact Owner
      </button>
    </div>
  );
};

export default ContactOwnerButton;
