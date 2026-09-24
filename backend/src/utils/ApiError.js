export class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', details = null, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.details = details;
    this.code = code || `ERR_${statusCode}`;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(msg = 'Bad Request', details = null) {
    return new ApiError(400, msg, details, 'BAD_REQUEST');
  }

  static unauthorized(msg = 'Unauthorized access', details = null) {
    return new ApiError(401, msg, details, 'UNAUTHORIZED');
  }

  static forbidden(msg = 'Forbidden action', details = null) {
    return new ApiError(403, msg, details, 'FORBIDDEN');
  }

  static notFound(msg = 'Resource not found', details = null) {
    return new ApiError(404, msg, details, 'NOT_FOUND');
  }

  static conflict(msg = 'Conflict with current state', details = null) {
    return new ApiError(409, msg, details, 'CONFLICT');
  }

  static tooManyRequests(msg = 'Too many requests, please try again later', details = null) {
    return new ApiError(429, msg, details, 'TOO_MANY_REQUESTS');
  }

  static internal(msg = 'Internal server error', details = null) {
    return new ApiError(500, msg, details, 'INTERNAL_SERVER_ERROR');
  }
}
