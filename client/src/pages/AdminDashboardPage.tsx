import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Driver, Booking, PricingRule, SupportCase, AuditLog } from '../types/index.js';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Car,
  DollarSign,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  History,
  LogOut,
  Search,
  Eye,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'bookings' | 'pricing' | 'support' | 'audit'>('overview');
  const [summary, setSummary] = useState<any>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [supportCases, setSupportCases] = useState<SupportCase[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [decisionReason, setDecisionReason] = useState('Documents verified with regional transport office.');

  // Selected Booking Event History Modal
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sumRes, drvRes, bRes, prRes, supRes, audRes] = await Promise.all([
        api.getAdminSummary(),
        api.getAdminDrivers(),
        api.getBookings(),
        api.getPricingRules(),
        api.getSupportCases(),
        api.getAuditLogs(),
      ]);

      setSummary(sumRes.metrics);
      setDrivers(drvRes.drivers || []);
      setBookings(bRes.bookings || []);
      setPricingRules(prRes.rules || []);
      setSupportCases(supRes.cases || []);
      setAuditLogs(audRes.logs || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDriverDecision = async (driverId: number, decision: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
    try {
      await api.reviewDriverDecision(driverId, decision, decisionReason);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResolveSupport = async (caseId: number) => {
    try {
      await api.resolveSupportCase(caseId, 'RESOLVED', 'Reviewed by Operations Admin.');
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleViewBookingDetails = async (bookingId: number) => {
    try {
      const res = await api.getBookingDetails(bookingId);
      setSelectedBookingDetails(res);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-primaryText pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#111722]/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-2xl font-display">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Operations Admin Console</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-secondaryText">Real-time driver verification, dispatch monitoring & platform controls.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-white/10 hover:border-red-400/40 text-xs font-semibold text-secondaryText hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Console</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-surface border border-white/5 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'drivers', label: `Driver Verification (${summary?.pendingDrivers || 0} Pending)` },
            { id: 'bookings', label: 'Bookings & Dispatch' },
            { id: 'pricing', label: 'Pricing Rules & Commission' },
            { id: 'support', label: `Support Desk (${summary?.openCases || 0})` },
            { id: 'audit', label: 'Audit Trail' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-white shadow-md font-bold'
                  : 'text-secondaryText hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: OVERVIEW METRICS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-[#111722] border border-white/5 space-y-1">
                <span className="text-xs text-secondaryText font-medium">Gross Booking Value</span>
                <div className="text-3xl font-mono font-black text-white">
                  ₹{summary ? Math.round(summary.grossBookingValuePaise / 100) : 0}
                </div>
                <span className="text-[11px] text-emerald-400">Total customer transactions</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#111722] border border-white/5 space-y-1">
                <span className="text-xs text-secondaryText font-medium">Platform Commission (15%)</span>
                <div className="text-3xl font-mono font-black text-accent">
                  ₹{summary ? Math.round(summary.totalCommissionPaise / 100) : 0}
                </div>
                <span className="text-[11px] text-accent">DriverOnDemand net revenue</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#111722] border border-white/5 space-y-1">
                <span className="text-xs text-secondaryText font-medium">Driver Payouts (85%)</span>
                <div className="text-3xl font-mono font-black text-slate-300">
                  ₹{summary ? Math.round(summary.totalDriverPayoutsPaise / 100) : 0}
                </div>
                <span className="text-[11px] text-secondaryText">Disbursed to verified drivers</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#111722] border border-white/5 space-y-1">
                <span className="text-xs text-secondaryText font-medium">Active Trips Right Now</span>
                <div className="text-3xl font-mono font-black text-emerald-400 flex items-center gap-2">
                  <span>{summary?.activeBookings || 0}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-[11px] text-secondaryText">Underway in customer cars</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#111722] border border-white/5 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Driver Network</h4>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-secondaryText">Total Registered Drivers</span>
                  <span className="font-bold text-white font-mono">{summary?.totalDrivers || 0}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-secondaryText">Approved & Active Chauffeurs</span>
                  <span className="font-bold text-emerald-400 font-mono">{summary?.approvedDrivers || 0}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-secondaryText">Pending Review Applications</span>
                  <span className="font-bold text-amber-400 font-mono">{summary?.pendingDrivers || 0}</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#111722] border border-white/5 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Booking Volume</h4>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-secondaryText">Total Bookings Recorded</span>
                  <span className="font-bold text-white font-mono">{summary?.totalBookings || 0}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-secondaryText">Safely Completed Trips</span>
                  <span className="font-bold text-emerald-400 font-mono">{summary?.completedBookings || 0}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-secondaryText">Cancellations</span>
                  <span className="font-bold text-red-400 font-mono">{summary?.cancelledBookings || 0}</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#111722] border border-white/5 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Trust & Support</h4>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-secondaryText">Open Support Cases</span>
                  <span className="font-bold text-amber-400 font-mono">{summary?.openCases || 0}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-secondaryText">Customer Accounts</span>
                  <span className="font-bold text-white font-mono">{summary?.totalCustomers || 0}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-secondaryText">Safety Escalations</span>
                  <span className="font-bold text-emerald-400 font-mono">0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DRIVER VERIFICATION ================= */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Driver Application & Verification Desk</h2>
              <p className="text-xs text-secondaryText">Inspect driver licenses, verify experience, and authorize drivers to accept bookings.</p>
            </div>

            <div className="space-y-4">
              {drivers.map((drv) => (
                <div
                  key={drv.id}
                  className="p-6 rounded-2xl bg-[#111722] border border-white/5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center font-bold text-accent text-lg">
                        {drv.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <span>{drv.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              drv.approval_status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : drv.approval_status === 'REJECTED'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {drv.approval_status}
                          </span>
                        </h4>
                        <p className="text-xs text-secondaryText">{drv.email} • {drv.phone} • {drv.experience_years} Yrs Exp</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-secondaryText block">Preferred Service Area</span>
                      <span className="text-xs font-semibold text-white">{drv.service_area}</span>
                    </div>
                  </div>

                  {/* Document & Bio Details */}
                  <div className="p-4 rounded-xl bg-[#080B10] border border-white/5 space-y-2 text-xs">
                    <div className="text-slate-300">
                      <strong>Chauffeur Bio:</strong> {drv.bio}
                    </div>
                    {drv.documents && drv.documents.length > 0 && (
                      <div className="flex items-center gap-4 pt-1">
                        <span className="text-secondaryText">Documents on file:</span>
                        {drv.documents.map((doc) => (
                          <span key={doc.id} className="font-mono text-accent bg-surface px-2 py-0.5 rounded">
                            📄 {doc.document_type} ({doc.review_status})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Admin Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {drv.approval_status !== 'APPROVED' && (
                      <button
                        onClick={() => handleDriverDecision(drv.id, 'APPROVED')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase transition-all shadow-md"
                      >
                        Approve Driver
                      </button>
                    )}

                    {drv.approval_status !== 'REJECTED' && (
                      <button
                        onClick={() => handleDriverDecision(drv.id, 'REJECTED')}
                        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold uppercase transition-all"
                      >
                        Reject Application
                      </button>
                    )}

                    {drv.approval_status === 'APPROVED' && (
                      <button
                        onClick={() => handleDriverDecision(drv.id, 'SUSPENDED')}
                        className="px-4 py-2 rounded-xl bg-surface border border-white/10 hover:border-red-400 text-secondaryText hover:text-red-400 text-xs font-semibold"
                      >
                        Suspend Account
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: BOOKINGS & DISPATCH ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Booking Dispatch & Lifecycle</h2>
              <p className="text-xs text-secondaryText">Monitor all active customer car journeys and inspect complete status event trails.</p>
            </div>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#111722] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/15 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-accent">{b.reference_code}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface text-slate-300">
                        {b.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      Customer: {b.customer_name} • Car: {b.make} {b.model} ({b.registration_number})
                    </h4>
                    <p className="text-xs text-secondaryText">
                      Chauffeur: {b.driver_name || 'Unassigned'} • {b.pickup_address}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-secondaryText block">{b.duration_hours} hrs</span>
                      <span className="text-base font-mono font-bold text-white">₹{Math.round((b.final_fare_paise || b.estimated_fare_paise) / 100)}</span>
                    </div>

                    <button
                      onClick={() => handleViewBookingDetails(b.id)}
                      className="p-2 rounded-xl bg-surface hover:bg-surfaceLight text-secondaryText hover:text-white transition-colors"
                      title="Inspect event audit trail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PRICING RULES & COMMISSION ================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Configurable Pricing Rules</h2>
              <p className="text-xs text-secondaryText">Configure base fees, hourly rates, minimum hours, and platform commission splits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pricingRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-6 rounded-2xl bg-[#111722] border border-white/5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{rule.trip_type}</h4>
                      <p className="text-xs text-secondaryText">{rule.service_area}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-accent/20 text-accent font-bold text-[10px]">
                      {rule.platform_commission_pct}% Commission
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs border-t border-b border-white/5 py-3">
                    <div>
                      <span className="text-secondaryText text-[10px] block">Base Fee</span>
                      <span className="font-mono font-bold text-white">₹{Math.round(rule.base_fee_paise / 100)}</span>
                    </div>
                    <div>
                      <span className="text-secondaryText text-[10px] block">Hourly Rate</span>
                      <span className="font-mono font-bold text-white">₹{Math.round(rule.hourly_rate_paise / 100)}/hr</span>
                    </div>
                    <div>
                      <span className="text-secondaryText text-[10px] block">Min Duration</span>
                      <span className="font-mono font-bold text-white">{rule.min_hours} Hours</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: SUPPORT CASES ================= */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Customer & Driver Support Cases</h2>
              <p className="text-xs text-secondaryText">Manage complaints, billing disputes, and road trip inquiries.</p>
            </div>

            <div className="space-y-3">
              {supportCases.map((sc) => (
                <div
                  key={sc.id}
                  className="p-5 rounded-2xl bg-[#111722] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-accent">CASE #{sc.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sc.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {sc.status}
                      </span>
                      <span className="text-xs text-slate-400">• {sc.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{sc.subject}</h4>
                    <p className="text-xs text-secondaryText">"{sc.description}"</p>
                    <p className="text-[10px] text-mutedText">From: {sc.creator_name} ({sc.creator_email})</p>
                  </div>

                  {sc.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolveSupport(sc.id)}
                      className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase transition-all"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: AUDIT LOGS ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">System Audit Trail</h2>
              <p className="text-xs text-secondaryText">Immutable log of all administrative actions, approvals, and overrides.</p>
            </div>

            <div className="rounded-2xl bg-[#111722] border border-white/5 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080B10] text-secondaryText uppercase text-[10px] font-bold border-b border-white/5">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface/30">
                      <td className="p-3 text-secondaryText">{log.created_at}</td>
                      <td className="p-3 text-white font-sans">{log.actor_name || 'Admin'}</td>
                      <td className="p-3 text-accent font-bold">{log.action}</td>
                      <td className="p-3 text-slate-300">{log.target_type} #{log.target_id}</td>
                      <td className="p-3 text-mutedText text-[11px] truncate max-w-xs">{log.metadata}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Event History Modal */}
        {selectedBookingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-2xl bg-[#0D121B] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  Booking History: {selectedBookingDetails.booking.reference_code}
                </h3>
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="text-secondaryText hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {selectedBookingDetails.events.map((ev: any) => (
                  <div key={ev.id} className="p-3 rounded-xl bg-surface border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-accent">
                      <span>{ev.old_status || 'START'} → {ev.new_status}</span>
                      <span className="text-secondaryText text-[10px]">{ev.created_at}</span>
                    </div>
                    <div className="text-slate-300 font-sans">{ev.reason}</div>
                    <div className="text-[10px] text-mutedText">Actor: {ev.actor_name} ({ev.actor_role})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

