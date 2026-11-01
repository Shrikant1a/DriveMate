import React from 'react';
import { Calendar, UserCheck, Key, ArrowRight, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: '01',
    title: 'Book Your Driver',
    subtitle: 'Enter trip details & select your car',
    description: 'Select your registered vehicle (automatic or manual), choose pickup location, date, start time, and estimated duration in hours.',
    icon: Calendar,
    accent: '#FF6B00',
  },
  {
    step: '02',
    title: 'Choose Your Driver',
    subtitle: 'Vetted, approved chauffeurs',
    description: 'Browse nearby verified drivers with transparent profile stats, customer ratings (4.8+), years of luxury car experience, and estimated fare quotes.',
    icon: UserCheck,
    accent: '#FF8533',
  },
  {
    step: '03',
    title: 'Enjoy Your Journey',
    subtitle: 'Travel in your own vehicle',
    description: 'Your verified driver arrives punctually at your doorstep, conducts a quick vehicle check, receives your keys, and drives you safely.',
    icon: Key,
    accent: '#10B981',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#080B10] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-semibold text-accent">
            <span>Seamless 3-Step Process</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            How DriverOnDemand Works
          </h2>
          <p className="text-sm sm:text-base text-secondaryText leading-relaxed">
            No expensive permanent drivers. No leaving your personal car idle at home. Just verified professional chauffeurs when you need them.
          </p>
        </div>

        {/* 3 Step Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative p-8 rounded-2xl bg-[#111722]/80 border border-white/10 backdrop-blur-md hover:border-accent/40 transition-all hover:-translate-y-2 group shadow-xl"
              >
                {/* Step Number Watermark */}
                <span className="absolute top-6 right-8 font-mono font-black text-5xl text-white/5 group-hover:text-accent/15 transition-colors">
                  {step.step}
                </span>

                <div className="space-y-6 relative z-10">
                  {/* Step Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${step.accent}15`, border: `1px solid ${step.accent}30` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: step.accent }} />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold tracking-widest uppercase text-accent">
                      STEP {step.step}
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{step.title}</h3>
                    <p className="text-xs font-semibold text-slate-300">{step.subtitle}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#111722] via-[#161F2E] to-[#111722] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-bold text-white">Ready to hire your first personal chauffeur?</h4>
            <p className="text-xs text-secondaryText">Takes under 60 seconds. Instant confirmation and driver details.</p>
          </div>
          <Link
            to="/book"
            className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105"
          >
            Schedule a Driver
          </Link>
        </div>

      </div>
    </section>
  );
};

