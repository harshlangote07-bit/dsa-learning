import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { registerUser } from "../services/auth.service";
import { loginUser } from "../services/auth.service";

export const register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }
);

export const login = asyncHandler(
  async (req, res, _next) => {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }
);