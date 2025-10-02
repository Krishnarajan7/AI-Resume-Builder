import rateLimit from "express-rate-limit";

const resumeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // max 30 resume requests/min per IP
  message: {
    message: "Too many requests. Please slow down.",
  },
});

export default resumeLimiter;
