import React from 'react';
import { X, Trophy, Award, Star } from 'lucide-react';

export const WinnersModal = ({ isOpen, onClose, winners = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Hall of Fame — Previous Winners
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          {winners.map((winner, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    winner.imageUrl ||
                    `https://images.unsplash.com/photo-${1534528741775 + idx * 100}?auto=format&fit=crop&w=150&q=80`
                  }
                  alt={winner.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{winner.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Classical Performer</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {winner.badge || `${winner.rank}st Place`}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
