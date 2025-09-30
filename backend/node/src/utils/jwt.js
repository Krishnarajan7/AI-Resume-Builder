// src/utils/jwt.js
import jwt from "jsonwebtoken";
import { AppError } from "../controllers/auth.controller.js"; // Ensure path is correct

// -------------------------
// Generate Access & Refresh Tokens
// -------------------------
export function generateTokens(userId, role) {
  if (!userId) throw new AppError("Missing user ID for token generation", 500);

  // Access token (short-lived)
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  // Refresh token (long-lived) with unique JWT ID (jti) for tracking
  const refreshToken = jwt.sign(
    { userId, type: "refresh", jti: cryptoRandomString(16) },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
}

// -------------------------
// Verify Access Token
// -------------------------
export function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!payload.userId) throw new AppError("Invalid token payload", 401);
    return payload;
  } catch (err) {
    throw new AppError("Invalid or expired access token", 401);
  }
}

// -------------------------
// Verify Refresh Token
// -------------------------
export function verifyRefreshToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (payload.type !== "refresh" || !payload.userId)
      throw new AppError("Invalid refresh token", 401);
    return payload;
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }
}

// -------------------------
// Generate random string for JWT ID
// -------------------------
function cryptoRandomString(length = 16) {
  // Returns a secure random hex string
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}
