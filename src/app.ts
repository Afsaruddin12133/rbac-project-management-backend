import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(express.json());

app.use(authRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
