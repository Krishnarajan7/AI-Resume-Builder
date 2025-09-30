// src/services/auth.service.js
import prisma from "../config/db.js";
import { AppError } from "../controllers/auth.controller.js";

/**
 * Rotate refresh token:
 *  - Delete old hashed token (if provided)
 *  - Create new session with new hashed token
 */
export async function rotateRefreshToken(userId, oldHashedToken, newHashedToken) {
  if (!userId || !newHashedToken) {
    throw new AppError("Missing parameters for rotating refresh token", 500);
  }

  try {
    if (oldHashedToken) {
      // Remove old session to prevent token reuse
      await prisma.session.deleteMany({
        where: { userId, sessionToken: oldHashedToken },
      });
    }

    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const session = await prisma.session.create({
      data: {
        userId,
        sessionToken: newHashedToken,
        expires,
      },
    });

    return session;
  } catch (err) {
    throw new AppError("Failed to rotate refresh token", 500);
  }
}

/**
 * Invalidate all sessions for a user
 */
export async function invalidateAllSessions(userId) {
  if (!userId) throw new AppError("Missing user ID for session invalidation", 500);
  await prisma.session.deleteMany({ where: { userId } });
}

/**
 * Find a valid (non-expired) session by userId and hashed token
 */
export async function findValidSession(userId, hashedToken) {
  if (!userId || !hashedToken) return null;

  const session = await prisma.session.findFirst({
    where: {
      userId,
      sessionToken: hashedToken,
      expires: { gt: new Date() },
    },
  });
  return session || null;
}

/**
 * Create a verification token for an identifier (email)
 * expiresInMs optional (default 24 hours)
 */
export async function createVerificationToken(identifier, hashedToken, expiresInMs = 24 * 60 * 60 * 1000) {
  if (!identifier || !hashedToken) throw new AppError("Invalid parameters for verification token", 500);

  const expires = new Date(Date.now() + expiresInMs);

  try {
    // Remove previous tokens for this identifier (single active token policy)
    await prisma.verificationToken.deleteMany({ where: { identifier } });

    const vt = await prisma.verificationToken.create({
      data: {
        identifier,
        token: hashedToken,
        expires,
      },
    });

    return vt;
  } catch (err) {
    throw new AppError("Failed to create verification token", 500);
  }
}

/**
 * Verify and consume a verification token (identifier = email)
 * Returns user object if token valid, null otherwise
 */
export async function verifyAndConsumeVerificationToken(identifier, hashedToken) {
  if (!identifier || !hashedToken) return null;

  // Find token record
  const record = await prisma.verificationToken.findFirst({
    where: { identifier, token: hashedToken, expires: { gt: new Date() } },
  });

  if (!record) return null;

  try {
    // Delete the token record (single-use)
    await prisma.verificationToken.delete({ where: { id: record.id } });

    // Mark user's email as verified
    const user = await prisma.user.update({
      where: { email: identifier },
      data: { emailVerified: new Date() },
      select: { id: true, email: true, name: true, role: true },
    });

    return user;
  } catch (err) {
    throw new AppError("Failed to verify and consume token", 500);
  }
}
