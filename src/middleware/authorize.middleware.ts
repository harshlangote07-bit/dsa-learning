import { NextFunction, Request, Response } from "express";
import { Role } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";

export const authorize = (...allowedRoles: Role[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden: Insufficient permissions", 403);
    }

    next();
  };
};