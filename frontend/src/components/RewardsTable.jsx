import React from 'react';
import { Trophy, Award, Gift } from 'lucide-react';
import { Card } from './CommonUI';

export const RewardsTable = ({ rewards = [] }) => {
  if (!rewards || rewards.length === 0) return null;

  const getPositionStyling = (position) => {
    switch (position) {
      case 1:
        return {
          icon: '🥇',
          bg: 'bg-amber-50/80 border-amber-200/80 text-amber-950 font-bold',
          badge: 'bg-amber-400 text-amber-950',
        };
      case 2:
        return {
          icon: '🥈',
          bg: 'bg-slate-50 border-slate-200/80 text-slate-800 font-semibold',
          badge: 'bg-slate-300 text-slate-800',
        };
      case 3:
        return {
          icon: '🥉',
          bg: 'bg-amber-50/40 border-amber-200/40 text-amber-900 font-semibold',
          badge: 'bg-amber-600 text-white',
        };
      default:
        return {
          icon: '🎖️',
          bg: 'bg-white border-slate-100 text-slate-700',
          badge: 'bg-slate-100 text-slate-600',
        };
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-cyan-700" />
          Prize Distribution Breakdown
        </h2>
        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
          Total ₹1,500
        </span>
      </div>

      <div className="space-y-1.5">
        {rewards.map((reward) => {
          const style = getPositionStyling(reward.position);
          return (
            <div
              key={reward.position}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${style.bg}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{style.icon}</span>
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    {reward.title || `Position ${reward.position}`}
                  </span>
                  {reward.position <= 3 && (
                    <span className="text-[10px] text-slate-500 block font-normal">
                      Cash + Official Digital Certificate
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-slate-900">
                  ₹{reward.amount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
