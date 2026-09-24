import React, { useState } from 'react';
import { Sliders, User, Clock, CheckCircle2, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DemoBar = ({ currentSlug, onSlugChange, overrideNow, onOverrideNowChange }) => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleQuickLogin = async (email) => {
    setIsLoggingIn(true);
    try {
      await login(email, 'password123');
    } catch (err) {
      console.error('Quick login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs">
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-[11px] tracking-tight text-slate-200">
            Technical Demo Controls
          </span>
          <span className="text-[10px] bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
            {isAuthenticated ? user?.name : 'Guest'}
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-all"
        >
          <Sliders className="w-3 h-3" />
          <span>{isOpen ? 'Hide Controls' : 'Test Scenarios'}</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isOpen && (
        <div className="max-w-md mx-auto px-3 py-3 border-t border-slate-800/80 space-y-3 bg-slate-950 animate-in slide-in-from-top-2 duration-150">
          {/* Quick User Switcher */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              1. Switch User State
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleQuickLogin('demo@feedants.com')}
                disabled={isLoggingIn}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  user?.email === 'demo@feedants.com'
                    ? 'bg-cyan-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                👤 Demo User (New)
              </button>

              <button
                onClick={() => handleQuickLogin('rahul@feedants.com')}
                disabled={isLoggingIn}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  user?.email === 'rahul@feedants.com'
                    ? 'bg-cyan-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                ✓ Rahul (Registered)
              </button>

              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="px-2 py-1 rounded text-[11px] font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-all"
                >
                  Guest (Logout)
                </button>
              )}
            </div>
          </div>

          {/* Competition Scenarios */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              2. Competition Scenario
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  onSlugChange('feedants-classical-dance');
                  onOverrideNowChange(null);
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  currentSlug === 'feedants-classical-dance' && !overrideNow
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                🟢 Live Registration Active
              </button>

              <button
                onClick={() => {
                  onSlugChange('feedants-classical-dance-sold-out');
                  onOverrideNowChange(null);
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  currentSlug === 'feedants-classical-dance-sold-out'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                🔴 Sold Out (20/20 slots full)
              </button>

              <button
                onClick={() => {
                  onSlugChange('feedants-classical-dance-fixed-dates');
                  onOverrideNowChange(null);
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  currentSlug === 'feedants-classical-dance-fixed-dates'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                📅 Design Reference Fixed Dates
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 border-t border-slate-900 pt-1.5">
            💡 Tip: Switch to <strong>Demo User</strong> and click <strong>Register Now</strong> to test slot booking, concurrency lock, and idempotency!
          </p>
        </div>
      )}
    </div>
  );
};
