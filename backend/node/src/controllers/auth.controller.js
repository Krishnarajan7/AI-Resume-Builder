import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import { hashToken, createRandomToken } from "../utils/crypto.js";
import {
  rotateRefreshToken,
  invalidateAllSessions,
  findValidSession,
  createVerificationToken,
  verifyAndConsumeVerificationToken,
} from "../services/auth.service.js";

/* AppError Class */
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/* Password complexity */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const SIMPLE_PASSWORD_ERR = "Password does not meet complexity requirements.";

/* Cookie options generator*/
function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
    path: "/",
  };
}

/* Helper to set refresh cookie */
function setRefreshCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, cookieOptions());
}

/* OAuth Handler for Passport*/
export function handleOAuthUserJWT(provider) {
  return async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase().trim();
      if (!email)
        return done(new AppError("No email from OAuth provider", 400), null);

      let user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          authProviders: true,
        },
      });

      if (user) {
        // Upsert provider info
        await prisma.authProvider.upsert({
          where: {
            provider_providerUserId: { provider, providerUserId: profile.id },
          },
          update: { accessToken, refreshToken },
          create: {
            userId: user.id,
            provider,
            providerUserId: profile.id,
            accessToken,
            refreshToken,
          },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            name:
              profile.displayName || profile.username || email.split("@")[0],
            authProviders: {
              create: {
                provider,
                providerUserId: profile.id,
                accessToken,
                refreshToken,
              },
            },
          },
          select: { id: true, email: true, name: true, role: true },
        });
      }

      const tokens = generateTokens(user.id, user.role);
      await rotateRefreshToken(user.id, null, hashToken(tokens.refreshToken));

      return done(null, {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (err) {
      return done(err, null);
    }
  };
}

/* Sign Up*/
export async function signUp(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password)
      throw new AppError("Missing email or password", 400);
    if (!PASSWORD_REGEX.test(password))
      throw new AppError(SIMPLE_PASSWORD_ERR, 400);

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { authProviders: true },
    });

    if (existing) {
      const hasOAuth = existing.authProviders.some(
        (ap) => ap.provider !== "email"
      );
      if (hasOAuth)
        throw new AppError(
          "Email registered via social login. Use social sign-in.",
          409
        );
      throw new AppError("Email already registered.", 409);
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        role: "USER",
        authProviders: { create: { provider: "email", passwordHash: hashed } },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
      },
    });

    const rawVerifyToken = createRandomToken(32);
    const hashedVerify = hashToken(rawVerifyToken);
    await createVerificationToken(user.email, hashedVerify);

    const tokens = generateTokens(user.id, user.role);
    await rotateRefreshToken(user.id, null, hashToken(tokens.refreshToken));
    setRefreshCookie(res, tokens.refreshToken);

    return res.status(201).json({
      user,
      accessToken: tokens.accessToken,
      verifyToken:
        process.env.NODE_ENV === "production" ? undefined : rawVerifyToken,
      message: "User created. Verify your email to activate account.",
    });
  } catch (err) {
    return next(err);
  }
}

/* Protected Admin Creation
   Only existing ADMINs can create */
export async function createAdmin(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) throw new AppError("Missing fields", 400);

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) throw new AppError("Email already registered", 409);

    const hashed = await bcrypt.hash(password, 12);

    const adminUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        role: "ADMIN", // force admin
        authProviders: { create: { provider: "email", passwordHash: hashed } },
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return res
      .status(201)
      .json({ user: adminUser, message: "Admin user created successfully" });
  } catch (err) {
    return next(err);
  }
}

/* Sign In */
export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new AppError("Missing email or password", 400);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        authProviders: true,
      },
    });

    if (!user) throw new AppError("Invalid credentials", 401);

    const provider = user.authProviders.find((ap) => ap.provider === "email");
    if (provider && !user.emailVerified)
      throw new AppError("Email not verified.", 403);

    if (!provider || !provider.passwordHash) {
      const hasOAuth = user.authProviders.some((ap) => ap.provider !== "email");
      if (hasOAuth)
        throw new AppError("Please sign in using social login.", 401);
      throw new AppError("Invalid credentials", 401);
    }

    const valid = await bcrypt.compare(password, provider.passwordHash);
    if (!valid) throw new AppError("Invalid credentials", 401);

    const tokens = generateTokens(user.id, user.role);
    await rotateRefreshToken(user.id, null, hashToken(tokens.refreshToken));
    setRefreshCookie(res, tokens.refreshToken);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    return next(err);
  }
}

/* Refresh Token */
export async function refreshToken(req, res, next) {
  try {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!rawToken) throw new AppError("Missing refresh token", 400);

    const payload = verifyRefreshToken(rawToken);
    const hashedOld = hashToken(rawToken);

    const validSession = await findValidSession(payload.userId, hashedOld);
    if (!validSession) {
      await invalidateAllSessions(payload.userId);
      throw new AppError(
        "Refresh token expired or reused. All sessions revoked.",
        401
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, email: true, name: true },
    });
    if (!user) throw new AppError("User not found", 401);

    const tokens = generateTokens(user.id, user.role);
    await rotateRefreshToken(
      user.id,
      hashedOld,
      hashToken(tokens.refreshToken)
    );
    setRefreshCookie(res, tokens.refreshToken);

    return res.json({ user, accessToken: tokens.accessToken });
  } catch (err) {
    return next(err);
  }
}

/* Logout */
export async function logout(req, res, next) {
  try {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!rawToken) throw new AppError("Missing refresh token", 400);

    let payload;
    try {
      payload = verifyRefreshToken(rawToken);
    } catch {
      res.clearCookie("refreshToken", cookieOptions());
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const hashed = hashToken(rawToken);
    const validSession = await findValidSession(payload.userId, hashed);
    if (validSession)
      await prisma.session.delete({ where: { id: validSession.id } });

    res.clearCookie("refreshToken", cookieOptions());
    return res.json({ message: "Logged out successfully." });
  } catch (err) {
    return next(err);
  }
}

/* Email Verification */
export async function requestEmailVerification(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError("Missing email", 400);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) throw new AppError("User not found", 404);

    const rawToken = createRandomToken(32);
    await createVerificationToken(user.email, hashToken(rawToken));

    const response = { message: "Verification email sent (if configured)" };
    if (process.env.NODE_ENV !== "production") response.debugToken = rawToken;

    return res.json(response);
  } catch (err) {
    return next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { email, token } = req.body;
    if (!email || !token) throw new AppError("Missing email or token", 400);

    const user = await verifyAndConsumeVerificationToken(
      email.toLowerCase().trim(),
      hashToken(token)
    );
    if (!user) throw new AppError("Invalid or expired token", 400);

    return res.json({ message: "Email verified", user });
  } catch (err) {
    return next(err);
  }
}
