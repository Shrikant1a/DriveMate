import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Do you provide the vehicle or only the driver?',
    a: 'DriverOnDemand provides ONLY VERIFIED DRIVERS, NOT CARS. Our service is built specifically for vehicle owners who want to travel in the safety and comfort of their own personal car without the fatigue of driving or navigating traffic.',
  },
  {
    q: 'Who pays for fuel, highway tolls, and parking charges?',
    a: 'Since the vehicle belongs to you, fuel is supplied by you. Any highway toll booth fees (FASTag), parking tickets, or valet charges incurred during your trip are paid directly by you.',
  },
  {
    q: 'Can your drivers handle luxury automatic, electric, and manual transmissions?',
    a: 'Yes. All approved drivers undergo a vehicle competency profile check. When booking, you select whether your vehicle is Automatic (DCT, DSG, CVT, EV single-speed) or Manual, and we dispatch a driver with verified expertise in that transmission type.',
  },
  {
    q: 'How does the driver travel to my pickup location?',
    a: 'Drivers travel independently to your designated pickup address via local transit, cab, or two-wheeler. They arrive 10-15 minutes prior to the booked start time.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Free cancellation is available up to 2 hours before the scheduled pickup time. Cancellations made within 2 hours or after the driver is en route are subject to a nominal base convenience fee as compensation for the driver.',
  },
  {
    q: 'How do you verify driver backgrounds?',
    a: 'Every driver must submit an official Driving License and government identity documents. Our administration team audits records against government databases, verifies commercial driving experience, and checks criminal background references prior to granting approval.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#080B10] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-semibold text-accent">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-secondaryText leading-relaxed">
            Everything you need to know about booking verified drivers for your personal car.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#111722]/80 border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-surface/50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-secondaryText leading-relaxed border-t border-white/5 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

