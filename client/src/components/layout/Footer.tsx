import React from 'react';
import { Car, Shield, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070B] border-t border-white/10 pt-16 pb-12 text-secondaryText">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Important Product Distinction Notice Banner */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#111722]/80 border border-accent/20 backdrop-blur-md mb-12 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 text-accent shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-bold text-sm tracking-wide">
              Important Service Model Notice
            </h4>
            <p className="text-xs text-secondaryText leading-relaxed">
              DriveMate provides <strong>verified personal drivers only, NOT cars</strong>. Our drivers travel to your pickup point and drive your own private personal or corporate vehicle under agreed commercial terms. We do not operate a taxi fleet or car rental service.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#FF8533] p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#080B10] rounded-[10px] flex items-center justify-center">
                  <Car className="w-5 h-5 text-accent" />
                </div>
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Drive<span className="text-accent">Mate</span>
              </span>
            </div>
            <p className="text-sm text-secondaryText max-w-sm leading-relaxed">
              India's premier executive driver booking network. Hire vetted, background-verified personal chauffeurs for a few hours, a full day, airport transfers, or interstate road trips in your own car.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>Mumbai • Pune • Delhi NCR</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>+91 1800 200 4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Chauffeur Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-white transition-colors">Hourly Driver Booking</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Full-Day Executive Chauffeur</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Airport Transfers in Your Car</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Wedding & Gala Party Drivers</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Outstation Road Trips</a></li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Safety & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#safety" className="hover:text-white transition-colors">Police Verification Process</a></li>
              <li><a href="#safety" className="hover:text-white transition-colors">Defensive Driving Certification</a></li>
              <li><a href="#exploded-view" className="hover:text-white transition-colors">3D Pre-Drive Inspection</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Transparent Pricing Formula</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Driver Opportunities */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">For Drivers</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#driver-recruit" className="hover:text-white transition-colors">Become a Verified Driver</a></li>
              <li><a href="#driver-recruit" className="hover:text-white transition-colors">Payout Structure (Weekly)</a></li>
              <li><a href="#driver-recruit" className="hover:text-white transition-colors">Flexible Working Zones</a></li>
              <li><a href="#driver-recruit" className="hover:text-white transition-colors">Driver Onboarding Portal</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© 2026 DriveMate Technologies. All rights reserved.</p>
            <span className="hidden sm:inline text-white/20">•</span>
            <p className="flex items-center gap-1.5 text-slate-300">
              <span>Built by</span>
              <span className="text-white font-bold tracking-wide hover:text-accent transition-colors">
                shriTech Pvt Ltd
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#cancellation" className="hover:text-white transition-colors">Cancellation Rules</a>
            <a href="#dispute" className="hover:text-white transition-colors">Dispute Resolution</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

