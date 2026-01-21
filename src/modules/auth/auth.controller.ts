import { Router, type Request, type Response } from "express";
import { UserRole } from "../../models/User.model.js";
import {
  createAdmin,
  createInvite,
  login,
  registerViaInvite,
} from "./auth.service.js";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await login(email, password);
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    const status = message === "User is inactive" ? 403 : 401;
    return res.status(status).json({ message });
  }
};

export const inviteHandler = async (req: Request, res: Response) => {
  const { email, role } = req.body ?? {};

  if (!isNonEmptyString(email) || !isNonEmptyString(role)) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  if (!Object.values(UserRole).includes(role as UserRole)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const invite = await createInvite(email, role as UserRole);
    return res.status(201).json({ invite });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invite creation failed";
    return res.status(500).json({ message });
  }
};

export const registerViaInviteHandler = async (req: Request, res: Response) => {
  const { token, name, password } = req.body ?? {};

  if (
    !isNonEmptyString(token) ||
    !isNonEmptyString(name) ||
    !isNonEmptyString(password)
  ) {
    return res
      .status(400)
      .json({ message: "Token, name, and password are required" });
  }

  try {
    const result = await registerViaInvite(token, name, password);
    return res.status(201).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    return res.status(400).json({ message });
  }
};

export const createAdminHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await createAdmin(email, password);
    return res.status(201).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Admin creation failed";
    const status = message === "Admin already exists" ? 409 : 400;
    return res.status(status).json({ message });
  }
};

const router = Router();

router.post("/auth/login", loginHandler);
router.post("/auth/invite", inviteHandler);
router.post("/auth/register-via-invite", registerViaInviteHandler);
router.post("/auth/create-admin", createAdminHandler);

export default router;
