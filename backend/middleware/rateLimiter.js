const rateLimit = require('express-rate-limit');

// General API rate limiter: 100 requests per 15 minutes
// Skip OPTIONS preflight requests
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => req.method === 'OPTIONS',
  standardHeaders: true,
  legacyHeaders: false
});

// Strict limiter for auth routes: 5 requests per 15 minutes
// Skip OPTIONS preflight requests to avoid blocking CORS
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login/signup attempts, please try again later.',
  skipSuccessfulRequests: false,
  skip: (req) => req.method === 'OPTIONS',
  standardHeaders: true,
  legacyHeaders: false
});

// External API routes limiter: 10 requests per minute
// Skip OPTIONS preflight requests
const externalAPILimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'External API rate limit exceeded, please try again later.',
  skip: (req) => req.method === 'OPTIONS',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  generalLimiter,
  authLimiter,
  externalAPILimiter
};
