import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Vehicle, Driver } from '../types/index.js';
import confetti from 'canvas-confetti';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  AlertCircle,
  Star,
  Fuel,
  Sparkles,
} from 'lucide-react';

export const BookingWizardPage: React.FC = () => {
  const { user, isAuthenticated, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as any) || {};

  const [step, setStep] = useState<number>(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [tripType, setTripType] = useState<string>(prefill.tripType || 'Hourly Booking');
  const [pickupAddress, setPickupAddress] = useState<string>('Penthouse 14B, Marina Tower, Worli, Mumbai');
  const [destinationAddress, setDestinationAddress] = useState<string>('The Taj Mahal Palace, Colaba, Mumbai');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('18:00');
  const [durationHours, setDurationHours] = useState<number>(prefill.durationHours || 4);
  const [notes, setNotes] = useState<string>('Customer personal vehicle. Clean interior, keyless start.');
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);

  // Add Vehicle Modal inside wizard
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [newMake, setNewMake] = useState('Mercedes-Benz');
  const [newModel, setNewModel] = useState('E-Class E350d');
  const [newYear, setNewYear] = useState('2023');
  const [newReg, setNewReg] = useState('MH-01-EA-4921');
  const [newTrans, setNewTrans] = useState<'AUTOMATIC' | 'MANUAL'>('AUTOMATIC');
  const [newFuel, setNewFuel] = useState<'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'>('DIESEL');

  // Booking Result State
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Load customer vehicles & available drivers
  useEffect(() => {
    if (isAuthenticated) {
      loadCustomerVehicles();
    }
    loadAvailableDrivers();
  }, [isAuthenticated]);

  const loadCustomerVehicles = async () => {
    try {
      const res = await api.getVehicles();
      setVehicles(res.vehicles || []);
      if (res.vehicles && res.vehicles.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(res.vehicles[0].id);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const loadAvailableDrivers = async () => {
    try {
      const res = await api.getAvailableDrivers();
      setDrivers(res.drivers || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.addVehicle({
        make: newMake,
        model: newModel,
        year: Number(newYear),
        registrationNumber: newReg,
        transmission: newTrans,
        fuelType: newFuel,
      });
      setShowAddCarModal(false);
      await loadCustomerVehicles();
      if (res.vehicle) {
        setSelectedVehicleId(res.vehicle.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add vehicle.');
    }
  };

  const handleInstantDemoLogin = async () => {
    await loginAsDemo('CUSTOMER');
    await loadCustomerVehicles();
  };

  const calculateFareEstimate = () => {
    const base = tripType.includes('Full-Day') ? 1999 : tripType.includes('Airport') ? 799 : tripType.includes('Outstation') ? 1499 : 499;
    const hourly = tripType.includes('Full-Day') ? 199 : tripType.includes('Airport') ? 279 : tripType.includes('Outstation') ? 349 : 249;
    const subtotal = base + hourly * durationHours;
    const gst = Math.round(subtotal * 0.05);
    return {
      subtotal,
      gst,
      total: subtotal + gst,
    };
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      setError('Please sign in or use 1-click Demo Login before confirming.');
      return;
    }
    if (!selectedVehicleId) {
      setError('Please select or register your vehicle.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const scheduledDateTime = `${startDate} ${startTime}:00`;
      const res = await api.createBooking({
        vehicleId: selectedVehicleId,
        driverId: selectedDriverId,
        tripType,
        pickupAddress,
        destinationAddress,
        startTime: scheduledDateTime,
        durationHours,
        notes,
      });

      setConfirmedBooking(res.booking);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      setError(err.message || 'Failed to confirm booking.');
    } finally {
      setLoading(false);
    }
  };

  const fare = calculateFareEstimate();
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);

  return (
    <div className="min-h-screen bg-[#080B10] text-primaryText pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-secondaryText hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {!isAuthenticated && (
            <button
              onClick={handleInstantDemoLogin}
              className="px-3.5 py-1.5 rounded-xl bg-accent/20 border border-accent/40 text-accent text-xs font-bold hover:bg-accent hover:text-white transition-all shadow-md"
            >
              1-Click Demo Login as Customer (Alex Patel)
            </button>
          )}
        </div>

        {/* Strict Service Reminder Banner */}
        <div className="p-4 rounded-2xl bg-[#111722]/90 border border-accent/30 backdrop-blur-md flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10 border border-accent/30 text-accent shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs text-secondaryText">
            <strong className="text-white">Service Notice:</strong> DriverOnDemand provides verified personal drivers only. 
            The customer supplies their own personal vehicle for the duration of this booking.
          </p>
        </div>

        {/* Wizard Multi-Step Progress Tracker */}
        {!confirmedBooking && (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 p-2 rounded-2xl bg-surface border border-white/5 text-center text-xs font-semibold">
            {[
              { num: 1, label: '1. Select Car' },
              { num: 2, label: '2. Itinerary' },
              { num: 3, label: '3. Choose Driver' },
              { num: 4, label: '4. Fare & Confirm' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`py-2 sm:py-3 rounded-xl transition-all ${
                  step === s.num
                    ? 'bg-accent text-white shadow-lg shadow-accent/20 font-bold'
                    : step > s.num
                    ? 'text-emerald-400 bg-surfaceLight/50'
                    : 'text-secondaryText hover:text-white'
                }`}
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Booking Alert</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* ================= STEP 1: VEHICLE SELECTION ================= */}
        {step === 1 && !confirmedBooking && (
          <div className="rounded-3xl bg-[#111722]/80 border border-white/10 p-6 sm:p-10 space-y-8 backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 1: Select Your Vehicle</h2>
              <p className="text-xs text-secondaryText">
                Choose the personal car our driver will drive, or register a new one.
              </p>
            </div>

            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((veh) => {
                const isSelected = selectedVehicleId === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => setSelectedVehicleId(veh.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-accent/15 border-accent shadow-xl scale-[1.02]'
                        : 'bg-[#080B10] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-accent">
                        <Car className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-white/10 text-slate-300 uppercase">
                        {veh.transmission}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{veh.make} {veh.model}</h4>
                    <p className="text-xs font-mono text-accent mt-0.5">{veh.registration_number}</p>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-secondaryText">
                      <span>{veh.year} • {veh.fuel_type}</span>
                      {isSelected ? (
                        <span className="text-accent font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Selected
                        </span>
                      ) : (
                        <span className="text-mutedText">Select</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add New Vehicle Card Button */}
              <button
                onClick={() => setShowAddCarModal(true)}
                className="p-5 rounded-2xl border border-dashed border-white/20 hover:border-accent bg-[#080B10]/50 hover:bg-surface/50 text-secondaryText hover:text-white transition-all flex flex-col items-center justify-center gap-2 min-h-[170px]"
              >
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-accent">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white">Add Another Vehicle</span>
                <span className="text-[10px] text-mutedText">Register Sedan, SUV, or Hatchback</span>
              </button>
            </div>

            {/* Next Step Action */}
            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  if (!selectedVehicleId) {
                    setError('Please select a vehicle to proceed.');
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105"
              >
                <span>Continue to Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ITINERARY & SCHEDULE ================= */}
        {step === 2 && !confirmedBooking && (
          <div className="rounded-3xl bg-[#111722]/80 border border-white/10 p-6 sm:p-10 space-y-8 backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 2: Trip Itinerary & Schedule</h2>
              <p className="text-xs text-secondaryText">Define your pickup location, destination, and duration.</p>
            </div>

            <div className="space-y-6">
              {/* Trip Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Driving Purpose</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Hourly Booking', 'Full-Day Chauffeur', 'Airport Pickup & Drop', 'Wedding & Party Chauffeur', 'Long-Distance Road Trip'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTripType(t)}
                      className={`p-3 rounded-xl text-left border text-xs font-bold transition-all ${
                        tripType === t
                          ? 'bg-accent/20 border-accent text-white shadow'
                          : 'bg-[#080B10] border-white/5 text-secondaryText hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup & Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Pickup Location (Where your car is parked)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-accent absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="e.g. Marina Vista, Palm Boulevard, Worli"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-mutedText text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Primary Destination / Drop Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-secondaryText absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      placeholder="e.g. The Taj Mahal Palace, Colaba"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder-mutedText text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Date, Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-secondaryText absolute left-3 top-3.5" />
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Start Time</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-secondaryText absolute left-3 top-3.5" />
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Duration: <span className="text-accent font-mono">{durationHours} Hours</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    step="1"
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value))}
                    className="w-full accent-accent mt-3"
                  />
                </div>
              </div>

              {/* Vehicle Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Special Vehicle Handling Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Air suspension needs slow speed over bumps. Dual-clutch gearbox. Child seat in rear."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-surface border border-white/10 text-xs font-semibold text-secondaryText hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-accent/25 hover:scale-105"
              >
                <span>Continue to Driver Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: CHOOSE DRIVER ================= */}
        {step === 3 && !confirmedBooking && (
          <div className="rounded-3xl bg-[#111722]/80 border border-white/10 p-6 sm:p-10 space-y-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">Step 3: Select Your Chauffeur</h2>
                <p className="text-xs text-secondaryText">Choose an approved nearby driver or let our dispatch match automatically.</p>
              </div>

              <button
                onClick={() => {
                  setSelectedDriverId(null);
                  setStep(4);
                }}
                className="px-4 py-2 rounded-xl bg-surface border border-white/10 hover:border-accent text-xs font-semibold text-slate-300 hover:text-white"
              >
                Auto-Assign Nearest Available Driver
              </button>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drivers.map((drv) => {
                const isSelected = selectedDriverId === drv.id;
                return (
                  <div
                    key={drv.id}
                    onClick={() => setSelectedDriverId(drv.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-accent/15 border-accent shadow-xl scale-[1.02]'
                        : 'bg-[#080B10] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-blue-500/20 border border-white/10 flex items-center justify-center font-bold text-white text-lg">
                            {drv.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                              <span>{drv.name}</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
                            </h4>
                            <p className="text-xs text-secondaryText">{drv.experience_years}+ Years Professional Experience</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold font-mono">
                          <Star className="w-3.5 h-3.5 fill-accent" />
                          <span>{drv.rating_avg}</span>
                          <span className="text-[10px] text-secondaryText">({drv.rating_count})</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{drv.bio}"
                      </p>

                      <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-secondaryText">
                        <span className="px-2 py-0.5 rounded bg-surface border border-white/5">
                          ✓ Driving License Verified
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface border border-white/5">
                          ✓ Police Background Cleared
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface border border-white/5">
                          ✓ Defensive Driving Certified
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-secondaryText block">Driver Base Rate</span>
                        <span className="text-sm font-mono font-bold text-white">₹{Math.round(drv.hourly_rate_paise / 100)}/hr</span>
                      </div>

                      <button
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                          isSelected ? 'bg-accent text-white' : 'bg-surface text-secondaryText hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Choose Chauffeur'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-surface border border-white/10 text-xs font-semibold text-secondaryText hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-accent/25 hover:scale-105"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: FARE & CONFIRMATION ================= */}
        {step === 4 && !confirmedBooking && (
          <div className="rounded-3xl bg-[#111722]/80 border border-white/10 p-6 sm:p-10 space-y-8 backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 4: Review & Finalize Booking</h2>
              <p className="text-xs text-secondaryText">Review trip itinerary, selected vehicle, and guaranteed fare.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Summary Cards */}
              <div className="lg:col-span-7 space-y-4">
                {/* Vehicle Details */}
                <div className="p-5 rounded-2xl bg-[#080B10] border border-white/5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Customer Vehicle (We Drive This)</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{selectedVehicle?.make} {selectedVehicle?.model}</h4>
                      <p className="text-xs text-secondaryText font-mono">{selectedVehicle?.registration_number} • {selectedVehicle?.transmission}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-surface border border-white/10 text-xs text-slate-300">
                      {selectedVehicle?.fuel_type}
                    </span>
                  </div>
                </div>

                {/* Itinerary Details */}
                <div className="p-5 rounded-2xl bg-[#080B10] border border-white/5 space-y-3 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Trip Itinerary</span>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="text-secondaryText block text-[11px]">Pickup Point</span>
                        <span className="text-white font-medium">{pickupAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-secondaryText shrink-0 mt-0.5" />
                      <div>
                        <span className="text-secondaryText block text-[11px]">Primary Destination</span>
                        <span className="text-white font-medium">{destinationAddress || 'As per passenger direction'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-secondaryText block text-[11px]">Schedule & Duration</span>
                        <span className="text-white font-medium">{startDate} at {startTime} ({durationHours} Hours)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Driver Details */}
                <div className="p-5 rounded-2xl bg-[#080B10] border border-white/5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Assigned Chauffeur</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent">
                        {selectedDriver ? selectedDriver.name.charAt(0) : 'A'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {selectedDriver ? selectedDriver.name : 'Auto-Assigned Nearest Top Driver'}
                        </h4>
                        <p className="text-xs text-secondaryText">
                          {selectedDriver ? `${selectedDriver.experience_years}+ Yrs Experience • ★ ${selectedDriver.rating_avg}` : 'Verified DriverOnDemand Pro'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                      Background Cleared
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Checkout Card */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#080B10] border border-accent/30 space-y-6 shadow-2xl">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">Total Billable Fare</span>
                  <div className="text-4xl font-display font-black text-white font-mono">
                    ₹{fare.total}
                  </div>
                  <span className="text-[11px] text-secondaryText">Guaranteed price. No surge multipliers.</span>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-white/10 py-4">
                  <div className="flex justify-between text-secondaryText">
                    <span>Base Chauffeur Service Fee</span>
                    <span className="font-mono text-white">₹{fare.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-secondaryText">
                    <span>GST (5%)</span>
                    <span className="font-mono text-white">₹{fare.gst}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                    <span>Vehicle Rental Cost</span>
                    <span>₹0 (Your Car)</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-accent/25 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <span>{loading ? 'Confirming Dispatch...' : 'Confirm Driver Booking'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-mutedText">
                  * By confirming, you verify you are the authorized owner/user of this vehicle.
                </p>
              </div>
            </div>

            <div className="flex justify-start pt-4 border-t border-white/10">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-surface border border-white/10 text-xs font-semibold text-secondaryText hover:text-white"
              >
                Back to Driver Selection
              </button>
            </div>
          </div>
        )}

        {/* ================= SUCCESS CONFIRMATION SCREEN ================= */}
        {confirmedBooking && (
          <div className="rounded-3xl bg-[#111722] border border-accent/40 p-8 sm:p-12 text-center space-y-8 shadow-2xl animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent text-accent mx-auto flex items-center justify-center shadow-lg shadow-accent/30">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-bold font-mono uppercase tracking-widest text-accent">
                Booking Reference: {confirmedBooking.reference_code}
              </span>
              <h2 className="text-3xl font-display font-black text-white">
                Chauffeur Dispatched Successfully!
              </h2>
              <p className="text-sm text-secondaryText">
                Your driver has received your booking request and will reach your pickup location at{' '}
                <strong className="text-white">{confirmedBooking.pickup_address}</strong>.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/customer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-accent/25"
              >
                Go to My Bookings HUD
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface border border-white/10 text-white font-semibold text-xs hover:bg-surfaceLight"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        )}

        {/* ================= ADD NEW CAR MODAL ================= */}
        {showAddCarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-2xl bg-[#0D121B] border border-white/10 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Register Personal Vehicle</h3>
              <p className="text-xs text-secondaryText">Enter the details of the car you would like our driver to drive.</p>

              <form onSubmit={handleCreateVehicle} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Make</label>
                    <input
                      type="text"
                      required
                      value={newMake}
                      onChange={(e) => setNewMake(e.target.value)}
                      placeholder="e.g. BMW"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Model</label>
                    <input
                      type="text"
                      required
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      placeholder="e.g. 530i"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Registration No.</label>
                    <input
                      type="text"
                      required
                      value={newReg}
                      onChange={(e) => setNewReg(e.target.value)}
                      placeholder="MH-01-AB-1234"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Year</label>
                    <input
                      type="number"
                      required
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      min="2000"
                      max="2027"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Transmission</label>
                    <select
                      value={newTrans}
                      onChange={(e) => setNewTrans(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    >
                      <option value="AUTOMATIC">Automatic</option>
                      <option value="MANUAL">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Fuel Type</label>
                    <select
                      value={newFuel}
                      onChange={(e) => setNewFuel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                    >
                      <option value="PETROL">Petrol</option>
                      <option value="DIESEL">Diesel</option>
                      <option value="ELECTRIC">Electric (EV)</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCarModal(false)}
                    className="px-4 py-2 rounded-xl bg-surface text-secondaryText hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

