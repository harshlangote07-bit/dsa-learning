import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/asyncHandler";

import { registerUser, loginUser } from "../services/auth.service";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validators";

export const register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data.email, data.password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }
);