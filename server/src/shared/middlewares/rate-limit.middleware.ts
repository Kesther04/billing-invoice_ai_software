import rateLimit, { ipKeyGenerator } from "express-rate-limit";

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
    keyGenerator: (req) => (req as any).user?.id ?? ipKeyGenerator(req.ip ?? "unknown"),
  });
}