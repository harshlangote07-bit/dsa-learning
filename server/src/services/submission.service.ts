import prisma from "../db/prisma";
import { Verdict, Language } from "../generated/prisma/client";import { AppError } from "../utils/AppError";
import { updateUserMastery } from "./mastery.service";


export type CreateSubmissionInput = {
  userId: string;
  problemId: string;

  language: Language;

  code: string;

  verdict: Verdict;

  executionTime?: number;

  hintsViewed?: number;
};

function calculateScore(verdict: Verdict): number {
  switch (verdict) {
    case Verdict.AC:
      return 1;

    // Uncomment these if they exist in your enum
    // case Verdict.PARTIAL:
    //   return 0.5;

    default:
      return 0;
  }
}

export async function createSubmission(data: CreateSubmissionInput) {
  return prisma.$transaction(async (tx) => {
    // Check problem exists
    const problem = await tx.problem.findUnique({
      where: {
        id: data.problemId,
      },
    });

    if (!problem) {
      throw new AppError("Problem not found", 404);
    }

    // Next submission number
    const submissionCount = await tx.submission.count({
      where: {
        userId: data.userId,
        problemId: data.problemId,
      },
    });

    const submissionNumber = submissionCount + 1;

    const score = calculateScore(data.verdict);

const submission = await tx.submission.create({
  data: {
    userId: data.userId,

    problemId: data.problemId,

    language: data.language,

    code: data.code,

    executionTime: data.executionTime ?? 0,

    verdict: data.verdict,

    submissionNumber,

    score,

    hintsViewed: data.hintsViewed ?? 0,
  },
});

    // Update mastery only for positive score
    if (score > 0) {
    await updateUserMastery(
    tx,
    data.userId,
    data.problemId,
    submissionNumber
  );
    }

    return submission;
  });
}