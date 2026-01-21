import { Router, type NextFunction, type Response } from "express";
import authMiddleware, {
  type AuthenticatedRequest,
} from "../../middleware/auth.middleware.js";
import { UserRole } from "../../models/User.model.js";
import {
  createAdminHandler,
  inviteHandler,
  loginHandler,
  registerViaInviteHandler,
} from "./auth.controller.js";

const router = Router();

const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

router.post("/auth/login", loginHandler);
router.post("/auth/invite", authMiddleware, requireAdmin, inviteHandler);
router.post("/auth/register-via-invite", registerViaInviteHandler);
router.post("/auth/create-admin", createAdminHandler);

export default router;
