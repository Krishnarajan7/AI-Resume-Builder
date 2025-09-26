import express from "express";
import passport from "../config/passport.js";
import { signUp, signIn, refreshToken, logout } from "../controllers/auth.controller.js";
import { jwtAuth } from "../middleware/jwtAuth.js";

const router = express.Router();

// Local authentication
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/signin" }),
  (req, res) => {
    res.json(req.user);
  }
);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/auth/signin" }),
  (req, res) => {
    res.json(req.user);
  }
);


// Example protected route
router.get("/profile", jwtAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
