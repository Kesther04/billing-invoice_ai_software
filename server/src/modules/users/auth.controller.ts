// src/users/auth.controller.ts
// HTTP layer only. Validates body shape, delegates to service, formats response.

import { Request, Response } from "express";
import {
  registerIndividual,
  registerCreateOrg,
  registerJoinOrg,
  login,
  forgotPassword,
  resetPassword,
} from "./auth.service";

// ─── Error map ────────────────────────────────────────────────────────────────

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  EMAIL_TAKEN:              { status: 409, message: "An account with this email already exists" },
  INVALID_INVITE_CODE:      { status: 400, message: "Invalid invite code — no matching organization found" },
  INVALID_CREDENTIALS:      { status: 401, message: "Invalid email or password" },
  ORG_NOT_FOUND:            { status: 500, message: "Associated organization not found" },
  INVALID_OR_EXPIRED_TOKEN: { status: 400, message: "This reset link is invalid or has expired" },
};

function handleError(err: unknown, res: Response): void {
  if (err instanceof Error && SERVICE_ERRORS[err.message]) {
    const { status, message } = SERVICE_ERRORS[err.message];
    res.status(status).json({ success: false, message });
    return;
  }
  console.error("[auth.controller]", err);
  res.status(500).json({ success: false, message: "Internal server error" });
}

// ─── POST /auth/register/individual ──────────────────────────────────────────
// Body: { name, email, password }

export async function registerIndividualHandler(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: "name, email and password are required" });
    return;
  }

  try {
    const result = await registerIndividual({ name, email, password });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── POST /auth/register/create-org ──────────────────────────────────────────
// Body: { name, email, password, orgName }

export async function registerCreateOrgHandler(req: Request, res: Response): Promise<void> {
  const { name, email, password, orgName } = req.body;

  if (!name || !email || !password || !orgName) {
    res.status(400).json({
      success: false,
      message: "name, email, password and orgName are required",
    });
    return;
  }

  try {
    const result = await registerCreateOrg({ name, email, password, orgName });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── POST /auth/register/join-org ─────────────────────────────────────────────
// Body: { name, email, password, inviteCode }

export async function registerJoinOrgHandler(req: Request, res: Response): Promise<void> {
  const { name, email, password, inviteCode } = req.body;

  if (!name || !email || !password || !inviteCode) {
    res.status(400).json({
      success: false,
      message: "name, email, password and inviteCode are required",
    });
    return;
  }

  try {
    const result = await registerJoinOrg({ name, email, password, inviteCode });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── POST /auth/login ─────────────────────────────────────────────────────────
// Body: { email, password }
// Works for all roles — OWNER, ADMIN, MEMBER

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "email and password are required" });
    return;
  }

  try {
    const result = await login({ email, password });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── POST /auth/forgot-password ───────────────────────────────────────────────
// Body: { email }

export async function forgotPasswordHandler(req: Request, res: Response): Promise<void> {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: "email is required" });
    return;
  }

  try {
    await forgotPassword({ email });
    // Always 200 — never reveal whether the email exists
    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent",
    });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── POST /auth/reset-password ────────────────────────────────────────────────
// Body: { token, newPassword }

export async function resetPasswordHandler(req: Request, res: Response): Promise<void> {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({ success: false, message: "token and newPassword are required" });
    return;
  }

  if (typeof newPassword === "string" && newPassword.length < 8) {
    res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    return;
  }

  try {
    await resetPassword({ token, newPassword });
    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── GET /auth/me ─────────────────────────────────────────────────────────────
// Protected — returns the decoded JWT payload (set by requireAuth middleware)

export async function getMeHandler(req: Request, res: Response): Promise<void> {
  res.status(200).json({ success: true, data: req.user });
}