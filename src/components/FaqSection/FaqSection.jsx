import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import FAQs from "../../assets/img/faqs.svg";

const FAQItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4 ">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={toggle}
      >
        <h3
          className={`text-lg font-medium ${
            isOpen
              ? "text-[#287150] dark:text-[#35976b]"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {question}
        </h3>
        {isOpen ? (
          <FaMinus className="text-gray-900 dark:text-[#287150]" />
        ) : (
          <FaPlus className="text-gray-900 dark:text-white" />
        )}
      </button>
      {isOpen && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {answer}
        </p>
      )}
    </div>
  );
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I set up website monitoring?",
      answer:
        "To set up monitoring, simply add your website URL in the dashboard and configure your desired check frequency for uptime and performance.",
    },
    {
      question: "What kind of alerts will I receive?",
      answer:
        "You will receive real-time alerts via email or other integrated channels when your website goes down or experiences performance issues.",
    },
    {
      question: "Can I monitor multiple websites?",
      answer:
        "Yes, you can monitor multiple websites simultaneously and manage them all from your dashboard.",
    },
    {
      question: "How can I view uptime statistics?",
      answer:
        "You can view detailed uptime statistics and reports directly in your dashboard, which includes historical data and performance metrics.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="flex items-center justify-center overflow-hidden bg-white dark:bg-[#121212] py-12 sm:py-16 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section: Image */}
          <div className="hidden lg:block flex items-start justify-center lg:justify-start">
            <img
              src={FAQs}
              alt="Customer Support"
              className="w-[600px] h-[450px] object-cover rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Right Section: FAQs */}
          <div className="text-center lg:text-left">
            {/* Subtitle */}
            <h2 className="text-base font-semibold leading-7 text-[#287150] dark:text-[#35976b]">
              Most Asked Questions
            </h2>

            {/* Title */}
            <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
              FAQs
            </h2>

            {/* Description */}
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Trusted in More Than 100 Countries And 5 Million Customers.
              Transact Easily And Quickly With Just One Click.
            </p>

            {/* FAQ Items */}
            <div className="mt-6 space-y-6">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  toggle={() => toggleFAQ(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
