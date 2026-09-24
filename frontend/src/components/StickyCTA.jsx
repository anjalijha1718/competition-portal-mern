import React from 'react';
import { LogIn, Ticket, UploadCloud, CheckCircle2, AlertOctagon, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StickyCTA = ({
  competition,
  userRegistrationState,
  liveStatus,
  isRegistrationOpen,
  isSubmissionOpen,
  isSlotsFull,
  onRegisterClick,
  onUploadSubmission,
  onLoginClick,
  isRegistering = false,
}) => {
  const { isAuthenticated } = useAuth();

  if (!competition) return null;

  const entryFee = competition.entryFee || 99;
  const isRegistered = userRegistrationState?.isRegistered;
  const isSubmitted = userRegistrationState?.status === 'submitted';

  // Determine button state according to 4e
  let buttonConfig = {
    label: 'Register Now',
    sublabel: null,
    icon: Ticket,
    disabled: false,
    onClick: onRegisterClick,
    variant: 'primary',
  };

  if (!isAuthenticated) {
    buttonConfig = {
      label: 'Login to Register',
      sublabel: `Entry fee: ₹${entryFee}`,
      icon: LogIn,
      disabled: false,
      onClick: onLoginClick,
      variant: 'primary',
    };
  } else if (isRegistered) {
    if (isSubmitted) {
      buttonConfig = {
        label: 'Entry Submitted ✓',
        sublabel: 'Click to update submission link',
        icon: CheckCircle2,
        disabled: false,
        onClick: onUploadSubmission,
        variant: 'success',
      };
    } else if (isSubmissionOpen) {
      buttonConfig = {
        label: 'Upload Submission',
        sublabel: 'Submission window is active',
        icon: UploadCloud,
        disabled: false,
        onClick: onUploadSubmission,
        variant: 'action',
      };
    } else {
      buttonConfig = {
        label: 'Registered ✓',
        sublabel: 'Waiting for submission window',
        icon: CheckCircle2,
        disabled: true,
        onClick: () => {},
        variant: 'registered',
      };
    }
  } else if (isSlotsFull) {
    buttonConfig = {
      label: 'Slots Full',
      sublabel: 'All slots have been booked',
      icon: AlertOctagon,
      disabled: true,
      onClick: () => {},
      variant: 'disabled',
    };
  } else if (!isRegistrationOpen || liveStatus === 'REGISTRATION_CLOSED') {
    buttonConfig = {
      label: 'Registration Closed',
      sublabel: 'Deadline has passed',
      icon: Lock,
      disabled: true,
      onClick: () => {},
      variant: 'disabled',
    };
  } else {
    // Normal open registration
    buttonConfig = {
      label: `Register Now (₹${entryFee})`,
      sublabel: 'Instant seat confirmation via Razorpay',
      icon: Ticket,
      disabled: false,
      onClick: onRegisterClick,
      variant: 'primary',
    };
  }

  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-cyan-700 to-teal-600 hover:from-cyan-800 hover:to-teal-700 text-white shadow-md active:scale-98';
      case 'action':
        return 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white shadow-md active:scale-98 animate-soft-pulse';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs';
      case 'registered':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold';
      case 'disabled':
        return 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/50';
      default:
        return 'bg-cyan-700 text-white';
    }
  };

  const Icon = buttonConfig.icon;

  return (
    <div className="fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2.5 shadow-cta transition-transform duration-200">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Left price / status info */}
        <div className="flex flex-col justify-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isRegistered ? 'Your Status' : 'Entry Fee'}
          </span>
          <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none mt-0.5">
            {isRegistered ? (
              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
              </span>
            ) : (
              `₹${entryFee}`
            )}
          </span>
        </div>

        {/* Dynamic CTA Button */}
        <button
          onClick={buttonConfig.onClick}
          disabled={buttonConfig.disabled || isRegistering}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs sm:text-sm tracking-wide transition-all ${getVariantStyles(
            buttonConfig.variant
          )}`}
        >
          {isRegistering ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <Icon className="w-4 h-4" />
              <span>{buttonConfig.label}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
