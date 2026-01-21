import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: string;
  role: string;
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

const SECRET = JWT_SECRET as string;

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(
    payload,
    SECRET,
    JWT_EXPIRES_IN ? { expiresIn: JWT_EXPIRES_IN } : undefined
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as JwtPayload;
};
