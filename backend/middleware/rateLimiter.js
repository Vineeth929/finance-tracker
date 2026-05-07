const rateLimit = require('express-rate-limit');

// General API rate limiter: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Strict limiter for auth routes: 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login/signup attempts, please try again later.',
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false
});

// External API routes limiter: 10 requests per minute
const externalAPILimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'External API rate limit exceeded, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  generalLimiter,
  authLimiter,
  externalAPILimiter
};
