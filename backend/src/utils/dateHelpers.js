/**
 * Compute competition lifecycle status and remaining times based on importantDates
 */
export function computeCompetitionStatus(importantDates, bookedSlots = 0, totalSlots = 20, overrideNow = null) {
  const now = overrideNow ? new Date(overrideNow) : new Date();
  
  const registerBefore = new Date(importantDates.registerBefore);
  const submissionStart = new Date(importantDates.submissionStart);
  const submissionEnd = new Date(importantDates.submissionEnd);
  const resultDate = new Date(importantDates.resultDate);

  const isSlotsFull = bookedSlots >= totalSlots;
  const isPastRegisterBefore = now > registerBefore;
  const isPastSubmissionEnd = now > submissionEnd;
  const isPastResultDate = now >= resultDate;
  const isWithinSubmissionWindow = now >= submissionStart && now <= submissionEnd;

  let liveStatus = 'REGISTRATION_OPEN';

  if (isPastResultDate) {
    liveStatus = 'COMPLETED';
  } else if (isPastSubmissionEnd) {
    liveStatus = 'SUBMISSION_CLOSED';
  } else if (isPastRegisterBefore) {
    // Past registration deadline
    if (isWithinSubmissionWindow) {
      liveStatus = 'SUBMISSION_OPEN';
    } else {
      liveStatus = 'REGISTRATION_CLOSED';
    }
  } else {
    // Before or at registerBefore
    if (isWithinSubmissionWindow) {
      liveStatus = 'SUBMISSION_OPEN';
    } else {
      liveStatus = 'REGISTRATION_OPEN';
    }
  }

  const isRegistrationOpen = !isPastRegisterBefore && !isSlotsFull;
  const isSubmissionOpen = isWithinSubmissionWindow;
  const timeRemainingToRegisterMs = Math.max(0, registerBefore.getTime() - now.getTime());
  const timeRemainingToSubmissionCloseMs = Math.max(0, submissionEnd.getTime() - now.getTime());

  return {
    liveStatus,
    isRegistrationOpen,
    isSubmissionOpen,
    isSlotsFull,
    timeRemainingToRegisterMs,
    timeRemainingToSubmissionCloseMs,
    currentTimeIso: now.toISOString()
  };
}
