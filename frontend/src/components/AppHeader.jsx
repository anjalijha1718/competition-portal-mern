import React, { useState } from 'react';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AppHeader = ({ title = 'Competition Details' }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('EN');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Feedants Classical Dance Competition',
        text: 'Join the Feedants Classical Dance Competition and win from ₹1,500 prize pool!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-subtle">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-medium text-sm transition-colors py-1 pr-2 rounded-lg active:scale-95"
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4 text-slate-600" />
        <span className="font-semibold text-xs tracking-tight">Go back</span>
      </button>

      {/* Language Toggle */}
      <div className="flex items-center gap-2">
        <div className="bg-slate-100 p-0.5 rounded-full flex items-center border border-slate-200/60 text-xs font-semibold">
          <button
            onClick={() => setLanguage('EN')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-xs ${
              language === 'EN'
                ? 'bg-cyan-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('HI')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-xs ${
              language === 'HI'
                ? 'bg-cyan-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-1.5 rounded-full text-slate-600 hover:text-cyan-700 hover:bg-slate-100 active:scale-95 transition-all relative"
          title="Share Competition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          {copied && (
            <span className="absolute -bottom-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
