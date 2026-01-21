import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import projectsRoutes from "./modules/projects/projects.routes.js";
import usersRoutes from "./modules/users/users.routes.js";

const app = express();

app.use(express.json());

app.use(authRoutes);
app.use(usersRoutes);
app.use(projectsRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
