import admin from "../firebaseAdmin.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email || null };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    requireAuth(req, res, async () => {
      try {
        const user = await User.findOne({ uid: req.user.uid }).lean();
        if (!user || !roles.includes(user.role)) {
          return res.status(403).json({ error: "Forbidden" });
        }
        req.dbUser = user;
        next();
      } catch (err) {
        return res.status(500).json({ error: "Authorization failed" });
      }
    });
  };
}
