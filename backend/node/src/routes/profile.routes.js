import express from "express";
import { getProfile, updateProfile, updatePassword } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { updateProfileValidation, updatePasswordValidation, validateRequest } from "../validation/profile.validation.js";

const router = express.Router();

router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfileValidation, validateRequest, updateProfile);
router.put("/password", requireAuth, updatePasswordValidation, validateRequest, updatePassword);

export default router;
