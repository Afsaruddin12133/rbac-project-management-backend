import { z } from "zod";
import { UserRole } from "../../models/User.model.js";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const inviteCreationSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
});

export const inviteRegistrationSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
  password: z.string().min(6),
});

export const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
