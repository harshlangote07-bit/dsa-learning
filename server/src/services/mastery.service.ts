import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import prisma from "../db/prisma";

function getBaseMasteryIncrease(submissionNumber: number): number {
  switch (submissionNumber) {
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

export async function updateUserMastery(
  tx: Prisma.TransactionClient,
  userId: string,
  problemId: string,
  submissionNumber: number
) {
  const baseIncrease = getBaseMasteryIncrease(submissionNumber);

  // No mastery gain after the 3rd accepted submission
  if (baseIncrease === 0) {
    return;
  }

  const problem = await tx.problem.findUnique({
    where: {
      id: problemId,
    },
    include: {
      topics: true,
    },
  });

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  for (const pt of problem.topics) {
    const masteryIncrease = baseIncrease * pt.weight;

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
        mastery: Math.min(100, masteryIncrease),
      },

      update: {
        mastery: {
          increment: masteryIncrease,
        },
      },
    });

    // Ensure mastery never exceeds 100
    const updated = await tx.userTopicMastery.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId: pt.topicId,
        },
      },
    });

    if (updated && updated.mastery > 100) {
      await tx.userTopicMastery.update({
        where: {
          userId_topicId: {
            userId,
            topicId: pt.topicId,
          },
        },
        data: {
          mastery: 100,
        },
      });
    }
  }
}

export async function getUserMastery(userId: string) {
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