import type { NextFunction, Request, Response } from "express";

const DEFAULT_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const DEFAULT_HEADERS = "Content-Type, Authorization";

const normalizeOrigin = (value?: string) => {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const isLocalhostOrigin = (origin: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

const resolveAllowedOrigin = (origin?: string) => {
  if (!origin) return null;

  const configuredOrigin = normalizeOrigin(process.env.VITE_API_BASE_URL);
  if (configuredOrigin && origin === configuredOrigin) {
    return origin;
  }

  const nodeEnv = process.env.NODE_ENV ?? "development";
  if (nodeEnv !== "production" && isLocalhostOrigin(origin)) {
    return origin;
  }

  return null;
};

const allowCredentials =
  (process.env.CORS_ALLOW_CREDENTIALS ?? "").toLowerCase() === "true";

const allowedHeaders = process.env.CORS_ALLOWED_HEADERS ?? DEFAULT_HEADERS;
const allowedMethods = process.env.CORS_ALLOWED_METHODS ?? DEFAULT_METHODS;

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const allowedOrigin = resolveAllowedOrigin(origin);

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");

    if (allowCredentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
  }

  res.setHeader("Access-Control-Allow-Methods", allowedMethods);
  res.setHeader("Access-Control-Allow-Headers", allowedHeaders);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return next();
};

export default corsMiddleware;