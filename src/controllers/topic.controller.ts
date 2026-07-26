import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { getAllTopics } from "../services/topic.service";

export const getTopics = asyncHandler(
  async (_req: Request, res: Response) => {
    const topics = await getAllTopics();

    res.status(200).json({
      success: true,
      message: "Topics fetched successfully",
      data: topics,
    });
  }
);