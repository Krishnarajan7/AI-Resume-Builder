export function auditLog(action) {
  return (req, res, next) => {
    const userId = req.user?.id || "anonymous";
    const resumeId = req.params.id || null;

    console.log(
      `[AUDIT] User ${userId} performed ${action} on Resume ${resumeId} at ${new Date().toISOString()}`
    );

    next();
  };
}
