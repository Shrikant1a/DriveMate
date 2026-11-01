import React from 'react';
import { ExplodedViewCanvas } from '../3d/ExplodedViewCanvas.js';
import { ShieldCheck, Wrench, Eye, CheckCircle, Sparkles } from 'lucide-react';

export const ExplodedViewSection: React.FC = () => {
  return (
    <section id="exploded-view" className="py-24 bg-[#080B10] relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[350px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-accent/30 text-xs font-semibold text-accent shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Engineering & Safety Showcase</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Separated by Component.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#FFB066]">
              Protected with Utmost Care.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-secondaryText leading-relaxed">
            Your vehicle is your prized asset. Before every journey, our vetted drivers perform a standardized 3-minute physical inspection across vital components — engine fluids, brakes, optical mirrors, and cabin sanitization.
          </p>
        </div>

        {/* 3D Exploded View Canvas Container */}
        <div className="w-full">
          <ExplodedViewCanvas />
        </div>

        {/* 4 Architectural Inspection Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-[#111722]/60 border border-white/5 backdrop-blur-md space-y-3 hover:border-accent/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Under-Hood Inspection</h4>
            <p className="text-xs text-secondaryText leading-relaxed">
              Engine oil dipstick and coolant reservoir levels verified to protect your engine from highway overheating.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111722]/60 border border-white/5 backdrop-blur-md space-y-3 hover:border-accent/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Pre-Trip Scratch Audit</h4>
            <p className="text-xs text-secondaryText leading-relaxed">
              360-degree exterior walkaround with customer sign-off ensures complete mutual transparency and zero disputes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111722]/60 border border-white/5 backdrop-blur-md space-y-3 hover:border-accent/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Defensive Handling</h4>
            <p className="text-xs text-secondaryText leading-relaxed">
              Drivers respect automatic, dual-clutch, and manual gearboxes with smooth acceleration and zero harsh braking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111722]/60 border border-white/5 backdrop-blur-md space-y-3 hover:border-accent/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Safe Key Return</h4>
            <p className="text-xs text-secondaryText leading-relaxed">
              End-of-trip parking in your designated slot, headlights shut off, handbrake engaged, and physical key handover.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

