import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { getAllProblems, getProblemById } from "../services/problem.service";
import { AppError } from "../utils/AppError";

export const getProblems = asyncHandler(async (_req: Request, res: Response) => {
  const problems = await getAllProblems();

  res.status(200).json({
    success: true,
    message: "Problems fetched successfully",
    data: problems,
  });
});

export const getProblem = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const problem = await getProblemById(id);

    if (!problem) {
      throw new AppError("Problem not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      data: problem,
    });
  }
);