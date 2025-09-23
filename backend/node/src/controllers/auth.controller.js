import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/jwt.js";
import { rotateRefreshToken, invalidateAllSessions } from "../services/auth.service.js";

// Password complexity regex: min 8 chars, upper, lower, number, special
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

/**
 * Handles OAuth user sign-in/up and provider linking.
 */
export function handleOAuthUser(provider) {
  return async (accessToken, refreshToken, profile, done) => {
    try {
      const emailObj = profile.emails?.[0];
      const email = emailObj?.value?.toLowerCase().trim();
      if (!email) return done(new Error("No email from OAuth provider"), null);

      let user = await prisma.user.findUnique({
        where: { email },
        include: { authProviders: true }
      });

      if (user) {
        await prisma.authProvider.upsert({
          where: {
            provider_providerUserId: {
              provider,
              providerUserId: profile.id
            }
          },
          update: { accessToken, refreshToken },
          create: {
            userId: user.id,
            provider,
            providerUserId: profile.id,
            accessToken,
            refreshToken
          }
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || profile.username || email.split("@")[0],
            authProviders: {
              create: {
                provider,
                providerUserId: profile.id,
                accessToken,
                refreshToken
              }
            }
          },
          include: { authProviders: true }
        });
      }

      const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        providers: user.authProviders.map(ap => ({
          provider: ap.provider,
          providerUserId: ap.providerUserId
        }))
      };

      return done(null, safeUser);
    } catch (err) {
      done(err, null);
    }
  };
}

// Local signup
export async function signUp(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      const hasOAuth = existing.authProviders?.some(ap => ap.provider !== "email");
      if (hasOAuth) {
        return res.status(409).json({ error: "Email registered via social login. Please sign in using your Google or GitHub account." });
      }
      return res.status(409).json({ error: "Email already registered." });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        authProviders: {
          create: {
            provider: "email",
            passwordHash: hash,
          },
        },
      },
      include: { authProviders: true }
    });

    const tokens = generateTokens(user.id);
    await rotateRefreshToken(user.id, null, tokens.refreshToken);

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (err) {
    next(err);
  }
}

// Local signin
export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { authProviders: true },
    });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const provider = user.authProviders.find(ap => ap.provider === "email");
    if (!provider || !provider.passwordHash) {
      const hasOAuth = user.authProviders.some(ap => ap.provider !== "email");
      if (hasOAuth) {
        return res.status(401).json({ error: "Please sign in using your Google or GitHub account." });
      }
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, provider.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const tokens = generateTokens(user.id);
    await rotateRefreshToken(user.id, null, tokens.refreshToken);

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (err) {
    next(err);
  }
}

// Refresh token endpoint with rotation & reuse detection
export async function refreshToken(req, res, next) {
  try {
    const { refreshToken: oldToken } = req.body;
    if (!oldToken) return res.status(400).json({ error: "Missing refresh token" });

    let payload;
    try {
      payload = require("jsonwebtoken").verify(oldToken, process.env.JWT_REFRESH_SECRET);
      if (payload.type !== "refresh") throw new Error("Invalid token type");
    } catch {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    // Check if refresh token exists in DB
    const session = await prisma.session.findUnique({ where: { sessionToken: oldToken } });
    if (!session || session.expires < new Date()) {
      await invalidateAllSessions(payload.userId);
      return res.status(401).json({ error: "Refresh token expired or reused. All sessions revoked." });
    }

    // Rotate refresh token
    const tokens = generateTokens(payload.userId);
    await rotateRefreshToken(payload.userId, oldToken, tokens.refreshToken);

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (err) {
    next(err);
  }
}

// Logout endpoint
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Missing refresh token" });

    await prisma.session.deleteMany({ where: { sessionToken: refreshToken } });
    res.json({ message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
}
