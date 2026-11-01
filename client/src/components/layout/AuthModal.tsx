import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Car, Key, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'registerCustomer' | 'registerDriver';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'registerCustomer' | 'registerDriver'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register Customer form state
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custPass, setCustPass] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // Register Driver form state
  const [drvName, setDrvName] = useState('');
  const [drvEmail, setDrvEmail] = useState('');
  const [drvPhone, setDrvPhone] = useState('');
  const [drvPass, setDrvPass] = useState('');
  const [drvExp, setDrvExp] = useState('5');
  const [drvArea, setDrvArea] = useState('Mumbai Metro & Airport Corridor');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(loginEmail, loginPass);
      onClose();
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'DRIVER') navigate('/driver');
      else navigate('/customer');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.registerCustomer({
        name: custName,
        email: custEmail,
        phone: custPhone,
        password: custPass,
        address: custAddress,
      });
      // Auto-login after registration
      await login(custEmail, custPass);
      onClose();
      navigate('/customer');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDriverRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.registerDriver({
        name: drvName,
        email: drvEmail,
        phone: drvPhone,
        password: drvPass,
        experienceYears: Number(drvExp),
        serviceArea: drvArea,
      });
      // Auto-login
      await login(drvEmail, drvPass);
      onClose();
      navigate('/driver');
    } catch (err: any) {
      setError(err.message || 'Driver registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role: any) => {
    setError(null);
    setLoading(true);
    try {
      const user = await loginAsDemo(role);
      onClose();
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'DRIVER') navigate('/driver');
      else navigate('/customer');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0D121B] border border-white/10 shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-surface text-secondaryText hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent">DriverOnDemand Access</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white">
            {tab === 'login' && 'Welcome Back'}
            {tab === 'registerCustomer' && 'Create Customer Account'}
            {tab === 'registerDriver' && 'Apply as a Verified Driver'}
          </h3>
          <p className="text-xs text-secondaryText">
            {tab === 'login' && 'Sign in to manage your vehicles, bookings, or chauffeur schedule.'}
            {tab === 'registerCustomer' && 'Book verified drivers to drive your personal car anytime.'}
            {tab === 'registerDriver' && 'Join our elite driver network and earn on flexible terms.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#080B10] border border-white/5 mb-6 text-xs font-semibold">
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              tab === 'login' ? 'bg-surface text-white shadow' : 'text-secondaryText hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('registerCustomer'); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              tab === 'registerCustomer' ? 'bg-surface text-white shadow' : 'text-secondaryText hover:text-white'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => { setTab('registerDriver'); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              tab === 'registerDriver' ? 'bg-surface text-white shadow' : 'text-secondaryText hover:text-white'
            }`}
          >
            Become Driver
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form: Sign In */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-secondaryText absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="alex.patel@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white placeholder-mutedText text-xs focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-secondaryText absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white placeholder-mutedText text-xs focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to DriverOnDemand'}
            </button>
          </form>
        )}

        {/* Form: Register Customer */}
        {tab === 'registerCustomer' && (
          <form onSubmit={handleCustomerRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Alex Patel"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="+91 98200 44556"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Home Address (Optional)</label>
              <input
                type="text"
                value={custAddress}
                onChange={(e) => setCustAddress(e.target.value)}
                placeholder="42 Marina Vista, Worli, Mumbai"
                className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={custPass}
                onChange={(e) => setCustPass(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Customer Registration'}
            </button>
          </form>
        )}

        {/* Form: Register Driver */}
        {tab === 'registerDriver' && (
          <form onSubmit={handleDriverRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={drvName}
                  onChange={(e) => setDrvName(e.target.value)}
                  placeholder="Vikramjit Singh"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={drvPhone}
                  onChange={(e) => setDrvPhone(e.target.value)}
                  placeholder="+91 98111 22334"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={drvEmail}
                  onChange={(e) => setDrvEmail(e.target.value)}
                  placeholder="driver@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  required
                  value={drvExp}
                  onChange={(e) => setDrvExp(e.target.value)}
                  min="2"
                  max="40"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Preferred Service Region</label>
              <input
                type="text"
                required
                value={drvArea}
                onChange={(e) => setDrvArea(e.target.value)}
                placeholder="Mumbai Metro & Airport Corridor"
                className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Create Password</label>
              <input
                type="password"
                required
                value={drvPass}
                onChange={(e) => setDrvPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:border-accent focus:outline-none"
              />
            </div>

            <p className="text-[11px] text-secondaryText leading-relaxed">
              * Note: You will be prompted to submit your Commercial/Personal Driving License on your driver portal before approval.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Submitting Application...' : 'Submit Driver Application'}
            </button>
          </form>
        )}

        {/* 1-Click Instant Demo Login Access (Requested for easy evaluation) */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              1-Click Instant Evaluation
            </span>
            <span className="text-[10px] text-accent font-medium">Pre-loaded demo data</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoClick('CUSTOMER')}
              className="p-2.5 rounded-xl bg-[#111722] border border-white/10 hover:border-accent text-left group transition-all"
            >
              <div className="text-[10px] text-secondaryText font-medium">Customer</div>
              <div className="text-xs font-bold text-white group-hover:text-accent">Alex Patel</div>
            </button>

            <button
              onClick={() => handleDemoClick('DRIVER')}
              className="p-2.5 rounded-xl bg-[#111722] border border-white/10 hover:border-emerald-500 text-left group transition-all"
            >
              <div className="text-[10px] text-emerald-400 font-medium">Driver (Verified)</div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400">Vikramjit</div>
            </button>

            <button
              onClick={() => handleDemoClick('ADMIN')}
              className="p-2.5 rounded-xl bg-[#111722] border border-white/10 hover:border-purple-500 text-left group transition-all"
            >
              <div className="text-[10px] text-purple-400 font-medium">Admin Ops</div>
              <div className="text-xs font-bold text-white group-hover:text-purple-400">Executive</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

