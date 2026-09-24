import React from 'react';
import { X, Play, Sparkles } from 'lucide-react';

export const VideoModal = ({ isOpen, onClose, judge }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="p-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100">
              {judge?.name || 'Judge'} — Intro Video & Guidelines
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player / Simulated Video Canvas */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80"
            alt="Kathak Dance"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-700/90 text-white flex items-center justify-center shadow-lg animate-soft-pulse">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Guru Manju Dubey</p>
                <p className="text-[11px] text-cyan-200">
                  "Tips on Angashuddhi, Taal discipline & expressive Abhinaya"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2 bg-slate-950/60 text-xs text-slate-300">
          <p className="font-semibold text-white">Judge's Message for Participants:</p>
          <p className="text-[11px] leading-relaxed text-slate-400">
            "Remember that Classical dance is storytelling through movement. Maintain crisp footwork, express genuine emotions, and adhere strictly to the traditional raag and taal. Best wishes to all participants!"
          </p>
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-xl transition-all"
            >
              Close Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
