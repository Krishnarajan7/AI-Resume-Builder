import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import { signUp, signIn, refreshToken, logout } from "../controllers/auth.controller.js";
import { jwtAuth } from "../middleware/jwtAuth.js";

const router = express.Router();

// Local auth
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/auth/signin" }), async (req, res) => {
  // Issue JWT and refresh token
  const token = jwt.sign({ userId: req.user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const refresh = jwt.sign({ userId: req.user.id, type: "refresh" }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
  res.json({ accessToken: token, refreshToken: refresh, user: req.user });
});

// GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: "/auth/signin" }), (req, res) => {
  const token = jwt.sign({ userId: req.user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const refresh = jwt.sign({ userId: req.user.id, type: "refresh" }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
  res.json({ accessToken: token, refreshToken: refresh, user: req.user });
});

// Protected route example
router.get("/profile", jwtAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
