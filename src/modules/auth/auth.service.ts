import bcrypt from "bcrypt";
import crypto from "crypto";
import InviteModel from "../../models/Invite.model.js";
import UserModel, {
  UserRole,
  UserStatus,
  type UserRole as UserRoleType,
} from "../../models/User.model.js";
import { signToken } from "../../utils/jwt.js";

const INVITE_EXPIRY_MS = 48 * 60 * 60 * 1000;

const sanitizeUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
  status: string;
}) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

export const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email }).exec();

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new Error("User is inactive");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ userId: String(user._id), role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const createInvite = async (email: string, role: UserRoleType) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MS);

  const invite = await InviteModel.create({
    email,
    role,
    token,
    expiresAt,
  });

  return invite;
};

export const registerViaInvite = async (
  token: string,
  name: string,
  password: string
) => {
  const invite = await InviteModel.findOne({ token }).exec();

  if (!invite) {
    throw new Error("Invite not found");
  }

  if (invite.expiresAt.getTime() < Date.now()) {
    throw new Error("Invite has expired");
  }

  if (invite.acceptedAt) {
    throw new Error("Invite already accepted");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    name,
    email: invite.email,
    password: hashedPassword,
    role: invite.role,
    status: UserStatus.ACTIVE,
    invitedAt: invite.createdAt,
  });

  invite.acceptedAt = new Date();
  await invite.save();

  const authToken = signToken({ userId: String(user._id), role: user.role });

  return {
    token: authToken,
    user: sanitizeUser(user),
  };
};

export const createAdmin = async (email: string, password: string) => {
  const existingAdmin = await UserModel.exists({ role: UserRole.ADMIN });
  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  const existingUser = await UserModel.findOne({ email }).exec();
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const name = email.split("@")[0] || "Admin";

  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  });

  const token = signToken({ userId: String(user._id), role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
};
