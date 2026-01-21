import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "./projects.service.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "./projects.validation.js";

export const createProjectHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  const parseResult = createProjectSchema.safeParse(req.body ?? {});

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!parseResult.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const project = await createProject(userId, parseResult.data);
    return res.status(201).json({ project });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create project";
    return res.status(400).json({ message });
  }
};

export const getProjectsHandler = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const projects = await getProjects();
    return res.status(200).json({ projects });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch projects";
    return res.status(500).json({ message });
  }
};

export const updateProjectHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const parseResult = updateProjectSchema.safeParse(req.body ?? {});

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  if (!parseResult.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const project = await updateProject(id, userId, parseResult.data);
    return res.status(200).json({ project });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update project";
    const statusCode =
      message === "Forbidden"
        ? 403
        : message === "Project not found"
        ? 404
        : 400;
    return res.status(statusCode).json({ message });
  }
};

export const deleteProjectHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  try {
    const project = await deleteProject(id, userId);
    return res.status(200).json({ project });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete project";
    const statusCode =
      message === "Forbidden"
        ? 403
        : message === "Project not found"
        ? 404
        : 400;
    return res.status(statusCode).json({ message });
  }
};
