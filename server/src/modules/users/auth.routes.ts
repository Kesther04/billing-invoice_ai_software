// src/users/auth.routes.ts

import { Router } from "express";
import {
  registerIndividualHandler,
  registerCreateOrgHandler,
  registerJoinOrgHandler,
  loginHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  getMeHandler,
} from "./auth.controller";
import { requireAuth } from "./jwt.strategy";

const router = Router();

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * @route   POST /auth/register/individual
 * @desc    Create a personal INDIVIDUAL org + OWNER user
 * @access  Public
 * @body    { name, email, password }
 */
router.post("/register/individual", registerIndividualHandler);

/**
 * @route   POST /auth/register/create-org
 * @desc    Create an ORGANIZATION org + ADMIN user (invite code auto-generated)
 * @access  Public
 * @body    { name, email, password, orgName }
 */
router.post("/register/create-org", registerCreateOrgHandler);

/**
 * @route   POST /auth/register/join-org
 * @desc    Create a MEMBER user linked to an existing ORGANIZATION via invite code
 * @access  Public
 * @body    { name, email, password, inviteCode }
 */
router.post("/register/join-org", registerJoinOrgHandler);

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * @route   POST /auth/login
 * @desc    Unified login — works for OWNER, ADMIN and MEMBER roles
 * @access  Public
 * @body    { email, password }
 */
router.post("/login", loginHandler);

// ─── Password Reset ───────────────────────────────────────────────────────────

/**
 * @route   POST /auth/forgot-password
 * @desc    Send a password reset email (email only, all account types)
 * @access  Public
 * @body    { email }
 */
router.post("/forgot-password", forgotPasswordHandler);

/**
 * @route   POST /auth/reset-password
 * @desc    Confirm a password reset using the emailed token
 * @access  Public
 * @body    { token, newPassword }
 */
router.post("/reset-password", resetPasswordHandler);

// ─── Protected ────────────────────────────────────────────────────────────────

/**
 * @route   GET /auth/me
 * @desc    Return the authenticated user's JWT payload
 * @access  Private — requires Bearer token
 */
router.get("/me", requireAuth, getMeHandler);

export default router;