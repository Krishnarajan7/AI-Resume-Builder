import { createResumeSchema, updateResumeSchema } from "../validation/resume.validation.js";

export function validateResume(req, res, next) {
  const schema = req.method === "PATCH" ? updateResumeSchema : createResumeSchema;

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }

  next();
}
