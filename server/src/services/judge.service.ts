import prisma from "../db/prisma";
import { Verdict } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import { runCpp } from "./compiler.service";

interface JudgeResult {
  verdict: Verdict;
  output: string;
  error: string;
  executionTime: number;
  passedTests: number;
  totalTests: number;
}

function normalizeOutput(output: string): string {
  return output.trim();
}

export async function judgeCpp(
  problemId: string,
  code: string
): Promise<JudgeResult> {
  // ==========================
  // Check problem
  // ==========================

  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId,
    },
  });

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  // ==========================
  // Get ALL test cases
  // ==========================

  const testCases = await prisma.testCase.findMany({
    where: {
      problemId,
    },
    orderBy: {
      order: "asc",
    },
  });

  if (testCases.length === 0) {
    throw new AppError(
      "No test cases found for this problem",
      400
    );
  }

  // ==========================
  // Run test cases
  // ==========================

  let totalExecutionTime = 0;
  let passedTests = 0;

  for (const testCase of testCases) {
    const result = await runCpp(
      code,
      testCase.input
    );

    totalExecutionTime += result.executionTime;

    // Compilation Error
    if (result.type === "COMPILATION_ERROR") {
      return {
        verdict: Verdict.CE,
        output: result.output,
        error: result.error,
        executionTime: totalExecutionTime,
        passedTests,
        totalTests: testCases.length,
      };
    }

    // Time Limit Exceeded
    if (result.type === "TIME_LIMIT_EXCEEDED") {
      return {
        verdict: Verdict.TLE,
        output: result.output,
        error: result.error,
        executionTime: totalExecutionTime,
        passedTests,
        totalTests: testCases.length,
      };
    }

    // Runtime Error
    if (result.type === "RUNTIME_ERROR") {
      return {
        verdict: Verdict.RE,
        output: result.output,
        error: result.error,
        executionTime: totalExecutionTime,
        passedTests,
        totalTests: testCases.length,
      };
    }

    // ==========================
    // Compare output
    // ==========================

    const actualOutput = normalizeOutput(
      result.output
    );

    const expectedOutput = normalizeOutput(
      testCase.expectedOutput
    );

    if (actualOutput !== expectedOutput) {
      return {
        verdict: Verdict.WA,
        output: result.output,
        error: "",
        executionTime: totalExecutionTime,
        passedTests,
        totalTests: testCases.length,
      };
    }

    passedTests++;
  }

  // ==========================
  // All tests passed
  // ==========================

  return {
    verdict: Verdict.AC,
    output: "",
    error: "",
    executionTime: totalExecutionTime,
    passedTests,
    totalTests: testCases.length,
  };
}