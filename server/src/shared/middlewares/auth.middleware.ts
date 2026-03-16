// src/shared/middlewares/auth.middleware.ts

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      sub:              string;
      organizationId:   string;
      email:            string;
      organizationName: string;
    };

    (req as any).user = {
      id:               payload.sub,
      organizationId:   payload.organizationId,
      email:            payload.email,
      organizationName: payload.organizationName,
    };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}