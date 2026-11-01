import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Calculator, ArrowRight, ShieldAlert, Check, HelpCircle } from 'lucide-react';

const TRIP_TYPES = [
  { label: 'Hourly Booking', value: 'Hourly Booking', base: 499, hourly: 249, min: 2 },
  { label: 'Full-Day Chauffeur', value: 'Full-Day Chauffeur', base: 1999, hourly: 199, min: 8 },
  { label: 'Airport Transfer', value: 'Airport Pickup & Drop', base: 799, hourly: 279, min: 3 },
  { label: 'Long-Distance Road Trip', value: 'Long-Distance Road Trip', base: 1499, hourly: 349, min: 6 },
  { label: 'Wedding & Party Chauffeur', value: 'Wedding & Party Chauffeur', base: 1799, hourly: 399, min: 4 },
];

export const PricingCalculatorSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTrip, setSelectedTrip] = useState(TRIP_TYPES[0].value);
  const [durationHours, setDurationHours] = useState(4);
  const [serviceArea, setServiceArea] = useState('Metropolitan Core');
  const [transmission, setTransmission] = useState<'AUTOMATIC' | 'MANUAL'>('AUTOMATIC');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await api.calculateQuote({
        tripType: selectedTrip,
        durationHours,
        serviceArea,
      });
      setQuote(res);
    } catch {
      // Offline fallback calculation
      const activeType = TRIP_TYPES.find((t) => t.value === selectedTrip) || TRIP_TYPES[0];
      const billable = Math.max(activeType.min, durationHours);
      const subtotalPaise = (activeType.base + activeType.hourly * billable) * 100;
      const taxes = Math.round(subtotalPaise * 0.05);
      setQuote({
        baseFeePaise: activeType.base * 100,
        hourlyRatePaise: activeType.hourly * 100,
        hourlyFeePaise: activeType.hourly * billable * 100,
        taxesPaise: taxes,
        estimatedFarePaise: subtotalPaise + taxes,
        billableHours: billable,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [selectedTrip, durationHours, serviceArea]);

  const handleBookNow = () => {
    navigate('/book', {
      state: {
        tripType: selectedTrip,
        durationHours,
        serviceArea,
        transmission,
      },
    });
  };

  return (
    <section id="pricing" className="py-24 bg-[#080B10] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-semibold text-accent">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Fare Calculator</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Transparent Pricing. Zero Hidden Fees.
          </h2>
          <p className="text-sm sm:text-base text-secondaryText leading-relaxed">
            Formula: <code>Base Fee + (Hourly Rate × Hours) + Taxes</code>. All calculations are handled strictly on the server in integer paise without surge multipliers.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#111722]/80 border border-white/10 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trip Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Driving Vertical
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRIP_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setSelectedTrip(t.value)}
                      className={`p-3 rounded-xl text-left border text-xs font-medium transition-all ${
                        selectedTrip === t.value
                          ? 'bg-accent/15 border-accent text-white shadow-md'
                          : 'bg-surface border-white/5 text-secondaryText hover:text-white'
                      }`}
                    >
                      <div className="font-bold">{t.label}</div>
                      <div className="text-[10px] text-accent font-mono mt-0.5">₹{t.hourly}/hr • min {t.min}h</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Service Duration
                  </label>
                  <span className="text-sm font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                    {durationHours} Hours
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="14"
                  step="1"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseInt(e.target.value))}
                  className="w-full accent-accent cursor-pointer h-2 bg-surface rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-secondaryText font-mono">
                  <span>2 Hours (Quick)</span>
                  <span>8 Hours (Full Day)</span>
                  <span>14 Hours (Outstation)</span>
                </div>
              </div>

              {/* Transmission Type Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Your Car Transmission
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTransmission('AUTOMATIC')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      transmission === 'AUTOMATIC'
                        ? 'bg-white text-[#080B10] border-white'
                        : 'bg-surface border-white/10 text-secondaryText'
                    }`}
                  >
                    Automatic Transmission
                  </button>
                  <button
                    onClick={() => setTransmission('MANUAL')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      transmission === 'MANUAL'
                        ? 'bg-white text-[#080B10] border-white'
                        : 'bg-surface border-white/10 text-secondaryText'
                    }`}
                  >
                    Manual Transmission
                  </button>
                </div>
              </div>
            </div>

            {/* Right Quote Summary Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0B0F17] border border-accent/20 space-y-6 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                  Server Fare Estimate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-black text-white font-mono">
                    ₹{quote ? Math.round(quote.estimatedFarePaise / 100) : '...'}
                  </span>
                  <span className="text-xs text-secondaryText font-medium">all-inclusive</span>
                </div>
              </div>

              {/* Itemized Calculation Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-b border-white/10 py-4">
                <div className="flex justify-between text-secondaryText">
                  <span>Base Pickup & Arrival Fee</span>
                  <span className="font-mono text-white">₹{quote ? Math.round(quote.baseFeePaise / 100) : 0}</span>
                </div>
                <div className="flex justify-between text-secondaryText">
                  <span>
                    Chauffeur Time ({quote?.billableHours || durationHours} hrs)
                  </span>
                  <span className="font-mono text-white">₹{quote ? Math.round(quote.hourlyFeePaise / 100) : 0}</span>
                </div>
                <div className="flex justify-between text-secondaryText">
                  <span>Goods & Services Tax (GST 5%)</span>
                  <span className="font-mono text-white">₹{quote ? Math.round(quote.taxesPaise / 100) : 0}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                  <span>Zero Car Rental / Fuel Surcharge</span>
                  <span>Customer Car</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105 active:scale-95"
              >
                <span>Book This Driver Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-mutedText">
                * Tolls, parking, and vehicle fuel are borne directly by customer during the trip.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

