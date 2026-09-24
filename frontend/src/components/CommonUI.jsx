import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 ${className}`} {...props}>
    {children}
  </div>
);

export const Chip = ({ children, variant = 'default', className = '', icon: Icon = null }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-cyan-50 text-cyan-800 border border-cyan-200/60',
    teal: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    success: 'bg-green-50 text-green-800 border border-green-200/60',
    purple: 'bg-purple-50 text-purple-800 border border-purple-200/60',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${variants[variant] || variants.default} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};

export const ProgressBar = ({ current = 0, total = 100, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (current / (total || 1)) * 100));

  return (
    <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="bg-gradient-to-r from-cyan-600 to-teal-500 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200/70 rounded ${className}`} />
);

export const CompetitionDetailSkeleton = () => (
  <div className="space-y-4 p-4 max-w-md mx-auto">
    <Skeleton className="h-48 w-full rounded-2xl" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-6 w-32 rounded-full" />
    </div>
    <Skeleton className="h-8 w-3/4 rounded" />
    <Skeleton className="h-20 w-full rounded-2xl" />
    <Skeleton className="h-24 w-full rounded-2xl" />
    <Skeleton className="h-40 w-full rounded-2xl" />
    <Skeleton className="h-32 w-full rounded-2xl" />
  </div>
);
