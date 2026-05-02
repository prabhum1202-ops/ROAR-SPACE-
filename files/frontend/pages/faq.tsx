import Layout from '@/components/Layout';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days across India. Express delivery is available for orders above ₹2000, with delivery in 2-3 business days.'
  },
  {
    question: 'Do you offer returns?',
    answer: 'Yes! We offer 30-day hassle-free returns for unworn items with original tags. Simply contact our support team to initiate a return.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and Cash on Delivery for select locations.'
  },
  {
    question: 'How can I track my order?',
    answer: 'You can track your order in real-time from your account dashboard after placing the order.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Currently, we ship only within India. International shipping coming soon!'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us via email at hello@roarspace.com, WhatsApp, or call +91 98765 43210.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-accent mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-400">Find answers to common questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-secondary rounded-lg border-2 border-accent/20 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 hover:bg-accent/5 transition"
              >
                <h3 className="text-lg font-semibold text-light text-left">{faq.question}</h3>
                <FiChevronDown
                  className={`text-accent text-xl transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === idx && (
                <div className="px-6 pb-6 text-gray-400 border-t border-accent/20">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}