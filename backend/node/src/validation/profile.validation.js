import { body, validationResult } from "express-validator";

export const updateProfileValidation = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("job_title").optional().isString(),
  body("company").optional().isString(),
  body("industry").optional().isString(),
  body("phone_number").optional().isMobilePhone(),
  body("location").optional().isString(),
  body("website_url").optional().isURL(),
  body("linkedin_url").optional().isURL(),
  body("github_url").optional().isURL(),
  body("professional_summary").optional().isString(),
  body("years_experience").optional().isInt({ min: 0 }).withMessage("Years of experience must be positive"),
  body("career_level").optional().isString(),
  body("avatar_url").optional().isURL(),
];

export const updatePasswordValidation = [
  body("newPassword")
    .exists()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .exists()
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
