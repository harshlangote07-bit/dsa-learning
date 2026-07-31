import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { getRecommendations } from "../services/recommendation.service";

export const recommendProblems = asyncHandler(
  async (req: Request, res: Response) => {
    const recommendations = await getRecommendations(req.user.id);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  }
);