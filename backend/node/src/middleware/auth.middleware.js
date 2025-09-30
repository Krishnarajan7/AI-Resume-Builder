import { verifyAccessToken } from "../utils/jwt.js";
import prisma from "../config/db.js";
import { AppError } from "../controllers/auth.controller.js";

/* JWT Authentication Middleware */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      throw new AppError("Invalid or expired token", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) throw new AppError("User not found", 401);

    req.user = user;
    next();
  } catch (err) {
    const status = err instanceof AppError ? err.statusCode : 401;
    return res.status(status).json({ error: err.message || "Authentication failed" });
  }
}

/* Role-based Authorization Middleware */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError("Forbidden: insufficient permissions", 403);
      }

      next();
    } catch (err) {
      const status = err instanceof AppError ? err.statusCode : 403;
      return res.status(status).json({ error: err.message || "Forbidden" });
    }
  };
}

/* Admin-only Shortcut Middleware */
export const requireAdmin = authorize("ADMIN");
