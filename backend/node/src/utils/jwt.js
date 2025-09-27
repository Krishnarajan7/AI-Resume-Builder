import jwt from "jsonwebtoken";

// Generate both access and refresh tokens
export function generateTokens(userId, role) {
  // Access token (short-lived, includes role for authorization)
  const accessToken = jwt.sign(
    { userId, role }, 
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: "15m" }
  );

  // Refresh token (long-lived, only contains userId for safety)
  const refreshToken = jwt.sign(
    { userId, type: "refresh" }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
}

// Verify Access Token
export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

// Verify Refresh Token
export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  if (payload.type !== "refresh") throw new Error("Invalid token type");
  return payload;
}
