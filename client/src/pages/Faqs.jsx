import React, { useState } from "react";

const faqData = [
  {
    question: "How does MessMate work?",
    answer:
      "MessMate connects students and professionals with verified PG/mess accommodations near them. You can browse, book, and manage your stay all in one place.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes, it's completely free.",
  },
  {
    question: "Can working professionals use MessMate?",
    answer:
      "Absolutely! While we primarily focus on students, MessMate is also open to any professionals looking for PG/mess stays.",
  },
];

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left p-4 font-medium text-[#2CA4B5] focus:outline-none"
            >
              {item.question}
            </button>
            {activeIndex === index && (
              <div className="p-4 pt-0 text-gray-700 transition-all duration-300 ease-in-out">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faqs;
