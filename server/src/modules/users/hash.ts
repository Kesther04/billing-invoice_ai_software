import crypto from "crypto";

/**
 * SHA-256 hash for tokens.
 * Used for refresh tokens, password reset tokens, email verification tokens, etc.
 */
export function hashToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}