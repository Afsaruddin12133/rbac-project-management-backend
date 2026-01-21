import { Schema, model, type InferSchemaType } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    status: { type: String, enum: Object.values(UserStatus), required: true },
    invitedAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export type User = InferSchemaType<typeof userSchema>;

const UserModel = model<User>("User", userSchema);

export default UserModel;
