import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Booking, Vehicle } from '../types/index.js';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Star,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  LogOut,
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review Modal State
  const [reviewBookingId, setReviewBookingId] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Support Ticket Modal
  const [supportBookingId, setSupportBookingId] = useState<number | null>(null);
  const [supportCategory, setSupportCategory] = useState('Trip Feedback');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDesc, setSupportDesc] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);

  // Add Car Modal
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newReg, setNewReg] = useState('');
  const [newTrans, setNewTrans] = useState<'AUTOMATIC' | 'MANUAL'>('AUTOMATIC');
  const [newFuel, setNewFuel] = useState<'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'>('PETROL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, bRes] = await Promise.all([api.getVehicles(), api.getBookings()]);
      setVehicles(vRes.vehicles || []);
      setBookings(bRes.bookings || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking under the cancellation policy?')) return;
    try {
      await api.cancelBooking(bookingId, 'Customer cancelled from dashboard');
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId) return;
    setReviewSubmitting(true);
    try {
      await api.submitReview(reviewBookingId, rating, comment);
      setReviewBookingId(null);
      setComment('');
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleCreateSupportCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSupportCase({
        bookingId: supportBookingId,
        category: supportCategory,
        subject: supportSubject,
        description: supportDesc,
      });
      setSupportSuccess(true);
      setTimeout(() => {
        setSupportSuccess(false);
        setSupportBookingId(null);
        setSupportSubject('');
        setSupportDesc('');
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteVehicle = async (vehId: number) => {
    if (!window.confirm('Remove this vehicle from your account?')) return;
    try {
      await api.deleteVehicle(vehId);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addVehicle({
        make: newMake,
        model: newModel,
        year: Number(newYear),
        registrationNumber: newReg,
        transmission: newTrans,
        fuelType: newFuel,
      });
      setShowAddCarModal(false);
      setNewMake('');
      setNewModel('');
      setNewReg('');
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const activeBookings = bookings.filter((b) =>
    ['REQUESTED', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );
  const completedBookings = bookings.filter((b) => ['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(b.status));

  return (
    <div className="min-h-screen bg-[#080B10] text-primaryText pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#111722]/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-2xl font-display">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{user?.name}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent uppercase">
                  Customer
                </span>
              </div>
              <p className="text-xs text-secondaryText">{user?.email} • {user?.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Book a Driver</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-3 rounded-xl bg-surface border border-white/10 text-secondaryText hover:text-red-400 hover:border-red-400/30 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 1: My Garage (Personal Vehicles) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">My Garage & Personal Vehicles</h2>
              <p className="text-xs text-secondaryText">Cars registered under your account that our verified drivers will drive.</p>
            </div>
            <button
              onClick={() => setShowAddCarModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-white/10 hover:border-accent text-xs font-semibold text-white transition-all"
            >
              <Plus className="w-4 h-4 text-accent" />
              <span>Add Vehicle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((veh) => (
              <div
                key={veh.id}
                className="p-5 rounded-2xl bg-[#111722]/70 border border-white/5 space-y-3 relative group hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-accent">
                    <Car className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => handleDeleteVehicle(veh.id)}
                    className="p-1.5 rounded-lg text-secondaryText hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{veh.make} {veh.model}</h4>
                  <p className="text-xs font-mono text-accent">{veh.registration_number}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-secondaryText">
                  <span className="font-medium text-slate-300">{veh.transmission}</span>
                  <span>{veh.fuel_type} • {veh.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Active Journey HUD */}
        {activeBookings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span>Active Journeys in Progress</span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-6 rounded-3xl bg-gradient-to-br from-[#161F2E] to-[#111722] border border-accent/40 shadow-2xl space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-accent">{b.reference_code}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-[11px] font-bold text-accent uppercase">
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{b.trip_type} in {b.make} {b.model}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-secondaryText block">Estimated Fare</span>
                      <span className="text-2xl font-mono font-black text-white">₹{Math.round(b.estimated_fare_paise / 100)}</span>
                    </div>
                  </div>

                  {/* Journey Status Step Tracker */}
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {['REQUESTED', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].map((st, i) => {
                      const order = ['REQUESTED', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'];
                      const currentIdx = order.indexOf(b.status);
                      const isComplete = currentIdx >= i;
                      const isCurrent = currentIdx === i;
                      return (
                        <div key={st} className="space-y-1">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isCurrent
                                ? 'bg-accent shadow-lg shadow-accent/50 animate-pulse'
                                : isComplete
                                ? 'bg-emerald-400'
                                : 'bg-surface'
                            }`}
                          />
                          <span className={`text-[10px] uppercase font-bold block ${isCurrent ? 'text-accent' : isComplete ? 'text-white' : 'text-mutedText'}`}>
                            {st.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chauffeur Card & Actions */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center font-bold text-accent">
                        {b.driver_name ? b.driver_name.charAt(0) : 'D'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{b.driver_name || 'Driver Dispatch Pending'}</h4>
                        <p className="text-xs text-secondaryText">{b.driver_phone || 'Contact will appear once accepted'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSupportBookingId(b.id);
                          setSupportSubject(`Assistance for ${b.reference_code}`);
                        }}
                        className="px-4 py-2 rounded-xl bg-surface border border-white/10 hover:border-white/30 text-xs font-semibold text-slate-300"
                      >
                        Help / Emergency
                      </button>
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Booking History */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight">Booking History</h2>

          {completedBookings.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#111722]/50 border border-white/5 text-center text-xs text-secondaryText">
              No completed trips recorded yet. Book your first driver journey!
            </div>
          ) : (
            <div className="space-y-3">
              {completedBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#111722]/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/15 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-300">{b.reference_code}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{b.trip_type} • {b.make} {b.model}</h4>
                    <p className="text-xs text-secondaryText">{b.pickup_address} → {b.destination_address || 'City route'}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-secondaryText block">{b.duration_hours} Hours</span>
                      <span className="text-base font-mono font-bold text-white">₹{Math.round((b.final_fare_paise || b.estimated_fare_paise) / 100)}</span>
                    </div>

                    {b.status === 'COMPLETED' && !b.review_rating && (
                      <button
                        onClick={() => setReviewBookingId(b.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-accent/20 border border-accent/40 text-accent hover:bg-accent hover:text-white text-xs font-bold transition-all"
                      >
                        Rate Chauffeur
                      </button>
                    )}

                    {b.review_rating && (
                      <div className="flex items-center gap-1 text-xs font-bold text-accent font-mono">
                        <Star className="w-3.5 h-3.5 fill-accent" />
                        <span>{b.review_rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rate Chauffeur Modal */}
        {reviewBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl bg-[#0D121B] border border-white/10 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Rate Your Driver Experience</h3>
              <p className="text-xs text-secondaryText">How was the chauffeur driving etiquette, punctuality, and vehicle care?</p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= rating ? 'text-accent fill-accent' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Feedback & Comments</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="e.g. Arrived on time, drove smoothly, handled key handover professionally."
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBookingId(null)}
                    className="px-4 py-2 rounded-xl bg-surface text-secondaryText text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Support Case Modal */}
        {supportBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl bg-[#0D121B] border border-white/10 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Submit Support Ticket</h3>
              <p className="text-xs text-secondaryText">Direct assistance for your booking.</p>

              {supportSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs text-center font-bold">
                  Support ticket created successfully. Our team is reviewing!
                </div>
              ) : (
                <form onSubmit={handleCreateSupportCase} className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Category</label>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    >
                      <option value="Trip Assistance">Trip Assistance</option>
                      <option value="Billing & Invoice">Billing & Invoice</option>
                      <option value="Driver Conduct">Driver Conduct</option>
                      <option value="Vehicle Query">Vehicle Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="Summary of issue"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Details</label>
                    <textarea
                      rows={3}
                      required
                      value={supportDesc}
                      onChange={(e) => setSupportDesc(e.target.value)}
                      placeholder="Please explain in detail..."
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSupportBookingId(null)}
                      className="px-4 py-2 rounded-xl bg-surface text-secondaryText text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

