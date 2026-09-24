import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';
import { Card } from './CommonUI';

export const PreviousWinners = ({ winners = [], onViewAll }) => {
  if (!winners || winners.length === 0) return null;

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950',
          label: '🥇 1st',
        };
      case 2:
        return {
          bg: 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900',
          label: '🥈 2nd',
        };
      case 3:
        return {
          bg: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
          label: '🥉 3rd',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800',
          label: `#${rank}`,
        };
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" />
          Previous Edition Winners
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-cyan-800 hover:text-cyan-900 flex items-center gap-0.5 active:scale-95 transition-all"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
        {winners.map((winner, idx) => {
          const rankInfo = getRankBadge(winner.rank);
          return (
            <div
              key={idx}
              className="flex-shrink-0 w-28 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100/90 text-center flex flex-col items-center gap-1.5 hover:shadow-xs transition-shadow"
            >
              <div className="relative">
                <img
                  src={
                    winner.imageUrl ||
                    `https://images.unsplash.com/photo-${1534528741775 + idx * 100}?auto=format&fit=crop&w=150&q=80`
                  }
                  alt={winner.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <span
                  className={`absolute -bottom-1 -right-1 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-2xs ${rankInfo.bg}`}
                >
                  {rankInfo.label}
                </span>
              </div>
              <div className="w-full">
                <p className="text-xs font-bold text-slate-800 truncate" title={winner.name}>
                  {winner.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Dance Guru</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
