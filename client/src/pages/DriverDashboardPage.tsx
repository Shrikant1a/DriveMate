import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Booking, DriverDocument } from '../types/index.js';
import {
  ShieldAlert,
  ShieldCheck,
  Power,
  Clock,
  MapPin,
  Car,
  CheckCircle2,
  XCircle,
  FileText,
  Wallet,
  Star,
  Upload,
  AlertCircle,
  ArrowRight,
  LogOut,
  Navigation,
} from 'lucide-react';

export const DriverDashboardPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<DriverDocument[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Document Upload State
  const [docType, setDocType] = useState('DRIVING_LICENSE');
  const [docExpiry, setDocExpiry] = useState('2030-12-31');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, reqRes, earnRes, allBookingsRes] = await Promise.all([
        api.getDriverStatus(),
        api.getIncomingRequests(),
        api.getDriverEarnings(),
        api.getBookings(),
      ]);

      setProfile(statusRes.profile);
      setDocuments(statusRes.documents || []);
      setIsOnline(statusRes.profile?.availability === 'ONLINE');
      setIncomingRequests(reqRes.requests || []);
      setEarnings(earnRes);

      // Find any ongoing trip assigned to this driver
      const ongoing = (allBookingsRes.bookings || []).find((b: Booking) =>
        ['ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
      );
      setActiveBooking(ongoing || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load driver dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleOnline = async () => {
    setError(null);
    const newStatus = isOnline ? 'OFFLINE' : 'ONLINE';
    try {
      await api.updateAvailability(newStatus);
      setIsOnline(!isOnline);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAcceptRequest = async (bookingId: number) => {
    setActionLoading(true);
    try {
      await api.acceptBooking(bookingId);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineRequest = async (bookingId: number) => {
    setActionLoading(true);
    try {
      await api.declineBooking(bookingId);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProgressTrip = async (bookingId: number, nextStatus: string) => {
    setActionLoading(true);
    try {
      await api.updateBookingStatus(bookingId, nextStatus, `Driver updated status to ${nextStatus}`);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.uploadDocument({
        documentType: docType,
        filePath: `/uploads/license_${Date.now()}.pdf`,
        expiryDate: docExpiry,
      });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const isApproved = profile?.approval_status === 'APPROVED';

  return (
    <div className="min-h-screen bg-[#080B10] text-primaryText pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header & Availability Switch */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#111722]/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-[#162032] border border-white/10 flex items-center justify-center text-white font-bold text-2xl font-display">
              {user?.name?.charAt(0) || 'D'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{user?.name}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isApproved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {profile?.approval_status || 'PENDING'}
                </span>
              </div>
              <p className="text-xs text-secondaryText">
                {profile?.experience_years} Years Experience • {profile?.service_area}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Online / Offline Switch */}
            <button
              onClick={handleToggleOnline}
              disabled={!isApproved}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                isOnline
                  ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                  : 'bg-surface border border-white/10 text-secondaryText hover:text-white'
              } ${!isApproved ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
            >
              <Power className="w-4 h-4" />
              <span>{isOnline ? 'Online • Accepting Trips' : 'Offline'}</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-3 rounded-2xl bg-surface border border-white/10 text-secondaryText hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verification Alert if Not Approved */}
        {!isApproved && (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Application Under Review</h4>
                <p className="text-xs text-secondaryText">
                  Only admin-approved drivers can accept bookings or go online. Ensure your Driving License document is submitted below.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded bg-amber-500/20">
              Status: {profile?.approval_status}
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#111722]/80 border border-white/5 space-y-1">
            <span className="text-[11px] text-secondaryText font-medium">Total Net Earnings</span>
            <div className="text-2xl font-mono font-black text-white">
              ₹{earnings ? Math.round(earnings.stats.total_earnings_paise / 100) : 0}
            </div>
            <span className="text-[10px] text-emerald-400">Direct weekly settlement</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111722]/80 border border-white/5 space-y-1">
            <span className="text-[11px] text-secondaryText font-medium">Trips Completed</span>
            <div className="text-2xl font-mono font-black text-white">
              {earnings ? earnings.stats.total_trips : 0}
            </div>
            <span className="text-[10px] text-secondaryText">Zero accident record</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111722]/80 border border-white/5 space-y-1">
            <span className="text-[11px] text-secondaryText font-medium">Customer Rating</span>
            <div className="text-2xl font-mono font-black text-accent flex items-center gap-1">
              <span>{profile?.rating_avg || '5.0'}</span>
              <Star className="w-5 h-5 fill-accent" />
            </div>
            <span className="text-[10px] text-secondaryText">({profile?.rating_count || 0} reviews)</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111722]/80 border border-white/5 space-y-1">
            <span className="text-[11px] text-secondaryText font-medium">Platform Fee Rate</span>
            <div className="text-2xl font-mono font-black text-white">15%</div>
            <span className="text-[10px] text-emerald-400">85% retained by driver</span>
          </div>
        </div>

        {/* Section: ACTIVE TRIP CONTROLLER HUD */}
        {activeBooking && (
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#161F2E] via-[#111722] to-[#0D121B] border-2 border-accent shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-[10px] font-bold text-accent uppercase">
                  Active Mission • {activeBooking.status.replace('_', ' ')}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Trip Reference: {activeBooking.reference_code}
                </h3>
                <p className="text-xs text-secondaryText">
                  Customer Car: <strong className="text-white">{activeBooking.make} {activeBooking.model}</strong> ({activeBooking.registration_number}) • {activeBooking.transmission}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-secondaryText block">Expected Payout</span>
                <span className="text-2xl font-mono font-black text-emerald-400">
                  ₹{Math.round(activeBooking.driver_payout_paise! / 100)}
                </span>
              </div>
            </div>

            {/* Pickup & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#080B10] border border-white/5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-secondaryText">Customer Pickup Point</span>
                <div className="text-white font-medium flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{activeBooking.pickup_address}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-secondaryText">Passenger Contact</span>
                <div className="text-white font-medium flex items-center gap-1.5">
                  <span>{activeBooking.customer_name} ({activeBooking.customer_phone})</span>
                </div>
              </div>
            </div>

            {/* Server-Enforced Status Progression Controller */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Step-by-Step Trip Progress
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* 1. En Route */}
                <button
                  onClick={() => handleProgressTrip(activeBooking.id, 'EN_ROUTE')}
                  disabled={activeBooking.status !== 'ACCEPTED' || actionLoading}
                  className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    activeBooking.status === 'EN_ROUTE'
                      ? 'bg-accent text-white shadow-lg shadow-accent/30'
                      : activeBooking.status === 'ACCEPTED'
                      ? 'bg-surface border border-accent/40 text-accent hover:bg-accent hover:text-white'
                      : 'bg-surface/30 text-mutedText cursor-not-allowed'
                  }`}
                >
                  1. En Route to Pickup
                </button>

                {/* 2. Arrived at Car */}
                <button
                  onClick={() => handleProgressTrip(activeBooking.id, 'ARRIVED')}
                  disabled={activeBooking.status !== 'EN_ROUTE' || actionLoading}
                  className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    activeBooking.status === 'ARRIVED'
                      ? 'bg-accent text-white shadow-lg shadow-accent/30'
                      : activeBooking.status === 'EN_ROUTE'
                      ? 'bg-surface border border-accent/40 text-accent hover:bg-accent hover:text-white'
                      : 'bg-surface/30 text-mutedText cursor-not-allowed'
                  }`}
                >
                  2. Arrived at Car
                </button>

                {/* 3. Start Journey (Key Handover Done) */}
                <button
                  onClick={() => handleProgressTrip(activeBooking.id, 'IN_PROGRESS')}
                  disabled={activeBooking.status !== 'ARRIVED' || actionLoading}
                  className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    activeBooking.status === 'IN_PROGRESS'
                      ? 'bg-accent text-white shadow-lg shadow-accent/30'
                      : activeBooking.status === 'ARRIVED'
                      ? 'bg-surface border border-accent/40 text-accent hover:bg-accent hover:text-white'
                      : 'bg-surface/30 text-mutedText cursor-not-allowed'
                  }`}
                >
                  3. Handover & Start
                </button>

                {/* 4. Complete Trip */}
                <button
                  onClick={() => handleProgressTrip(activeBooking.id, 'COMPLETED')}
                  disabled={activeBooking.status !== 'IN_PROGRESS' || actionLoading}
                  className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    activeBooking.status === 'IN_PROGRESS'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-surface/30 text-mutedText cursor-not-allowed'
                  }`}
                >
                  4. Complete Journey
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section: Incoming Booking Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Incoming Trip Dispatch</span>
              {incomingRequests.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-accent text-white text-xs font-mono font-bold flex items-center justify-center">
                  {incomingRequests.length}
                </span>
              )}
            </h2>
            <button
              onClick={fetchData}
              className="text-xs text-accent hover:text-white transition-colors"
            >
              Refresh Dispatch
            </button>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#111722]/50 border border-white/5 text-center text-xs text-secondaryText">
              No new incoming requests right now. Keep your status Online to receive instant customer trips.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 rounded-2xl bg-[#111722] border border-accent/30 shadow-xl space-y-4 relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-accent block">{req.reference_code}</span>
                      <h4 className="text-base font-bold text-white">{req.trip_type}</h4>
                      <p className="text-xs text-secondaryText">
                        Customer Car: <strong className="text-white">{req.make} {req.model}</strong> ({req.transmission})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-secondaryText block">Driver Payout</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">
                        ₹{Math.round(req.driver_payout_paise! / 100)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{req.pickup_address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondaryText">
                      <Clock className="w-4 h-4 text-secondaryText shrink-0" />
                      <span>{req.start_time} ({req.duration_hours} billable hours)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      disabled={actionLoading || !isApproved}
                      className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                      Accept Booking
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      disabled={actionLoading}
                      className="px-4 py-2.5 rounded-xl bg-surface hover:bg-surfaceLight text-secondaryText hover:text-white text-xs font-semibold"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Driver Document Verification & Upload */}
        <div className="rounded-3xl bg-[#111722]/80 border border-white/10 p-6 sm:p-8 space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Driver Verification Documents</h2>
              <p className="text-xs text-secondaryText">Your submitted identity and transport license credentials.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Document List */}
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="p-5 rounded-2xl bg-surface/50 text-xs text-secondaryText">
                  No documents on file yet. Upload your license below.
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-surface border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-accent" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{doc.document_type}</h4>
                        <p className="text-[10px] text-secondaryText font-mono">Status: {doc.review_status}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        doc.review_status === 'VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {doc.review_status}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Upload Document Form */}
            <form onSubmit={handleUploadDocument} className="p-5 rounded-2xl bg-[#080B10] border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Upload New Document</h4>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Document Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                >
                  <option value="DRIVING_LICENSE">Commercial / Private Driving License</option>
                  <option value="AADHAAR_ID">Government Photo ID</option>
                  <option value="POLICE_VERIFICATION">Police Verification Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Document Expiry Date</label>
                <input
                  type="date"
                  value={docExpiry}
                  onChange={(e) => setDocExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload & Submit for Audit</span>
              </button>

              {uploadSuccess && (
                <div className="text-center text-[11px] font-bold text-emerald-400">
                  Document submitted! Our compliance officer will audit it within 24 hours.
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

