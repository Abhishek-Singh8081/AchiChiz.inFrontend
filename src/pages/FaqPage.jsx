import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqData = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, UPI, net banking, and PayPal.",
  },
  {
    question: "How long will it take to receive my order?",
    answer:
      "Delivery typically takes 3–7 business days depending on your location.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes, once your order ships, we’ll send you a tracking number via email/SMS.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You can return eligible items within 7 days of delivery for a refund or exchange.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship only within India. International shipping will be available soon.",
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen px-4 py-20 md:px-20 bg-[#fffaf6] text-black">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Frequently Asked Questions
      </h1>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border border-gray-300 rounded-lg">
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center p-4 text-left font-medium text-lg focus:outline-none"
            >
              {faq.question}
              {openIndex === index ? (
                <FiMinus className="text-[#fe5f55]" />
              ) : (
                <FiPlus />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-sm text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
