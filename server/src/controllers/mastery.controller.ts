import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { getUserMastery } from "../services/mastery.service";

export const getMastery = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const mastery = await getUserMastery(id);

    res.status(200).json({
      success: true,
      message: "User mastery fetched successfully",
      data: mastery,
    });
  }
);