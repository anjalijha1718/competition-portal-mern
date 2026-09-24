import React from 'react';
import { Award, Users, Trophy, Ticket, Flame } from 'lucide-react';
import { Card, Chip, ProgressBar } from './CommonUI';

export const CompetitionHeroCard = ({ competition }) => {
  if (!competition) return null;

  const {
    title,
    category = 'Dance',
    format = 'Multi-Win',
    certificateProvided = true,
    prizePool = 1500,
    entryFee = 99,
    totalSlots = 20,
    bookedSlots = 0,
    bannerUrl,
  } = competition;

  const slotsRemaining = Math.max(0, totalSlots - bookedSlots);
  const isAlmostFull = slotsRemaining <= 3 && slotsRemaining > 0;

  return (
    <Card className="overflow-hidden p-0 border-none shadow-sm">
      {/* Banner Image */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={bannerUrl || 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80'}
          alt={title}
          className="w-full h-full object-cover object-top opacity-90 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Floating Badges on Banner */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Chip variant="primary" className="bg-white/90 backdrop-blur-md text-cyan-900 border-none shadow-sm">
            {category}
          </Chip>
          <Chip variant="teal" className="bg-white/90 backdrop-blur-md text-emerald-900 border-none shadow-sm">
            {format}
          </Chip>
        </div>

        {certificateProvided && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 shadow-md">
              <Award className="w-3.5 h-3.5" />
              Certificate
            </span>
          </div>
        )}

        {/* Registered Count Badge on Banner */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            <strong className="text-white font-bold">{bookedSlots}</strong> Registered
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {title}
          </h1>
          {certificateProvided && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Winners get official digital verified certificate
            </p>
          )}
        </div>

        {/* Prize Pool & Entry Fee Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {/* Prize Pool */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/60 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Prize Pool
              </span>
              <span className="text-lg font-black text-amber-950 tracking-tight">
                ₹{prizePool.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Entry Fee */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-200/60 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white flex items-center justify-center shadow-xs">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Entry Fee
              </span>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                ₹{entryFee}
              </span>
            </div>
          </div>
        </div>

        {/* Slots Left Progress Bar */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              Slots Availability
              {isAlmostFull && (
                <span className="inline-flex items-center gap-0.5 text-red-600 font-bold text-[10px] animate-pulse">
                  <Flame className="w-3 h-3 fill-red-500 text-red-500" /> Fast Filling
                </span>
              )}
            </span>
            <span className="font-bold text-cyan-800">
              {slotsRemaining} slots left
              <span className="text-slate-400 font-normal ml-1">({bookedSlots}/{totalSlots})</span>
            </span>
          </div>
          <ProgressBar current={bookedSlots} total={totalSlots} />
        </div>
      </div>
    </Card>
  );
};
