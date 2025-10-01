import express from "express";
import { getProfile, updateProfile, updatePassword } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);
router.put("/password", requireAuth, updatePassword);

export default router;
