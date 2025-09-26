import jwt from "jsonwebtoken";

export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  if (payload.type !== "refresh") throw new Error("Invalid token type");
  return payload;
}