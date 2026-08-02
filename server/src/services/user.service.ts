import prisma from "../db/prisma";
import { AppError } from "../utils/AppError";

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const [
    problemsSolved,
    totalSubmissions,
    acceptedSubmissions,
  ] = await Promise.all([
    prisma.submission.groupBy({
      by: ["problemId"],
      where: {
        userId,
        verdict: "AC",
      },
    }),

    prisma.submission.count({
      where: {
        userId,
      },
    }),

    prisma.submission.count({
      where: {
        userId,
        verdict: "AC",
      },
    }),
  ]);

  return {
    ...user,

    stats: {
      problemsSolved: problemsSolved.length,
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate:
        totalSubmissions === 0
          ? 0
          : Number(
              (
                (acceptedSubmissions / totalSubmissions) *
                100
              ).toFixed(1)
            ),
    },
  };
};