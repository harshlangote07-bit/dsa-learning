import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import * as dashboardService from "../services/dashboard.service";

export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const dashboard = await dashboardService.getDashboard(req.user.id);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  }
);