// src/users/jwt.strategy.ts

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload, UserRole, OrganizationType } from "./user.types";

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRY  = process.env.JWT_ACCESS_EXPIRY  ?? "15m";
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY ?? "7d";

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined");
}

// ─── Sign ─────────────────────────────────────────────────────────────────────

export function signAccessToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY } as jwt.SignOptions);
}

export function signRefreshToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY } as jwt.SignOptions);
}

export function signTokenPair(payload: Omit<JwtPayload, "iat" | "exp">) {
  return {
    accessToken:  signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

// ─── Verify ───────────────────────────────────────────────────────────────────

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

// ─── Middleware: requireAuth ──────────────────────────────────────────────────

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Missing or malformed Authorization header" });
    return;
  }

  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: "Access token expired" });
      return;
    }
    res.status(401).json({ success: false, message: "Invalid access token" });
  }
}

// ─── Middleware: requireRole ──────────────────────────────────────────────────

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Insufficient permissions" });
      return;
    }
    next();
  };
}

// ─── Middleware: requireOrgType ───────────────────────────────────────────────
// Useful guard e.g. requireOrgType("ORGANIZATION") for org-only routes

export function requireOrgType(...types: OrganizationType[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }
    if (!types.includes(req.user.orgType)) {
      res.status(403).json({ success: false, message: "This action is not available for your account type" });
      return;
    }
    next();
  };
}

// ─── Express type augmentation ────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}