import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBar = ({ text }) => {
  return (
    <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2.5 text-slate-600">
      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-[11px] leading-relaxed font-medium">
        {text ||
          'Feedants reserves the right to verify submissions. Decisions by the judge are final and binding. In case of duplicate entries or copyright infringement, the entry will be disqualified.'}
      </p>
    </div>
  );
};
