import React from "react";
import { MdClose } from "react-icons/md";

const predefinedReasons = [
  "Fake photos or information",
  "Overcharging",
  "Unsafe conditions",
  "Illegal activities",
  "Poor hygiene",
  "Other",
];

function ReportFraudModal({ stay, onClose, onSubmit, submitting, success }) {
  const [selectedReason, setSelectedReason] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setSelectedReason("");
    setDescription("");
    setError("");
  }, [stay]);

  const handleSubmit = () => {
    if (!selectedReason && description.trim() === "") {
      setError("Please select a reason or describe the issue.");
      return;
    }
    setError("");

    const reasonToSubmit = selectedReason
      ? selectedReason + (description.trim() ? ` - ${description.trim()}` : "")
      : description.trim();

    onSubmit(reasonToSubmit);
  };

  if (!stay) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-center sm:justify-between relative mb-4">
          <h2 className="text-xl font-semibold">Report Fraud</h2>
          <button
            onClick={onClose}
            className="absolute sm:static right-3 text-gray-600 hover:text-gray-900"
            aria-label="Close modal"
            disabled={submitting}
          >
            <MdClose size={24} />
          </button>
        </div>

        <p className="mb-3">
          Reporting for: <strong>{stay.pgOwner?.messName || "this PG"}</strong>
        </p>

        <label
          className="block mb-2 font-medium text-gray-700"
          htmlFor="reason-select"
        >
          Select a reason:
        </label>
        <select
          id="reason-select"
          className="w-full border rounded p-2 mb-4"
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          disabled={submitting}
        >
          <option value="">-- Choose a reason --</option>
          {predefinedReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>

        <label
          className="block mb-2 font-medium text-gray-700"
          htmlFor="description-textarea"
        >
          Additional details (optional):
        </label>
        <textarea
          id="description-textarea"
          rows={4}
          className={`w-full rounded p-2 mb-1 border-2 border-dashed transition-colors duration-200 ${
            error
              ? "border-red-500"
              : "border-primary-light hover:border-primary-dark focus:border-primary-dark"
          }`}
          placeholder="Describe the issue or add details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
        />
        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        {success === true && (
          <p className="text-green-600 mb-3">Report submitted successfully!</p>
        )}
        {success === false && (
          <p className="text-red-600 mb-3">Failed to submit the report.</p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportFraudModal;
