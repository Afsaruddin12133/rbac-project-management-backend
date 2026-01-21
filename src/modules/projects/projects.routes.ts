import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import roleMiddleware from "../../middleware/role.middleware.js";
import { UserRole } from "../../models/User.model.js";
import {
  createProjectHandler,
  deleteProjectHandler,
  getProjectsHandler,
  updateProjectHandler,
} from "./projects.controller.js";

const router = Router();

router.post("/projects", authMiddleware, createProjectHandler);
router.get("/projects", authMiddleware, getProjectsHandler);
router.patch(
  "/projects/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  updateProjectHandler
);
router.delete(
  "/projects/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  deleteProjectHandler
);

export default router;
