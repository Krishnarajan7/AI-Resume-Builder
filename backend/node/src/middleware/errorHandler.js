export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";
  console.error(err);
  res.status(status).json({ error: message });
}
