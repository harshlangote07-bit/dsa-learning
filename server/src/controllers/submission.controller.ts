import { Request, Response } from "express";
import {
  Verdict,
  Language,
} from "../generated/prisma/client";

import { asyncHandler } from "../middleware/asyncHandler";
import { createSubmissionSchema } from "../validators/submission.validator";

import {
  createSubmission as createSubmissionService,
  getUserSubmissions,
  getSubmissionById,
} from "../services/submission.service";

// ==========================
// Get submission history
// ==========================

export const getSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Math.max(
      1,
      Number(req.query.page) || 1
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        Number(req.query.limit) || 10
      )
    );

    const verdict = req.query.verdict as
      | Verdict
      | undefined;

    const problemId = req.query.problemId as
      | string
      | undefined;

    const language = req.query.language as
      | Language
      | undefined;

    const result = await getUserSubmissions(
      req.user.id,
      page,
      limit,
      verdict,
      problemId,
      language
    );

    res.status(200).json({
      success: true,
      data: result.submissions,
      pagination: result.pagination,
    });
  }
);

// ==========================
// Create submission
// ==========================

export const createSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const body =
      createSubmissionSchema.parse(req.body);

    const result =
      await createSubmissionService({
        userId: req.user.id,
        problemId: body.problemId,
        language: body.language,
        code: body.code
      });

    res.status(201).json({
      success: true,
      message: "Submission judged successfully",
      data: result,
    });
  }
);

// ==========================
// Get submission details
// ==========================

export const getSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const submissionId =
      req.params.id as string;

    const submission =
      await getSubmissionById(
        submissionId,
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: submission,
    });
  }
);