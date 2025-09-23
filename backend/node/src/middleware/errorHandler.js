export function errorHandler(err, req, res, next) {
  // Log error to external service here if needed
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
}