import type { Request, Response } from "express";
import { UserRole, UserStatus } from "../../models/User.model.js";
import { getUsers, updateUserRole, updateUserStatus } from "./users.service.js";

export const getUsersHandler = async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  try {
    const result = await getUsers(page, limit);
    return res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return res.status(500).json({ message });
  }
};

export const updateUserRoleHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body ?? {};

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!role || !Object.values(UserRole).includes(role as UserRole)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await updateUserRole(id, role as UserRole);
    return res.status(200).json({ user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update role";
    const status = message === "User not found" ? 404 : 400;
    return res.status(status).json({ message });
  }
};

export const updateUserStatusHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!status || !Object.values(UserStatus).includes(status as UserStatus)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const user = await updateUserStatus(id, status as UserStatus);
    return res.status(200).json({ user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update status";
    const statusCode = message === "User not found" ? 404 : 400;
    return res.status(statusCode).json({ message });
  }
};
