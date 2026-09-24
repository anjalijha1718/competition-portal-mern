import React from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

export const AdHerePlaceholder = () => {
  return (
    <div className="border border-dashed border-cyan-300 bg-cyan-50/50 rounded-2xl p-4 text-center space-y-1.5 transition-colors hover:bg-cyan-50">
      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-100 text-cyan-800">
        <Megaphone className="w-3.5 h-3.5" />
      </div>
      <p className="text-xs font-bold text-slate-800">Promote Your Dance Academy or Brand Here</p>
      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
        Reach thousands of aspiring classical dancers & performing artists across India.
      </p>
      <a
        href="mailto:partnerships@feedants.com"
        className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-800 hover:underline pt-1"
      >
        <span>Partner with Feedants</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
