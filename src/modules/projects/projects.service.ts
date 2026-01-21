import ProjectModel from "../../models/Project.model.js";
import UserModel, { UserRole } from "../../models/User.model.js";

type CreateProjectInput = {
  name: string;
  description?: string | undefined;
};

type UpdateProjectInput = {
  name?: string | undefined;
  description?: string | undefined;
  status?: "ACTIVE" | "ARCHIVED" | "DELETED" | undefined;
};

const ensureAdmin = async (userId: string) => {
  const user = await UserModel.findById(userId).select("role").exec();
  if (!user || user.role !== UserRole.ADMIN) {
    throw new Error("Forbidden");
  }
};

export const createProject = async (
  userId: string,
  data: CreateProjectInput
) => {
  const payload: { name: string; createdBy: string; description?: string } = {
    name: data.name,
    createdBy: userId,
  };

  if (data.description !== undefined) {
    payload.description = data.description;
  }

  const project = await ProjectModel.create(payload);

  return project;
};

export const getProjects = async () => {
  return ProjectModel.find({ isDeleted: false }).sort({ createdAt: -1 }).exec();
};

export const updateProject = async (
  projectId: string,
  userId: string,
  data: UpdateProjectInput
) => {
  await ensureAdmin(userId);

  const project = await ProjectModel.findOneAndUpdate(
    { _id: projectId, isDeleted: false },
    {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    },
    { new: true }
  ).exec();

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const deleteProject = async (projectId: string, userId: string) => {
  await ensureAdmin(userId);

  const project = await ProjectModel.findOneAndUpdate(
    { _id: projectId, isDeleted: false },
    { isDeleted: true, status: "DELETED" },
    { new: true }
  ).exec();

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};
