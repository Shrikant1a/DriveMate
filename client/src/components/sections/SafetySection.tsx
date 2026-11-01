import React from 'react';
import { ShieldCheck, FileCheck, Award, Eye, AlertTriangle } from 'lucide-react';

const PROTOCOLS = [
  {
    icon: FileCheck,
    title: 'Strict Commercial Document Audit',
    description: 'Every applicant must submit a valid Commercial/Heavy/Light Motor Vehicle driving license and government proof. Admin physically audits legitimacy and expiration.',
  },
  {
    icon: ShieldCheck,
    title: 'Background Verification & Police Clearance',
    description: 'Applicants undergo address check, previous employer reference review, and police verification to ensure clean driving and conduct histories.',
  },
  {
    icon: Award,
    title: '5+ Years Luxury Driving Experience',
    description: 'Drivers must demonstrate extensive track record handling automatic, dual-clutch, and multi-cylinder luxury sedans, electric vehicles, and premium SUVs.',
  },
  {
    icon: Eye,
    title: 'Pre & Post-Drive Vehicle Walkaround',
    description: 'Mandatory joint walkaround check with the customer to record initial odometer, fuel gauge, and vehicle exterior condition before taking the wheel.',
  },
];

export const SafetySection: React.FC = () => {
  return (
    <section id="safety" className="py-24 bg-[#080B10] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Integrity & Verification Framework</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Safety Grounded in Verified Protocols
          </h2>
          <p className="text-sm sm:text-base text-secondaryText leading-relaxed">
            We hold our chauffeurs to the highest standards of automotive stewardship. We never exaggerate automated guarantees — our trust is built on real human verification and transparent operating procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROTOCOLS.map((proto, idx) => {
            const Icon = proto.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#111722]/80 border border-white/10 backdrop-blur-md space-y-4 hover:border-emerald-500/40 transition-all shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{proto.title}</h3>
                <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
                  {proto.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

