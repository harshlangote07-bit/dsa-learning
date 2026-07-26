import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createSubmission as createSubmissionService } from "../services/submission.service";

export const createSubmission = asyncHandler(
  async (req: Request, res: Response) => {
  const submission = await createSubmissionService({
    ...req.body,
    userId: req.user.id,
  });
    res.status(201).json({
      success: true,
      message: "Submission created successfully",
      data: submission,
    });
  }
);