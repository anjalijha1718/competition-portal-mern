import React, { useState } from 'react';
import { Info, CheckCircle2, ChevronDown, ChevronUp, Scale, BookOpen } from 'lucide-react';
import { Card } from './CommonUI';

export const TabSection = ({ about, judgingParameters = [], rulesAndEligibility = [] }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="space-y-4">
      {/* Tab Navigation Headers */}
      <div className="flex border-b border-slate-200/80 -mx-4 px-4 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-2.5 px-2 text-xs font-bold transition-all relative whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'about'
              ? 'text-cyan-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          About
          {activeTab === 'about' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-700 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('judging')}
          className={`pb-2.5 px-2 text-xs font-bold transition-all relative whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'judging'
              ? 'text-cyan-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          Judging Parameters
          {activeTab === 'judging' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-700 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-2.5 px-2 text-xs font-bold transition-all relative whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'text-cyan-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Rules & Eligibility
          {activeTab === 'rules' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-700 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Tab 1: About */}
      {activeTab === 'about' && (
        <div className="space-y-2 text-xs leading-relaxed text-slate-600">
          <p className={isExpanded ? '' : 'line-clamp-3'}>
            {about ||
              'Showcase your classical grace in the premier national classical dance challenge by Feedants! Whether you practice Kathak, Bharatanatyam, Odissi, Kuchipudi, or Kathakali, this platform is tailored to recognize artistic excellence, expressive abhinaya, and technical mastery. Submit your video to be judged by esteemed gurus and win cash prizes plus official verification certificates!'}
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-cyan-800 hover:text-cyan-900 flex items-center gap-1 pt-1 active:scale-95 transition-all"
          >
            {isExpanded ? (
              <>
                <span>View less</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>View more</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Tab 2: Judging Parameters */}
      {activeTab === 'judging' && (
        <div className="space-y-2">
          {judgingParameters.length > 0 ? (
            judgingParameters.map((param, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/80"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs font-medium text-slate-700">{param}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">Parameters will be shared shortly.</p>
          )}
        </div>
      )}

      {/* Tab 3: Rules & Eligibility */}
      {activeTab === 'rules' && (
        <div className="space-y-2">
          {rulesAndEligibility.length > 0 ? (
            rulesAndEligibility.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{rule}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">Rules will be published before submission starts.</p>
          )}
        </div>
      )}
    </Card>
  );
};
