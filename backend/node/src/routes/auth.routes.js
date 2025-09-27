import express from "express";
import passport from "../config/passport.js";
import { signUp, signIn, refreshToken, logout } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// --- Abstracted OAuth Callback Handler ---
const handleOAuthCallback = (req, res) => {
  // The 'req.user' object is populated by the 'handleOAuthUserJWT' function in your controller.
  // It contains the user object and tokens.
  res.json({
    user: req.user.user,
    accessToken: req.user.accessToken,
    refreshToken: req.user.refreshToken,
  });
};

// --- Local Authentication ---
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// --- Google OAuth ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/signin" }),
  handleOAuthCallback // Use the shared handler
);

// --- GitHub OAuth ---
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/auth/signin" }),
  handleOAuthCallback // Use the shared handler
);

// --- Protected Routes ---
// This route is accessible to any authenticated user (USER or ADMIN)
router.get("/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// This route is only accessible to users with the 'ADMIN' role
router.get(
  "/admin/dashboard",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome to the admin dashboard!", adminUser: req.user });
  }
);

export default router;
