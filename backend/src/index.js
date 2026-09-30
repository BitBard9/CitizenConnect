import "dotenv/config";
import dns from "node:dns";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Node 24.18 on Windows: mongodb+srv SRV lookup hits loopback DNS and fails
// with querySrv ECONNREFUSED. Linux containers usually do not need this.
if (process.platform === "win32") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}
import usersRouter from "./routes/users.js";
import issuesRouter from "./routes/issues.js";
import notificationsRouter from "./routes/notifications.js";

const app = express();

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
];
const extraOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultOrigins, ...extraOrigins]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api/users", usersRouter);
app.use("/api/issues", issuesRouter);
app.use("/api/notifications", notificationsRouter);

// Handle 404 for API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});