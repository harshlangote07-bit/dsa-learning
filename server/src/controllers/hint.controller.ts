import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";

import * as hintService from "../services/hint.service";

import {
  createHintSchema,
  updateHintSchema,
} from "../validators/hint.validator";

type ProblemParams = {
  problemId: string;
};

type HintParams = {
  problemId: string;
  hintId: string;
};

// ===========================
// Get problem hints
// ===========================

export const getProblemHints = asyncHandler(
  async (
    req: Request<ProblemParams>,
    res: Response
  ) => {
    const hints =
      await hintService.getProblemHints(
        req.params.problemId
      );

    res.status(200).json({
      success: true,
      data: hints,
    });
  }
);

// ===========================
// Create hint - ADMIN
// ===========================

export const createHint = asyncHandler(
  async (
    req: Request<ProblemParams>,
    res: Response
  ) => {
    const data = createHintSchema.parse(
      req.body
    );

    const hint =
      await hintService.createHint(
        req.params.problemId,
        data
      );

    res.status(201).json({
      success: true,
      message: "Hint created successfully",
      data: hint,
    });
  }
);

// ===========================
// Update hint - ADMIN
// ===========================

export const updateHint = asyncHandler(
  async (
    req: Request<HintParams>,
    res: Response
  ) => {
    const data = updateHintSchema.parse(
      req.body
    );

    const hint =
      await hintService.updateHint(
        req.params.problemId,
        req.params.hintId,
        data
      );

    res.status(200).json({
      success: true,
      message: "Hint updated successfully",
      data: hint,
    });
  }
);

// ===========================
// Delete hint - ADMIN
// ===========================

export const deleteHint = asyncHandler(
  async (
    req: Request<HintParams>,
    res: Response
  ) => {
    const result =
      await hintService.deleteHint(
        req.params.problemId,
        req.params.hintId
      );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);


type ViewHintParams = {
  problemId: string;
  hintId: string;
};

export const viewHint = asyncHandler(
  async (
    req: Request<ViewHintParams>,
    res: Response
  ) => {
    const result =
      await hintService.viewHint(
        req.user.id,
        req.params.problemId,
        req.params.hintId
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);