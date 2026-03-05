// src/users/user.types.ts

import { OrganizationType, UserRole } from "../../generated/client";

// Re-export so callers never need to import from @prisma/client directly
export { OrganizationType, UserRole };

// ─── JWT Payload ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub:            string;           // User.id
  email:          string;
  role:           UserRole;
  organizationId: string;
  orgType:        OrganizationType;
  iat?:           number;
  exp?:           number;
}

// ─── Registration DTOs ────────────────────────────────────────────────────────

/**
 * Individual signup — creates a personal INDIVIDUAL org + OWNER user in one go.
 */
export interface RegisterIndividualDto {
  name:     string;
  email:    string;
  password: string;
}

/**
 * Create-org signup — creates an ORGANIZATION org + ADMIN user in one go.
 */
export interface RegisterCreateOrgDto {
  name:     string;   // user's name
  email:    string;   // user's email (also seeds org.email)
  password: string;
  orgName:  string;
}

/**
 * Join-org signup — creates a MEMBER user and links them to an existing org.
 * inviteCode maps to Organization.inviteCode.
 */
export interface RegisterJoinOrgDto {
  name:       string;
  email:      string;
  password:   string;
  inviteCode: string;
}

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

export interface LoginDto {
  email:    string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token:       string;
  newPassword: string;
}

// ─── Response Shapes ──────────────────────────────────────────────────────────

export interface SafeUser {
  id:             string;
  name:           string;
  email:          string;
  role:           UserRole;
  organizationId: string;
  createdAt:      Date;
}

export interface SafeOrg {
  id:        string;
  name:      string;
  email:     string;
  type:      OrganizationType;
  createdAt: Date;
}

export interface AuthResponse {
  user:         SafeUser;
  organization: SafeOrg;
  tokens: {
    accessToken:  string;
    refreshToken: string;
  };
}