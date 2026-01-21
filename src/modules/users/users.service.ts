import UserModel, { UserRole, UserStatus } from "../../models/User.model.js";

export const getUsers = async (page = 1, limit = 10) => {
  const currentPage = Math.max(1, page);
  const perPage = Math.max(1, limit);
  const skip = (currentPage - 1) * perPage;

  const [total, users] = await Promise.all([
    UserModel.countDocuments().exec(),
    UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .exec(),
  ]);

  return {
    data: users,
    page: currentPage,
    limit: perPage,
    total,
    totalPages: Math.ceil(total / perPage),
  };
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  )
    .select("-password")
    .exec();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  )
    .select("-password")
    .exec();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
