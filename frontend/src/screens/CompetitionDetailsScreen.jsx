import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompetition } from '../hooks/useCompetition';
import { useRegistration } from '../hooks/useRegistration';
import { useAuth } from '../context/AuthContext';

import { AppHeader } from '../components/AppHeader';
import { CompetitionHeroCard } from '../components/CompetitionHeroCard';
import { JudgeCard } from '../components/JudgeCard';
import { CountdownBanner } from '../components/CountdownBanner';
import { ImportantDates } from '../components/ImportantDates';
import { PreviousWinners } from '../components/PreviousWinners';
import { TabSection } from '../components/TabSection';
import { RewardsTable } from '../components/RewardsTable';
import { DisclaimerBar } from '../components/DisclaimerBar';
import { TrustBadges } from '../components/TrustBadges';
import { ReferEarnCard } from '../components/ReferEarnCard';
import { HearFromUsers } from '../components/HearFromUsers';
import { AdHerePlaceholder } from '../components/AdHerePlaceholder';
import { StickyCTA } from '../components/StickyCTA';
import { BottomNav } from '../components/BottomNav';
import { CompetitionDetailSkeleton } from '../components/CommonUI';

import { PaymentModal } from '../components/PaymentModal';
import { SubmissionModal } from '../components/SubmissionModal';
import { VideoModal } from '../components/VideoModal';
import { WinnersModal } from '../components/WinnersModal';
import { DemoBar } from '../components/DemoBar';
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export const CompetitionDetailsScreen = () => {
  const { slug: routeSlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeSlug, setActiveSlug] = useState(routeSlug || 'feedants-classical-dance');
  const [overrideNow, setOverrideNow] = useState(null);

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isWinnersModalOpen, setIsWinnersModalOpen] = useState(false);

  // Success / notification message
  const [toastMessage, setToastMessage] = useState(null);

  // Query competition details
  const {
    data: competitionData,
    isLoading,
    isError,
    error,
    refetch,
  } = useCompetition(activeSlug, overrideNow);

  const competition = competitionData?.competition;
  const userRegistrationState = competitionData?.userRegistrationState;
  const liveStatus = competitionData?.liveStatus;
  const isRegistrationOpen = competitionData?.isRegistrationOpen;
  const isSubmissionOpen = competitionData?.isSubmissionOpen;
  const isSlotsFull = competitionData?.isSlotsFull;

  // Registration mutations
  const { register, isRegistering, submitEntry, isSubmitting } = useRegistration(
    competition?._id,
    activeSlug
  );

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRegisterConfirm = async () => {
    try {
      const res = await register({ amountPaid: competition?.entryFee || 99 });
      showToast('🎉 Successfully registered! Your slot has been reserved.');
      refetch();
    } catch (err) {
      showToast(err?.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const handleSubmissionConfirm = async (submissionUrl) => {
    try {
      await submitEntry({ submissionUrl });
      showToast('✅ Dance entry submitted successfully for Guru Manju Dubey to judge!');
      refetch();
    } catch (err) {
      showToast(err?.message || 'Submission failed', 'error');
      throw err;
    }
  };

  // When countdown expires, trigger refetch to update CTA
  const handleCountdownExpire = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center">
        <div className="w-full max-w-md bg-[#F6F8FA] min-h-screen shadow-xl border-x border-slate-200">
          <AppHeader title="Competition Details" />
          <CompetitionDetailSkeleton />
          <BottomNav />
        </div>
      </div>
    );
  }

  if (isError || !competition) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Failed to load competition</h2>
          <p className="text-xs text-slate-500">
            {error?.message || 'Could not fetch competition details from server.'}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-700 text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200/60 flex flex-col items-center">
      {/* Mobile-sized app container */}
      <div className="w-full max-w-md bg-[#F6F8FA] min-h-screen shadow-xl border-x border-slate-200 flex flex-col relative pb-32">
        {/* Interactive Evaluation Bar */}
        <DemoBar
          currentSlug={activeSlug}
          onSlugChange={setActiveSlug}
          overrideNow={overrideNow}
          onOverrideNowChange={setOverrideNow}
        />

        {/* 1. Header */}
        <AppHeader title={competition.title} />

        {/* Toast Alert Feedback */}
        {toastMessage && (
          <div
            className={`sticky top-14 z-30 mx-3 my-2 p-3 rounded-xl shadow-md flex items-center gap-2 text-xs font-bold transition-all ${
              toastMessage.type === 'error'
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{toastMessage.msg}</span>
          </div>
        )}

        {/* Main Content Sections matching exact design hierarchy */}
        <main className="p-3.5 space-y-3.5">
          {/* 2. Competition Hero Card */}
          <CompetitionHeroCard competition={competition} />

          {/* 3. Judge Card */}
          <JudgeCard
            judge={competition.judge}
            onWatchIntroVideo={() => setIsVideoModalOpen(true)}
          />

          {/* 4. Countdown Banner */}
          <CountdownBanner
            targetDate={competition.importantDates?.registerBefore}
            onExpire={handleCountdownExpire}
            isClosed={!isRegistrationOpen && liveStatus === 'REGISTRATION_CLOSED'}
          />

          {/* 5. Important Dates (2x2 Grid) */}
          <ImportantDates importantDates={competition.importantDates} />

          {/* 6. Previous Winners (Horizontal Scroll) */}
          <PreviousWinners
            winners={competition.previousWinners}
            onViewAll={() => setIsWinnersModalOpen(true)}
          />

          {/* 7. Tab Section (About / Judging / Rules) */}
          <TabSection
            about={competition.about}
            judgingParameters={competition.judgingParameters}
            rulesAndEligibility={competition.rulesAndEligibility}
          />

          {/* 8. Rewards Table */}
          <RewardsTable rewards={competition.rewards} />

          {/* 9. Disclaimer Bar */}
          <DisclaimerBar text={competition.disclaimer} />

          {/* 10. Trust & Safety Badges */}
          <TrustBadges />

          {/* 11. Refer & Earn Card */}
          <ReferEarnCard referralMeta={competition.referral} />

          {/* 12. Hear From Users */}
          <HearFromUsers />

          {/* 13. Ad / Sponsor Placeholder */}
          <AdHerePlaceholder />
        </main>

        {/* 14. Sticky CTA (Dynamic based on rules 4e) */}
        <StickyCTA
          competition={competition}
          userRegistrationState={userRegistrationState}
          liveStatus={liveStatus}
          isRegistrationOpen={isRegistrationOpen}
          isSubmissionOpen={isSubmissionOpen}
          isSlotsFull={isSlotsFull}
          onRegisterClick={() => setIsPaymentModalOpen(true)}
          onUploadSubmission={() => setIsSubmissionModalOpen(true)}
          onLoginClick={() => navigate('/login')}
          isRegistering={isRegistering}
        />

        {/* 15. Bottom Navigation */}
        <BottomNav />

        {/* Modals */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={handleRegisterConfirm}
          competition={competition}
          isRegistering={isRegistering}
        />

        <SubmissionModal
          isOpen={isSubmissionModalOpen}
          onClose={() => setIsSubmissionModalOpen(false)}
          onSubmit={handleSubmissionConfirm}
          currentSubmissionUrl={userRegistrationState?.submissionUrl || ''}
          isSubmitting={isSubmitting}
        />

        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          judge={competition.judge}
        />

        <WinnersModal
          isOpen={isWinnersModalOpen}
          onClose={() => setIsWinnersModalOpen(false)}
          winners={competition.previousWinners}
        />
      </div>
    </div>
  );
};
