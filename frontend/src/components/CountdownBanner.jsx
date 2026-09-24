import React from 'react';
import { Clock, Flame, AlertCircle } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

export const CountdownBanner = ({ targetDate, onExpire, isClosed = false }) => {
  const { days, hours, minutes, seconds, isExpired, daysStr, hoursStr, minutesStr, secondsStr } =
    useCountdown(targetDate, onExpire);

  if (isClosed || isExpired) {
    return (
      <div className="bg-slate-800 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">Registration Closed</p>
            <p className="text-[11px] text-slate-300">The registration deadline for this competition has passed.</p>
          </div>
        </div>
        <span className="text-[11px] font-bold bg-slate-700 text-slate-200 px-2.5 py-1 rounded-full">
          Closed
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-cyan-900 via-teal-900 to-slate-900 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between border border-cyan-800/40">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold tracking-tight text-cyan-100">
            Registration closes in
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider bg-rose-500/90 text-white px-1.5 py-0.5 rounded-full animate-bounce">
            <Flame className="w-2.5 h-2.5 fill-white" /> Hurry up!
          </span>
        </div>

        {/* Digits Display */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="flex flex-col items-center">
            <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-sm font-black text-white font-mono min-w-[28px] text-center">
              {daysStr}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-cyan-300 mt-0.5 font-bold">Days</span>
          </div>
          <span className="text-cyan-400 font-bold -mt-3.5">:</span>
          <div className="flex flex-col items-center">
            <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-sm font-black text-white font-mono min-w-[28px] text-center">
              {hoursStr}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-cyan-300 mt-0.5 font-bold">Hours</span>
          </div>
          <span className="text-cyan-400 font-bold -mt-3.5">:</span>
          <div className="flex flex-col items-center">
            <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-sm font-black text-white font-mono min-w-[28px] text-center">
              {minutesStr}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-cyan-300 mt-0.5 font-bold">Mins</span>
          </div>
          <span className="text-cyan-400 font-bold -mt-3.5">:</span>
          <div className="flex flex-col items-center">
            <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-sm font-black text-white font-mono min-w-[28px] text-center">
              {secondsStr}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-cyan-300 mt-0.5 font-bold">Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
