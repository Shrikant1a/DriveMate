import React from 'react';
import { Award, Wallet, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

interface DriverRecruitProps {
  onOpenAuth: (tab: any) => void;
}

export const DriverRecruitSection: React.FC<DriverRecruitProps> = ({ onOpenAuth }) => {
  return (
    <section id="driver-recruit" className="py-24 bg-[#080B10] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#111722] via-[#161F2E] to-[#0D131F] border border-accent/30 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-xs font-semibold text-accent">
                <Award className="w-3.5 h-3.5" />
                <span>Driver Partner Program</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                Are You a Professional Driver?<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#FFB066]">
                  Earn ₹45,000 to ₹75,000 / month
                </span>
              </h2>

              <p className="text-sm sm:text-base text-secondaryText leading-relaxed">
                Drive verified luxury and private family cars without fuel costs or vehicle EMIs. You set your availability, choose your preferred working zones, and receive weekly payouts directly to your bank account.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">85% Payout Share</h4>
                    <p className="text-xs text-secondaryText">Flat 15% platform commission</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full Schedule Control</h4>
                    <p className="text-xs text-secondaryText">Online/Offline toggle anytime</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onOpenAuth('registerDriver')}
                  className="px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105"
                >
                  <span>Apply as a Verified Driver</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Onboarding Flow Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#080B10]/80 border border-white/10 backdrop-blur-md space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Driver Onboarding Process
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-surface border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent font-mono font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <div className="font-bold text-white">Online Application</div>
                    <div className="text-secondaryText text-[11px]">Submit basic details and 3+ years experience summary</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent font-mono font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <div className="font-bold text-white">Driving License Upload</div>
                    <div className="text-secondaryText text-[11px]">Securely upload your valid commercial / personal driving license</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent font-mono font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <div className="font-bold text-white">Admin Document Verification</div>
                    <div className="text-secondaryText text-[11px]">Our operations team verifies background within 24 hours</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-white/5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">4</span>
                  <div>
                    <div className="font-bold text-emerald-400">Start Accepting Bookings</div>
                    <div className="text-secondaryText text-[11px]">Toggle Online status and receive instant dispatch trips</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

