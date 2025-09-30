import express from "express";
import passport from "../config/passport.js";
import {
  signUp,
  signIn,
  refreshToken,
  logout,
  requestEmailVerification,
  verifyEmail,
  createAdmin,
} from "../controllers/auth.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Local Auth Routes */
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

/* Email Verification */
router.post("/request-verification", requestEmailVerification);
router.post("/verify-email", verifyEmail);

/* Protected Admin Creation
   Only admins can create new admins */
router.post("/create-admin", requireAuth, requireAdmin, createAdmin);

/* Helper for setting refresh cookie */
function setOAuthCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

/*   Google OAuth */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/signin",
  }),
  (req, res) => {
    const { refreshToken } = req.user;
    setOAuthCookie(res, refreshToken);
    // Redirect to frontend app
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/app`);
  }
);

/* GitHub OAuth */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/signin",
  }),
  (req, res) => {
    const { refreshToken } = req.user;
    setOAuthCookie(res, refreshToken);
    // Redirect to frontend app
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/app`);
  }
);

/* Logged-in User Endpoint */
router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// Test user-only access
router.get("/protected", requireAuth, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    user: req.user,
  });
});

// Test admin-only access
router.get("/protected/admin", requireAuth, requireAdmin, (req, res) => {
  res.json({
    message: "You accessed an admin-only route!",
    user: req.user,
  });
});

export default router;
