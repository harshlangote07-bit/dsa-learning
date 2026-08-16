import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";

import * as problemService from "../services/problem.service";
import { createProblemSchema } from "../validators/problem.validator";

type ProblemParams = {
  id: string;
};

export const getProblems = asyncHandler(
  async (_req: Request, res: Response) => {
    const problems = await problemService.getAllProblems();

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      data: problems,
    });
  }
);

export const getProblem = asyncHandler(
  async (req: Request<ProblemParams>, res: Response) => {
    const problem = await problemService.getProblemById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      data: problem,
    });
  }
);

export const createProblem = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createProblemSchema.parse(req.body);

    const problem = await problemService.createProblem(data);

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      data: problem,
    });
  }
);

export const updateProblem = asyncHandler(
  async (req: Request<ProblemParams>, res: Response) => {
    const data = createProblemSchema.parse(req.body);

    const problem = await problemService.updateProblem(
      req.params.id,
      data
    );

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: problem,
    });
  }
);

export const deleteProblem = asyncHandler(
  async (req: Request<ProblemParams>, res: Response) => {
    const result = await problemService.deleteProblem(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

export const getProblemProgress = asyncHandler(
  async (
    req: Request<ProblemParams>,
    res: Response
  ) => {
    const progress =
      await problemService.getProblemProgress(
        req.params.id,
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: progress,
    });
  }
);

export const getAllProblemProgress =
  asyncHandler(
    async (req: Request, res: Response) => {
      const progress =
        await problemService.getAllProblemProgress(
          req.user.id
        );

      res.status(200).json({
        success: true,
        data: progress,
      });
    }
  );