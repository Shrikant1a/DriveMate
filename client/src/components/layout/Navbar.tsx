import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import {
  Car,
  Shield,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Compass,
  PhoneCall,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (defaultTab?: 'login' | 'registerCustomer' | 'registerDriver') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = async (role: any) => {
    setDemoMenuOpen(false);
    await loginAsDemo(role);
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'DRIVER') navigate('/driver');
    else navigate('/customer');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'DRIVER') return '/driver';
    return '/customer';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080B10]/80 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#FF8533] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080B10] rounded-[10px] flex items-center justify-center">
                <Car className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-accent transition-colors">
                  Drive<span className="text-accent">Mate</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-accent/20 text-accent border border-accent/30 tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-secondaryText tracking-wider hidden sm:block">
                Your Car • Your Driver • Your Journey
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-secondaryText">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#exploded-view" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>3D Vehicle View</span>
            </a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#safety" className="hover:text-white transition-colors">Safety Standards</a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-white/10 hover:border-accent text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-accent" />
                <span>Demo Accounts</span>
                <ChevronDown className="w-3 h-3 text-secondaryText" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111722] border border-white/10 shadow-2xl p-2 z-50">
                  <div className="text-[10px] uppercase font-bold text-secondaryText px-2 py-1">Instant Demo Switch</div>
                  <button
                    onClick={() => handleDemoLogin('CUSTOMER')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-surface text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span>Customer (Alex Patel)</span>
                    <span className="text-[10px] text-accent">3 Cars</span>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('DRIVER')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-surface text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span>Approved Driver (Vikramjit)</span>
                    <span className="text-[10px] text-emerald-400">★ 4.96</span>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('ADMIN')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-surface text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span>Admin Operations Console</span>
                    <span className="text-[10px] text-purple-400">Full Access</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#161F2E] border border-white/10 hover:border-accent text-sm text-white transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-xs font-bold text-accent">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-accent font-medium leading-none">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-secondaryText" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#111722] border border-white/10 shadow-2xl p-2 z-50">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-surface text-slate-200 hover:text-white flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-accent" />
                      <span>My Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-red-500/10 text-red-400 hover:text-red-300 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-semibold text-white hover:text-accent transition-colors"
                >
                  Sign In
                </button>
                <Link
                  to="/book"
                  className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105 active:scale-95"
                >
                  Book a Driver
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/book"
              className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-bold tracking-wide"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surface text-secondaryText hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F17] border-b border-white/10 px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-300">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">How It Works</a>
            <a href="#exploded-view" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5 text-accent">3D Vehicle View</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">Services</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">Pricing</a>
            <a href="#safety" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">Safety</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">Reviews</a>
          </div>

          {isAuthenticated ? (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-surface border border-white/10 text-white font-bold text-xs"
              >
                Go to {user?.role} Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs text-red-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2.5 rounded-xl bg-surface text-white text-xs font-bold"
              >
                Customer / Driver Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDemoLogin('CUSTOMER');
                }}
                className="w-full py-2 rounded-xl bg-accent/20 border border-accent/40 text-accent text-xs font-bold"
              >
                Instant 1-Click Demo Login
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
