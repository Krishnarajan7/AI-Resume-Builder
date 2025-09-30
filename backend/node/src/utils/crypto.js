import crypto from "crypto";

/**
 * Hash a token securely using SHA-256.
 * Used for storing refresh tokens or verification tokens in DB.
 * @param {string} token - The token to hash
 * @returns {string} - Hexadecimal hash
 */
export function hashToken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token provided to hashToken");
  }
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generate a secure random token (hex string).
 * Default 32 bytes = 64 hex characters.
 * Can be used for refresh token secrets, verification tokens, etc.
 * @param {number} bytes - Number of random bytes (default 32)
 * @returns {string} - Hexadecimal token
 */
export function createRandomToken(bytes = 32) {
  if (!Number.isInteger(bytes) || bytes <= 0) {
    throw new Error("Invalid number of bytes for createRandomToken");
  }
  return crypto.randomBytes(bytes).toString("hex");
}
