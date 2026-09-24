import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Card } from './CommonUI';

export const JudgeCard = ({ judge, onWatchIntroVideo }) => {
  if (!judge) return null;

  const {
    name = 'Manju Dubey',
    title = 'Professional Kathak Dancer',
    experienceYears = 12,
    photoUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  } = judge;

  return (
    <Card className="flex items-center justify-between gap-3 bg-white">
      <div className="flex items-center gap-3">
        {/* Judge Avatar */}
        <div className="relative">
          <img
            src={photoUrl}
            alt={name}
            className="w-14 h-14 rounded-full object-cover border-2 border-cyan-700/20 shadow-xs"
          />
          <div className="absolute -bottom-1 -right-1 bg-cyan-700 text-white p-1 rounded-full text-[9px] shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Judge Info */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded">
              Judge & Mentor
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 leading-tight">
            {name}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {title}
          </p>
          <p className="text-[11px] font-semibold text-slate-400">
            {experienceYears}+ yrs experience
          </p>
        </div>
      </div>

      {/* Intro Video Button */}
      <button
        onClick={onWatchIntroVideo}
        className="flex items-center gap-1.5 bg-cyan-50 text-cyan-800 hover:bg-cyan-100/80 active:scale-95 transition-all px-3 py-2 rounded-xl text-xs font-bold border border-cyan-200/60 shadow-2xs whitespace-nowrap shrink-0"
      >
        <div className="w-5 h-5 rounded-full bg-cyan-700 text-white flex items-center justify-center">
          <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
        </div>
        <span>Intro Video</span>
      </button>
    </Card>
  );
};
