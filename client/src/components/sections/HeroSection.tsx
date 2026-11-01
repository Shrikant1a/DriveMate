import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroCanvas } from '../3d/HeroCanvas.js';
import { ShieldCheck, Clock, Award, Star, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenAuth: (tab: any) => void;
}

const CAR_COLORS = [
  { name: 'Obsidian Black', hex: '#0A0E17', border: '#1F2937' },
  { name: 'Monaco Royal Blue', hex: '#0D2040', border: '#1E3A8A' },
  { name: 'Imperial Crimson', hex: '#3B0D16', border: '#831843' },
  { name: 'Glacier Silver', hex: '#8B95A5', border: '#CBD5E1' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth }) => {
  const [selectedColor, setSelectedColor] = useState(CAR_COLORS[0].hex);

  return (
    <section className="relative min-h-screen pt-28 pb-16 overflow-hidden flex flex-col justify-center bg-radial-gradient">
      {/* Background Decorative Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-12 left-10 w-96 h-96 bg-[#162032]/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            {/* Top Verification Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-semibold text-slate-300 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>We provide drivers. You provide the car.</span>
              <span className="text-accent">• 100% Verified</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.08]">
              Your Car.<br />
              Your Journey.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#FF8533] to-[#FFB066]">
                Your Driver.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-secondaryText leading-relaxed max-w-xl mx-auto lg:mx-0">
              Book verified professional drivers to drive your own car. Pay only for the time you need — for business, nightlife, airport runs, or outstation road trips.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/book"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105 active:scale-95 group"
              >
                <span>Book a Driver</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => onOpenAuth('registerDriver')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-surface border border-white/10 hover:border-accent text-white font-semibold text-sm transition-all hover:bg-surfaceLight flex items-center justify-center gap-2"
              >
                <span>Become a Driver</span>
              </button>
            </div>

            {/* 3D Vehicle Color Customizer */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <span className="text-xs text-secondaryText font-medium">Customer Car Finish:</span>
              <div className="flex items-center gap-2">
                {CAR_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.hex)}
                    title={c.name}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      selectedColor === c.hex ? 'scale-125 ring-2 ring-accent ring-offset-2 ring-offset-[#080B10]' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex, border: `1px solid ${c.border}` }}
                  />
                ))}
              </div>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/10">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-accent font-bold text-lg font-mono">
                  <span>₹249</span>
                  <span className="text-xs text-secondaryText font-sans">/hr</span>
                </div>
                <div className="text-[11px] text-secondaryText">Transparent Rates</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-white font-bold text-lg font-mono">
                  <span>4.96</span>
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                </div>
                <div className="text-[11px] text-secondaryText">Average Rating</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-emerald-400 font-bold text-lg font-mono">
                  <span>100%</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] text-secondaryText">Police Verified</div>
              </div>
            </div>
          </div>

          {/* Right 3D Showcase Column */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            {/* Ambient Lighting Ring behind vehicle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/15 via-transparent to-blue-500/10 rounded-3xl blur-3xl" />
            
            <div className="w-full relative z-10">
              <HeroCanvas selectedColor={selectedColor} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

