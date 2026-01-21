import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import roleMiddleware from "../../middleware/role.middleware.js";
import { UserRole } from "../../models/User.model.js";
import {
  createAdminHandler,
  inviteHandler,
  loginHandler,
  registerViaInviteHandler,
} from "./auth.controller.js";

const router = Router();

router.post("/auth/login", loginHandler);
router.post(
  "/auth/invite",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  inviteHandler
);
router.post("/auth/register-via-invite", registerViaInviteHandler);
router.post("/auth/create-admin", createAdminHandler);

export default router;
