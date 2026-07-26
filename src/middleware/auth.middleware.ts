import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
    ) as { userId: string };

    req.user = {
    id: decoded.userId,
    };

    console.log(req.user);

    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};