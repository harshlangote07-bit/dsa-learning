import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { judgeCpp } from "../services/judge.service";

export const judgeCode = asyncHandler(
  async (req: Request, res: Response) => {
    const problemId = String(req.params.problemId);

    const result = await judgeCpp(
      problemId,
      req.body.code
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);