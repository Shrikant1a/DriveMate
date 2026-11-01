import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Karan Mehra',
    car: 'BMW 730Ld xDrive',
    trip: 'Airport & Corporate Summit (8 hrs)',
    driver: 'Vikramjit Singh',
    rating: 5,
    text: 'Vikramjit drove my 7 Series with extreme respect. He arrived 15 mins prior, immaculate uniform, adjusted mirrors smoothly, and navigated peak Western Express Highway traffic effortlessly. Outstanding service.',
    date: '2 days ago'
  },
  {
    name: 'Pooja Singhania',
    car: 'Mercedes-Benz GLC 300',
    trip: 'Wedding Reception Gala',
    driver: 'Anita Deshmukh',
    rating: 5,
    text: 'Having Anita drive our family car back from the St. Regis wedding was a breath of fresh air. Zero stress regarding parking or late night driving. She waited patiently and dropped us right at our foyer.',
    date: '1 week ago'
  },
  {
    name: 'Rohit Kulkarni',
    car: 'Audi A6 45 TFSI',
    trip: 'Mumbai to Lonavala Weekend Trip',
    driver: 'Rajesh Sharma',
    rating: 5,
    text: 'Took our A6 up the Mumbai-Pune Expressway ghats. Rajesh knew the route like the back of his hand, maintained defensive braking distance, and made our family road trip totally relaxing. 10/10.',
    date: '2 weeks ago'
  }
];

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-24 bg-[#080B10] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-semibold text-accent">
            <span>Verified Customer Testimonials</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Trusted by Luxury Vehicle Owners
          </h2>
          <p className="text-sm sm:text-base text-secondaryText leading-relaxed">
            See what car owners say after letting our verified chauffeurs take the wheel of their personal vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#111722]/70 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-6 shadow-xl hover:border-accent/30 transition-all hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-accent">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent" />
                    ))}
                  </div>
                  <span className="text-[11px] text-secondaryText font-mono">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-accent font-semibold">{rev.car}</p>
                  <p className="text-[10px] text-secondaryText">Chauffeur: {rev.driver}</p>
                </div>
                <Quote className="w-8 h-8 text-white/5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

