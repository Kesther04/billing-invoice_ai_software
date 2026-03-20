// src/users/auth.service.ts
// All business logic. Controllers call this; this calls the repository.

import bcrypt    from "bcryptjs";
import crypto    from "crypto";
import nodemailer from "nodemailer";
import { env } from "../../config/env";

import {
  RegisterIndividualDto,
  RegisterCreateOrgDto,
  RegisterJoinOrgDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponse,
} from "./user.types";

import {
  findUserByEmail,
  findOrgByEmail,
  findOrgByInviteCode,
  createIndividualWithOrg,
  createOrgWithAdmin,
  createMemberInOrg,
  createPasswordResetToken,
  findValidResetToken,
  markResetTokenUsed,
  updateUserPassword,
  toSafeUser,
  toSafeOrg,
} from "./user.repository";

import { signTokenPair } from "./jwt.strategy";

// ─── Constants ────────────────────────────────────────────────────────────────

const SALT_ROUNDS        = 12;
const RESET_EXPIRY_MS    = 60 * 60 * 1000; // 1 hour

// ─── Mailer setup ─────────────────────────────────────────────────────────────

const mailer = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendResetEmail(toEmail: string, token: string): Promise<void> {
  const url = `${env.FRONTEND_URL.replace(/\/+$/, "")}/auth/reset-password?token=${token}`;

  await mailer.sendMail({
    from:    `"RevPilot" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to:      toEmail,
    subject: "Reset your RevPilot password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;">
        <h2 style="color:#10b981;">RevPilot — Password Reset</h2>
        <p>We received a request to reset the password for your account.</p>
        <p>
          <a href="${url}"
             style="display:inline-block;background:#10b981;color:#fff;
                    padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore it.
        </p>
      </div>
    `,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build the minimal JWT payload from a resolved user + org */
function buildPayload(
  userId:         string,
  email:          string,
  role:           "OWNER" | "ADMIN" | "MEMBER",
  organizationId: string,
  orgType:        "INDIVIDUAL" | "ORGANIZATION"
) {
  return { sub: userId, email, role, organizationId, orgType };
}

/** Generate a URL-safe random invite code for new orgs */
function generateInviteCode(): string {
  return crypto.randomBytes(6).toString("hex").toUpperCase(); // e.g. "A1B2C3D4E5F6"
}

// ─── Register: Individual ─────────────────────────────────────────────────────

export async function registerIndividual(dto: RegisterIndividualDto): Promise<AuthResponse> {
  // 1. Guard: email already in use (user table)
  const existingUser = await findUserByEmail(dto.email);
  if (existingUser) throw new Error("EMAIL_TAKEN");

  // 2. Guard: email already used as an org email
  const existingOrg = await findOrgByEmail(dto.email);
  if (existingOrg) throw new Error("EMAIL_TAKEN");

  // 3. Hash
  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  // 4. Persist (transaction: org + user)
  const { user, org } = await createIndividualWithOrg({
    userName:     dto.name,
    email:        dto.email,
    passwordHash,
  });

  // 5. Issue tokens
  const tokens = signTokenPair(
    buildPayload(user.id, user.email, user.role, org.id, org.type)
  );

  return { user: toSafeUser(user), organization: toSafeOrg(org), tokens };
}

// ─── Register: Create Organisation ───────────────────────────────────────────

export async function registerCreateOrg(dto: RegisterCreateOrgDto): Promise<AuthResponse> {
  // 1. Guard: duplicate email
  const existingUser = await findUserByEmail(dto.email);
  if (existingUser) throw new Error("EMAIL_TAKEN");

  const existingOrg = await findOrgByEmail(dto.email);
  if (existingOrg) throw new Error("EMAIL_TAKEN");

  // 2. Hash
  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  // 3. Generate a unique invite code for the new org
  const inviteCode = generateInviteCode();

  // 4. Persist (transaction: org + user)
  const { user, org } = await createOrgWithAdmin({
    userName:     dto.name,
    email:        dto.email,
    passwordHash,
    orgName:      dto.orgName,
    inviteCode,
  });

  // 5. Issue tokens
  const tokens = signTokenPair(
    buildPayload(user.id, user.email, user.role, org.id, org.type)
  );

  return { user: toSafeUser(user), organization: toSafeOrg(org), tokens };
}

// ─── Register: Join Organisation ─────────────────────────────────────────────

export async function registerJoinOrg(dto: RegisterJoinOrgDto): Promise<AuthResponse> {
  // 1. Guard: duplicate email
  const existingUser = await findUserByEmail(dto.email);
  if (existingUser) throw new Error("EMAIL_TAKEN");

  // 2. Resolve invite code → org
  const org = await findOrgByInviteCode(dto.inviteCode);
  if (!org) throw new Error("INVALID_INVITE_CODE");

  // 3. Only ORGANIZATION type orgs accept members
  if (org.type !== "ORGANIZATION") throw new Error("INVALID_INVITE_CODE");

  // 4. Hash
  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  // 5. Persist member user
  const user = await createMemberInOrg({
    userName:       dto.name,
    email:          dto.email,
    passwordHash,
    organizationId: org.id,
  });

  // 6. Issue tokens
  const tokens = signTokenPair(
    buildPayload(user.id, user.email, user.role, org.id, org.type)
  );

  return { user: toSafeUser(user), organization: toSafeOrg(org), tokens };
}

// ─── Login (unified — all roles) ─────────────────────────────────────────────

export async function login(dto: LoginDto): Promise<AuthResponse> {
  // 1. Find user by email
  const user = await findUserByEmail(dto.email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  // 2. Verify password against stored hash
  const valid = await bcrypt.compare(dto.password, user.password);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  // 3. Load the user's organisation (always present due to schema constraint)
  const { findOrgById } = await import("./user.repository");
  const org = await findOrgById(user.organizationId);
  if (!org) throw new Error("ORG_NOT_FOUND"); // should never happen with cascade

  // 4. Issue tokens
  const tokens = signTokenPair(
    buildPayload(user.id, user.email, user.role, org.id, org.type)
  );

  return { user: toSafeUser(user), organization: toSafeOrg(org), tokens };
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(dto: ForgotPasswordDto): Promise<void> {
  // Always return silently — prevents user enumeration attacks
  const user = await findUserByEmail(dto.email);
  if (!user) return;

  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_EXPIRY_MS);

  await createPasswordResetToken({
    userId:         user.id,
    organizationId: user.organizationId,
    token:          rawToken,
    expiresAt,
  });

  // Non-blocking — email failure must not affect the HTTP response
  sendResetEmail(user.email, rawToken).catch((err) =>
    console.error("[auth.service] Reset email failed:", err)
  );
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPassword(dto: ResetPasswordDto): Promise<void> {
  // 1. Validate token (not used, not expired)
  const record = await findValidResetToken(dto.token);
  if (!record) throw new Error("INVALID_OR_EXPIRED_TOKEN");

  // 2. Hash the new password
  const passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);

  // 3. Persist new password and consume token (both must succeed)
  await updateUserPassword(record.userId, passwordHash);
  await markResetTokenUsed(record.id);
}
