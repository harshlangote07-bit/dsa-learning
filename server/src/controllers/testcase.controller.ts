import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";

import * as testcaseService from "../services/testcase.service";

import {
  createTestCaseSchema,
  updateTestCaseSchema,
} from "../validators/testcase.validators";

export const createTestCase = asyncHandler(
  async (req: Request, res: Response) => {
    const problemId = String(req.params.problemId);

    const body = createTestCaseSchema.parse(req.body);

    const testCase = await testcaseService.createTestCase(
      problemId,
      body
    );

    res.status(201).json({
      success: true,
      message: "Test case created successfully",
      data: testCase,
    });
  }
);

export const getProblemTestCases = asyncHandler(
  async (req: Request, res: Response) => {
    const problemId = String(req.params.problemId);

    const isAdmin = req.user?.role === "ADMIN";

    const testCases =
      await testcaseService.getProblemTestCases(
        problemId,
        isAdmin
      );

    res.status(200).json({
      success: true,
      data: testCases,
    });
  }
);

export const updateTestCase = asyncHandler(
  async (req: Request, res: Response) => {
    const testcaseId = String(req.params.testcaseId);

    const body = updateTestCaseSchema.parse(req.body);

    const testCase =
      await testcaseService.updateTestCase(
        testcaseId,
        body
      );

    res.status(200).json({
      success: true,
      message: "Test case updated successfully",
      data: testCase,
    });
  }
);

export const deleteTestCase = asyncHandler(
  async (req: Request, res: Response) => {
    const testcaseId = String(req.params.testcaseId);

    await testcaseService.deleteTestCase(testcaseId);

    res.status(200).json({
      success: true,
      message: "Test case deleted successfully",
    });
  }
);