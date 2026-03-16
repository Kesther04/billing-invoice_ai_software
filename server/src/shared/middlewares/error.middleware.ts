// src/shared/middlewares/error.middleware.ts

import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status  = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  if (status >= 500) {
    logger.error({ err }, message);
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}