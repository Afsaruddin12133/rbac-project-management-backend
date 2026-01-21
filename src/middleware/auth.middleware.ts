import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JwtPayload } from "../utils/jwt.js";

export type AuthenticatedRequest = Request & { user?: JwtPayload };

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const decoded = verifyToken(token);
		req.user = decoded;
		return next();
	} catch {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

export default authMiddleware;
