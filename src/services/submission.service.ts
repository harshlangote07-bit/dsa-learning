import prisma from "../db/prisma";
import { Verdict } from "../generated/prisma/client";
import { updateUserMastery } from "./mastery.service";

type CreateSubmissionInput = {
  userId: string;
  problemId: string;
  verdict: Verdict;
  hintsViewed?: number;
};

export async function createSubmission(data: CreateSubmissionInput) {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const problem = await prisma.problem.findUnique({
    where: { id: data.problemId },
  });

  if (!problem) {
    throw new Error("Problem not found");
  }

  const submissionCount = await prisma.submission.count({
    where: {
      userId: data.userId,
      problemId: data.problemId,
    },
  });

  const currentSubmissionNumber = submissionCount + 1;

  const submission = await prisma.submission.create({
    data: {
      userId: data.userId,
      problemId: data.problemId,
      verdict: data.verdict,
      submissionNumber: currentSubmissionNumber,
      hintsViewed: data.hintsViewed ?? 0,
    },
  });

  await updateUserMastery(
    data.userId,
    data.problemId,
    data.verdict,
    currentSubmissionNumber
  );

  return submission;
}