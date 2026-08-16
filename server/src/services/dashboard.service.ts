import prisma from "../db/prisma";
import { Verdict } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import { getRecommendations } from "./recommendation.service";


async function getUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}


async function getDashboardStats(userId: string) {
  const [
    totalSubmissions,
    acceptedSubmissions,
    solvedProblems,
  ] = await Promise.all([
    prisma.submission.count({
      where: {
        userId,
      },
    }),

    prisma.submission.count({
      where: {
        userId,
        verdict: Verdict.AC,
      },
    }),

    prisma.submission.findMany({
      where: {
        userId,
        verdict: Verdict.AC,
      },
      distinct: ["problemId"],
      select: {
        problemId: true,
      },
    }),
  ]);

  const acceptanceRate =
    totalSubmissions === 0
      ? 0
      : Number(
          ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
        );

  return {
    problemsSolved: solvedProblems.length,
    totalSubmissions,
    acceptedSubmissions,
    acceptanceRate,
  };
}


async function getTopicMastery(userId: string) {
  return prisma.userTopicMastery.findMany({
    where: {
      userId,
    },

    select: {
      mastery: true,

      topic: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      mastery: "desc",
    },
  });
}


async function getRecentSubmissions(userId: string) {
  return prisma.submission.findMany({
    where: {
      userId,
    },

    select: {
      id: true,
      verdict: true,
      submissionNumber: true,
      hintsViewed: true,
      submittedAt: true,

      problem: {
        select: {
          id: true,
          title: true,
          difficulty: true,
        },
      },
    },

    orderBy: {
      submittedAt: "desc",
    },

    take: 10,
  });
}


export async function getDashboard(userId: string) {
  const [
    user,
    stats,
    mastery,
    recentSubmissions,
    recommendations,
  ] = await Promise.all([
    getUserInfo(userId),
    getDashboardStats(userId),
    getTopicMastery(userId),
    getRecentSubmissions(userId),
    getRecommendations(userId),
  ]);

  return {
    user,
    stats,
    mastery,
    recentSubmissions,
    recommendations,
  };
}