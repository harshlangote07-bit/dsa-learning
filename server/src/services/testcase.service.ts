import prisma from "../db/prisma";
import { AppError } from "../utils/AppError";

interface CreateTestCaseInput {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  order: number;
}

interface UpdateTestCaseInput {
  input?: string;
  expectedOutput?: string;
  isHidden?: boolean;
  order?: number;
}

export async function createTestCase(
  problemId: string,
  data: CreateTestCaseInput
) {
  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId,
    },
  });

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  return prisma.testCase.create({
    data: {
      problemId,
      input: data.input,
      expectedOutput: data.expectedOutput,
      isHidden: data.isHidden ?? false,
      order: data.order,
    },
  });
}

export async function getProblemTestCases(
  problemId: string,
  isAdmin = false
) {
  return prisma.testCase.findMany({
    where: {
      problemId,
      ...(isAdmin
        ? {}
        : {
            isHidden: false,
          }),
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function updateTestCase(
  testcaseId: string,
  data: UpdateTestCaseInput
) {
  const testcase = await prisma.testCase.findUnique({
    where: {
      id: testcaseId,
    },
  });

  if (!testcase) {
    throw new AppError("Test case not found", 404);
  }

  return prisma.testCase.update({
    where: {
      id: testcaseId,
    },
    data,
  });
}

export async function deleteTestCase(
  testcaseId: string
) {
  const testcase = await prisma.testCase.findUnique({
    where: {
      id: testcaseId,
    },
  });

  if (!testcase) {
    throw new AppError("Test case not found", 404);
  }

  await prisma.testCase.delete({
    where: {
      id: testcaseId,
    },
  });

  return true;
}