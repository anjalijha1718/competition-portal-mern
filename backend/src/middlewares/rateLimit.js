import rateLimit from 'express-rate-limit';

// Global API limiter: 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes',
    },
  },
});

// Registration limiter: 10 requests per minute per IP
export const registrationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'REGISTRATION_RATE_LIMIT',
      message: 'Too many registration attempts. Please wait a minute before retrying.',
    },
  },
});
