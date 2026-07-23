import prisma from "../db/prisma";
import { Verdict } from "../generated/prisma/client";

function getMasteryIncrease(
  verdict: Verdict,
  submissionNumber: number
): number {
  if (verdict !== Verdict.AC) {
    return 0;
  }

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
  userId: string,
  problemId: string,
  verdict: Verdict,
  submissionNumber: number
) {
const increase = getMasteryIncrease(verdict, submissionNumber);
  if (increase === 0) return;

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      topics: true,
    },
  });

  if (!problem) {
    throw new Error("Problem not found");
  }

  for (const pt of problem.topics) {
    const mastery = await prisma.userTopicMastery.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId: pt.topicId,
        },
      },
    });

    if (!mastery) {
      await prisma.userTopicMastery.create({
        data: {
          userId,
          topicId: pt.topicId,
          mastery: increase,
        },
      });
    } else {
      await prisma.userTopicMastery.update({
        where: {
          userId_topicId: {
            userId,
            topicId: pt.topicId,
          },
        },
        data: {
          mastery: Math.min(100, mastery.mastery + increase),
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
      topic: true,
    },
    orderBy: {
      mastery: "desc",
    },
  });
}