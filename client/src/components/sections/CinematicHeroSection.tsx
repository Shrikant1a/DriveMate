import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface CinematicHeroProps {
  onOpenAuth: (tab: any) => void;
}

interface CommercialAct {
  id: number;
  image: string;
  alt: string;
}

const COMMERCIAL_ACTS: CommercialAct[] = [
  {
    id: 1,
    image: '/images/drivemate_scene_1.jpg',
    alt: 'Black BMW 5 Series parked at luxury hotel entrance with professional chauffeur and passenger',
  },
  {
    id: 2,
    image: '/images/drivemate_scene_2.jpg',
    alt: 'Professional chauffeur holding rear passenger door open for executive passenger',
  },
  {
    id: 3,
    image: '/images/drivemate_scene_3.jpg',
    alt: 'Chauffeur in driver seat holding BMW steering wheel with digital cockpit illuminated',
  },
  {
    id: 4,
    image: '/images/drivemate_scene_4.jpg',
    alt: 'Black BMW 5 Series driving away smoothly down wet reflective city road at night',
  },
];

export const CinematicHeroSection: React.FC<CinematicHeroProps> = ({ onOpenAuth }) => {
  const [activeActIndex, setActiveActIndex] = useState<number>(0);

  // 18-second continuous cinematic loop (4.5s per act)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveActIndex((prev) => (prev + 1) % COMMERCIAL_ACTS.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen pt-24 pb-16 overflow-hidden flex flex-col justify-center bg-[#080B10]">
      {/* ================= 1. CINEMATIC PHOTOREALISTIC BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {/* Photorealistic Automotive Commercial Storyboard with Ken-Burns Motion */}
        {COMMERCIAL_ACTS.map((act, index) => {
          const isActive = index === activeActIndex;
          return (
            <div
              key={act.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-1' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={act.image}
                alt={act.alt}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[4500ms] ease-out ${
                  isActive ? 'scale-105 translate-x-1' : 'scale-100 translate-x-0'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Cinematic Vignette Overlay - Keeps headline and CTA ultra-sharp while showing full car */}
        <div className="absolute inset-0 z-3 bg-gradient-to-t from-[#080B10] via-transparent to-[#080B10]/80" />
        <div className="absolute inset-0 z-3 bg-gradient-to-r from-[#080B10]/95 via-[#080B10]/60 to-transparent lg:w-3/5" />
        <div className="absolute inset-0 z-3 bg-black/20" />
      </div>

      {/* ================= 2. HERO CONTENT CONTAINER (CLEAN & UNOBSTRUCTED) ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-12 relative">
        <div className="max-w-2xl space-y-6 text-center lg:text-left">
          
          {/* Subtle Distinction Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111722]/90 border border-accent/40 backdrop-blur-md text-xs font-semibold text-slate-200 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
            <span>DriveMate • We Provide Verified Chauffeurs For Your Personal Car</span>
          </div>

          {/* Official Headline */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05]">
            YOUR CAR.<br />
            YOUR DRIVER.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#FF8533] to-[#FFB066]">
              YOUR JOURNEY.
            </span>
          </h1>

          {/* Official Subheading */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-md">
            Book a trusted professional driver to drive your own car. Enjoy every journey with comfort, convenience and confidence.
          </p>

          {/* Main Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to="/book"
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-accent/35 hover:scale-105 active:scale-95 transition-all group"
            >
              <span>Book a Driver</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => onOpenAuth('registerDriver')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111722]/80 border border-white/15 hover:border-accent text-white font-semibold text-sm backdrop-blur-md hover:bg-surface transition-all flex items-center justify-center gap-2"
            >
              <span>Become a Driver</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Background Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span>4.96 Chauffeur Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Starting at ₹249/hr</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
