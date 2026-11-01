import React from 'react';
import { Plane, GlassWater, Briefcase, Users, Clock, CalendarDays, Compass, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    id: 'hourly',
    title: 'Hourly Driver Booking',
    tag: 'Popular for Daily Errands',
    description: 'Hire an executive driver for 2 to 6 hours for city shopping, doctor visits, dinner reservations, or multiple short appointments in your car.',
    startingPrice: '₹249/hr',
    icon: Clock,
    color: '#FF6B00',
  },
  {
    id: 'airport',
    title: 'Airport Pickup & Drop',
    tag: 'Flight Timed Dispatch',
    description: 'Travel to the airport in your own comfort. Our driver drops you off at departures and safely returns your car home, or picks you up upon landing.',
    startingPrice: '₹799 Flat Base',
    icon: Plane,
    color: '#3B82F6',
  },
  {
    id: 'wedding',
    title: 'Wedding & Party Drivers',
    tag: 'Zero DUI • Safe Celebrations',
    description: 'Enjoy cocktails, weddings, and late-night parties without stressing about driving or police checkpoints. Arrive and depart in your own car with a sober pro.',
    startingPrice: '₹1,799 Event Package',
    icon: GlassWater,
    color: '#EC4899',
  },
  {
    id: 'corporate',
    title: 'Corporate & Executive Chauffeur',
    tag: 'VIP Client Delegations',
    description: 'Discreet, well-groomed chauffeurs in formal suits to drive founders, CXOs, and VIP corporate guests between board meetings and conferences.',
    startingPrice: '₹349/hr Premium',
    icon: Briefcase,
    color: '#8B5CF6',
  },
  {
    id: 'fullday',
    title: 'Full-Day Chauffeur (8-12 Hrs)',
    tag: 'All-Day Convenience',
    description: 'An entire day of hassle-free mobility. Driver stays on standby at your meetings, events, and shopping venues without metered surge pricing.',
    startingPrice: '₹1,999 / 8 Hours',
    icon: CalendarDays,
    color: '#10B981',
  },
  {
    id: 'outstation',
    title: 'Long-Distance & Outstation Road Trips',
    tag: 'Intercity Highway Specialists',
    description: 'Weekend getaways to the hills or intercity family road trips. Experienced highway drivers trained in mountain ghats and night expressways.',
    startingPrice: '₹1,499 Base + ₹349/hr',
    icon: Compass,
    color: '#F59E0B',
  },
  {
    id: 'family',
    title: 'Family & Senior Citizen Travel',
    tag: 'Gentle & Patient Driving',
    description: 'Specialized patient drivers for senior family members visiting hospitals, temples, or social events in their familiar family vehicle.',
    startingPrice: '₹249/hr Safe Care',
    icon: Users,
    color: '#06B6D4',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-[#080B10] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-semibold text-accent">
              <span>Automotive Driving Verticals</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Tailored Driving Services for Every Occasion
            </h2>
            <p className="text-sm sm:text-base text-secondaryText leading-relaxed">
              No matter where you're heading, our verified drivers handle the traffic and parking while you relax in the back seat of your personal car.
            </p>
          </div>

          <Link
            to="/book"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent hover:text-white transition-colors pb-2"
          >
            <span>Explore Custom Itinerary</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="group relative p-7 rounded-2xl bg-[#111722]/70 border border-white/10 backdrop-blur-md hover:border-accent/40 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${srv.color}15`, border: `1px solid ${srv.color}30` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: srv.color }} />
                    </div>
                    <span className="text-[11px] font-semibold text-secondaryText px-2.5 py-1 rounded-full bg-surface border border-white/5">
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-secondaryText block">Indicative Rate</span>
                    <span className="text-sm font-mono font-bold text-white">{srv.startingPrice}</span>
                  </div>

                  <Link
                    to="/book"
                    className="p-2 rounded-lg bg-surface hover:bg-accent hover:text-white text-secondaryText transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

