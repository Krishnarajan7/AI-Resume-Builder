import { Router } from "express";

import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  enhanceSummaryField,
  enhanceSectionsField,
  improveBulletField,
  suggestSkillsField,
} from "../controllers/resume.controller.js";

import { validateResume } from "../middleware/validateResume.js";
import resumeLimiter from "../middleware/rateLimitResume.js";
import { auditLog } from "../middleware/auditLog.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// ---------------- CRUD Routes ----------------
router.post(
  "/",
  requireAuth,
  resumeLimiter,
  validateResume,
  auditLog("CREATE_RESUME"),
  createResume
);

router.get(
  "/",
  requireAuth,
  resumeLimiter,
  auditLog("LIST_RESUMES"),
  getResumes
);

router.get(
  "/:id",
  requireAuth,
  resumeLimiter,
  auditLog("GET_RESUME"),
  getResumeById
);

router.patch(
  "/:id",
  requireAuth,
  resumeLimiter,
  validateResume,
  auditLog("UPDATE_RESUME"),
  updateResume
);

router.delete(
  "/:id",
  requireAuth,
  resumeLimiter,
  auditLog("DELETE_RESUME"),
  deleteResume
);

// ---------------- AI Endpoints ----------------
router.post(
  "/ai/enhance/summary",
  requireAuth,
  resumeLimiter,
  auditLog("ENHANCE_SUMMARY"),
  enhanceSummaryField
);

router.post(
  "/ai/improve/bullets",
  requireAuth,
  resumeLimiter,
  auditLog("IMPROVE_BULLETS"),
  improveBulletField
);

router.post(
  "/ai/suggest/skills",
  requireAuth,
  resumeLimiter,
  auditLog("SUGGEST_SKILLS"),
  suggestSkillsField
);

router.post(
  "/ai/enhance/sections",
  requireAuth,
  resumeLimiter,
  auditLog("ENHANCE_SECTION"),
  enhanceSectionsField
);

export default router;
