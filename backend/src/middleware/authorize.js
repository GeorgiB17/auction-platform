export function authorize() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Nicht authentifiziert",
      });
    }
    // Allow access for specific users regardless of their role
    if (req.user.username === "aj049" || req.user.username === "gb040") {
      return next();
    }

    if (req.user.role !== "MITARBEITER") {
      return res.status(403).json({
        success: false,
        message: "Keine Berechtigung",
      });
    }

    next();
  };
}