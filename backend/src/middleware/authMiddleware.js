import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "secret_key";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Kein Token gefunden" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret); //add secret key to env
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ success: false, message: "Ungültiger Token" });
  }
}