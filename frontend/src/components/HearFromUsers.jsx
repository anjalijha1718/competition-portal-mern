import React, { useState } from 'react';
import { Star, ChevronRight, MessageSquareQuote, ChevronDown } from 'lucide-react';
import { Card } from './CommonUI';

export const HearFromUsers = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const reviews = [
    {
      name: 'Pooja Iyer',
      city: 'Chennai',
      quote: 'The constructive feedback from Guru Manju Dubey helped me refine my abhinaya immensely!',
      rating: 5,
    },
    {
      name: 'Vikram Joshi',
      city: 'Pune',
      quote: 'Prize money was credited in my bank via UPI within 24 hours of result announcement. Transparent platform!',
      rating: 5,
    },
  ];

  return (
    <Card className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left active:scale-98 transition-all"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Hear from past performers</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-700">4.9/5</span>
              <span className="text-[10px] text-slate-400">(840+ reviews)</span>
            </div>
          </div>
        </div>

        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
              <p className="italic text-slate-700 font-medium">"{rev.quote}"</p>
              <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-500">
                <span className="font-bold text-slate-800">{rev.name}</span>
                <span>{rev.city}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
