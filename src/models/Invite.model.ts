import { Schema, model, type InferSchemaType } from "mongoose";
import { UserRole } from "./User.model.js";

const inviteSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export type Invite = InferSchemaType<typeof inviteSchema>;

const InviteModel = model<Invite>("Invite", inviteSchema);

export default InviteModel;
