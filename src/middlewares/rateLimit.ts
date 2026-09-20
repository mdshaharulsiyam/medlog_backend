import type { NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

export const mutationRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export const getRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});


const mutationMethods = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

export const requestRateLimit = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.path.startsWith("/api/auth")) {
    return authRateLimit(req, res, next);
  }

  if (mutationMethods.has(req.method)) {
    return mutationRateLimit(req, res, next);
  }

  if (req.method === "GET") {
    return getRateLimit(req, res, next);
  }

  next();
};