import React from 'react';
import { Calendar, UploadCloud, Flag, Award } from 'lucide-react';
import { Card } from './CommonUI';

export const ImportantDates = ({ importantDates }) => {
  if (!importantDates) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const datesConfig = [
    {
      title: 'Register Before',
      date: formatDate(importantDates.registerBefore),
      icon: Calendar,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200/60',
    },
    {
      title: 'Submission Starts',
      date: formatDate(importantDates.submissionStart),
      icon: UploadCloud,
      iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
    },
    {
      title: 'Submission Ends',
      date: formatDate(importantDates.submissionEnd),
      icon: Flag,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
    },
    {
      title: 'Result Announcement',
      date: formatDate(importantDates.resultDate),
      icon: Award,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
  ];

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-cyan-700" />
          Important Dates
        </h2>
        <span className="text-[11px] font-semibold text-slate-400">All times IST</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {datesConfig.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-lg border text-xs ${item.iconBg}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 line-clamp-1">
                  {item.title}
                </span>
              </div>
              <p className="text-xs font-black text-slate-900 tracking-tight pl-0.5">
                {item.date}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
