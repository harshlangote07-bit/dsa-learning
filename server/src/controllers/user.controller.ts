import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import * as userService from "../services/user.service";

export const getMe = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);