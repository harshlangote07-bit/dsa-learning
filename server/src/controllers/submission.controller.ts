import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createSubmissionSchema } from "../validators/submission.validator";
import { createSubmission as createSubmissionService } from "../services/submission.service";

export const createSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createSubmissionSchema.parse(req.body);

    const submission = await createSubmissionService({
      ...body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Submission created successfully",
      data: submission,
    });
  }
);