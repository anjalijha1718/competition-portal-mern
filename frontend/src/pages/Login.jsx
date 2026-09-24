import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { Card } from '../components/CommonUI';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/competitions/feedants-classical-dance');
    } catch (err) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-cyan-800 uppercase tracking-widest">Feedants</span>
          <div className="w-8" />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to participate in dance competitions</p>
        </div>

        {/* Quick Credentials Helper */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
            <span>1-Click Test Accounts:</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillQuickAccount('demo@feedants.com')}
              className="flex-1 py-1 px-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-[11px] font-bold border border-cyan-200 text-center transition-all"
            >
              Demo User (New)
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount('rahul@feedants.com')}
              className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-200 text-center transition-all"
            >
              Rahul (Enrolled)
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@feedants.com"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-700"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-700 hover:bg-cyan-800 active:scale-98 text-white font-extrabold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-cyan-800 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
