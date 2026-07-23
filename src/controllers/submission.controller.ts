import { Request, Response } from "express";
import { createSubmission as createSubmissionService } from "../services/submission.service";

export async function createSubmission(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const submission = await createSubmissionService(req.body);

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (
        error.message === "User not found" ||
        error.message === "Problem not found"
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to create submission",
    });
  }
}