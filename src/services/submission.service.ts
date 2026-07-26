import prisma from "../db/prisma";
import { Verdict } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import { updateUserMastery } from "./mastery.service";

type CreateSubmissionInput = {
  userId: string;
  problemId: string;
  verdict: Verdict;
  hintsViewed?: number;
};

export async function createSubmission(data: CreateSubmissionInput) {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if problem exists
  const problem = await prisma.problem.findUnique({
    where: { id: data.problemId },
  });

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  // Count previous submissions
  const submissionCount = await prisma.submission.count({
    where: {
      userId: data.userId,
      problemId: data.problemId,
    },
  });

  const currentSubmissionNumber = submissionCount + 1;

  // Create submission
  const submission = await prisma.submission.create({
    data: {
      userId: data.userId,
      problemId: data.problemId,
      verdict: data.verdict,
      submissionNumber: currentSubmissionNumber,
      hintsViewed: data.hintsViewed ?? 0,
    },
  });

  // Update mastery
  await updateUserMastery(
    data.userId,
    data.problemId,
    data.verdict,
    currentSubmissionNumber
  );

  return submission;
}