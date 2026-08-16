import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import prisma from "../db/prisma";

function getBaseMasteryIncrease(
  acceptedSubmissionNumber: number
): number {
  switch (acceptedSubmissionNumber) {
    case 1:
      return 10;

    case 2:
      return 2;

    case 3:
      return 1;

    default:
      return 0;
  }
}

function getHintMultiplier(
  hintsViewed: number
): number {
  return Math.max(
    0,
    1 - hintsViewed * 0.1
  );
}

export async function updateUserMastery(
  tx: Prisma.TransactionClient,
  userId: string,
  problemId: string,
  submissionId: string,
  acceptedSubmissionNumber: number,
  hintsViewed: number
) {
  const baseIncrease =
    getBaseMasteryIncrease(
      acceptedSubmissionNumber
    );

  // No mastery gain after the 3rd accepted submission
  if (baseIncrease === 0) {
    return;
  }

  const hintMultiplier =
    getHintMultiplier(hintsViewed);

  const adjustedIncrease =
    baseIncrease * hintMultiplier;

  const problem = await tx.problem.findUnique({
    where: {
      id: problemId,
    },

    include: {
      topics: true,
    },
  });

  if (!problem) {
    throw new AppError(
      "Problem not found",
      404
    );
  }

  for (const pt of problem.topics) {
    const masteryIncrease =
      adjustedIncrease * pt.weight;

    // Get mastery BEFORE the update
    const existingMastery =
      await tx.userTopicMastery.findUnique({
        where: {
          userId_topicId: {
            userId,
            topicId: pt.topicId,
          },
        },
      });

    const previousMastery =
      existingMastery?.mastery ?? 0;

    // Calculate the actual new mastery
    const newMastery = Math.min(
      100,
      previousMastery + masteryIncrease
    );

    // Actual increase may be smaller if mastery reaches 100
    const actualDelta =
      newMastery - previousMastery;

    // Update current mastery
    await tx.userTopicMastery.upsert({
      where: {
        userId_topicId: {
          userId,
          topicId: pt.topicId,
        },
      },

      create: {
        userId,
        topicId: pt.topicId,
        mastery: newMastery,
      },

      update: {
        mastery: newMastery,
      },
    });

    // Record mastery history only when mastery actually increased
    if (actualDelta > 0) {
      await tx.masteryHistory.create({
        data: {
          userId,
          topicId: pt.topicId,
          submissionId,

          previousMastery,
          newMastery,
          delta: actualDelta,
        },
      });
    }
  }
}

export async function getUserMastery(
  userId: string
) {
  return prisma.userTopicMastery.findMany({
    where: {
      userId,
    },

    include: {
      topic: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },

    orderBy: {
      mastery: "desc",
    },
  });
}