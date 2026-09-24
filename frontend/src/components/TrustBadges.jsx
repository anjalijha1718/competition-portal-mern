import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, RefreshCw, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Card } from './CommonUI';

export const TrustBadges = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      title: 'How will you receive prize money?',
      answer:
        'Prizes are transferred directly to your verified UPI ID or bank account within 48 hours of the result declaration. Our team contacts winners via email and SMS.',
      icon: HelpCircle,
    },
    {
      title: '100% Refund Guarantee',
      answer:
        'If a competition is cancelled or postponed by Feedants, your complete entry fee is refunded directly to your original payment method within 3-5 business days.',
      icon: RefreshCw,
    },
    {
      title: 'Secured Payments with Razorpay',
      answer:
        'All payment processing is handled through Razorpay with 256-bit bank-grade encryption. We do not store any card or banking credentials.',
      icon: Lock,
    },
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Feedants Trust & Safety</span>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-2.5 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:bg-slate-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                  <span>{faq.title}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-3 pb-3 pt-0 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                  <p className="mt-2">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
