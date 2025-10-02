// validation/resume.validation.js
import Joi from "joi";

// Full schema for creating a resume (POST)
export const createResumeSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.object().required(), // structured JSON
  status: Joi.string().valid("DRAFT", "ACTIVE", "ARCHIVED").default("DRAFT"),
  tailoredFor: Joi.string().max(200).optional(),
  aiGenerated: Joi.boolean().optional(),
  summary: Joi.string().max(1000).optional(),
  bullets: Joi.array().items(Joi.string()).optional(),
  suggestedSkills: Joi.array().items(Joi.string()).optional(),
  enhancedSections: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      text: Joi.string().required(),
    })
  ).optional()
});

// Partial schema for updating a resume (PATCH)
export const updateResumeSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  content: Joi.object().optional(),
  status: Joi.string().valid("DRAFT", "ACTIVE", "ARCHIVED").optional(),
  tailoredFor: Joi.string().max(200).optional(),
  aiGenerated: Joi.boolean().optional(),
  summary: Joi.string().max(1000).optional(),
  bullets: Joi.array().items(Joi.string()).optional(),
  suggestedSkills: Joi.array().items(Joi.string()).optional(),
  enhancedSections: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      text: Joi.string().required(),
    })
  ).optional()
});
