import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import roleMiddleware from "../../middleware/role.middleware.js";
import { UserRole } from "../../models/User.model.js";
import {
  getUsersHandler,
  updateUserRoleHandler,
  updateUserStatusHandler,
} from "./users.controller.js";

const router = Router();

router.get(
  "/users",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  getUsersHandler
);
router.patch(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  updateUserRoleHandler
);
router.patch(
  "/users/:id/status",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  updateUserStatusHandler
);

export default router;
