import { useState, useEffect, useRef } from 'react';

export const useCountdown = (targetDate, onExpire) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const hasExpiredRef = useRef(false);

  function calculateTimeLeft(target) {
    if (!target) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true };
    }

    const difference = new Date(target).getTime() - Date.now();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true };
    }

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMs: difference,
      isExpired: false,
    };
  }

  useEffect(() => {
    // Reset expiration flag when targetDate changes
    hasExpiredRef.current = false;
    setTimeLeft(calculateTimeLeft(targetDate));

    const interval = setInterval(() => {
      const updated = calculateTimeLeft(targetDate);
      setTimeLeft(updated);

      if (updated.isExpired && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        if (onExpireRef.current) {
          onExpireRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return {
    ...timeLeft,
    daysStr: String(timeLeft.days).padStart(2, '0'),
    hoursStr: String(timeLeft.hours).padStart(2, '0'),
    minutesStr: String(timeLeft.minutes).padStart(2, '0'),
    secondsStr: String(timeLeft.seconds).padStart(2, '0'),
  };
};
