import { ApiError } from '../utils/ApiError.js';
import { ZodError } from 'zod';

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'ERR_INTERNAL';
  let details = err.details || null;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_RESOURCE';

    if (err.keyPattern && err.keyPattern.competitionId && err.keyPattern.userId) {
      message = 'You are already registered for this competition';
      code = 'ALREADY_REGISTERED';
    } else if (err.keyPattern && err.keyPattern.email) {
      message = 'An account with this email already exists';
      code = 'EMAIL_ALREADY_EXISTS';
    } else if (err.keyPattern && err.keyPattern.key) {
      message = 'Idempotency key conflict: an operation with this key is already processed';
      code = 'IDEMPOTENCY_CONFLICT';
    } else {
      message = 'Duplicate key error on unique index';
    }
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_IDENTIFIER';
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token expired. Please log in again.';
  }

  // Log 500 errors in development
  if (statusCode >= 500) {
    console.error('[Unhandled Error]:', err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      ...(process.env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
    },
  });
};
