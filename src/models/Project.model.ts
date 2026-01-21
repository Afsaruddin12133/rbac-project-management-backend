import { Schema, model, type InferSchemaType, type Types } from "mongoose";

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export type Project = InferSchemaType<typeof projectSchema> & {
  createdBy: Types.ObjectId;
};

const ProjectModel = model<Project>("Project", projectSchema);

export default ProjectModel;
