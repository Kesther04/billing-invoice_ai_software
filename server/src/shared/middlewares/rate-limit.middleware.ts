// src/shared/middlewares/rate-limit.middleware.ts

import rateLimit from "express-rate-limit";

export function rateLimitMiddleware(options: {
  windowMs: number;
  max:      number;
  message?: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max:      options.max,
    message:  options.message ?? "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders:   false,
    // Key by user ID when available, otherwise IP
    keyGenerator: (req) => (req as any).user?.id ?? req.ip ?? "unknown",
  });
}