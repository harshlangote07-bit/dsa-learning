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
    mastery,
    recentSubmissions,
  ] = await Promise.all([
    // ==========================
    // Problems solved
    // ==========================

    prisma.submission.groupBy({
      by: ["problemId"],

      where: {
        userId,
        verdict: "AC",
      },
    }),

    // ==========================
    // Total submissions
    // ==========================

    prisma.submission.count({
      where: {
        userId,
      },
    }),

    // ==========================
    // Accepted submissions
    // ==========================

    prisma.submission.count({
      where: {
        userId,
        verdict: "AC",
      },
    }),

    // ==========================
    // Topic mastery
    // ==========================

    prisma.userTopicMastery.findMany({
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
    }),

    // ==========================
    // Recent submissions
    // ==========================

    prisma.submission.findMany({
      where: {
        userId,
      },

      take: 10,

      orderBy: {
        submittedAt: "desc",
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
    }),
  ]);

  const acceptanceRate =
    totalSubmissions === 0
      ? 0
      : Number(
          (
            (acceptedSubmissions / totalSubmissions) *
            100
          ).toFixed(1)
        );

  return {
    ...user,

    stats: {
      problemsSolved: problemsSolved.length,
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate,
    },

    mastery,

    recentSubmissions,
  };
};


export const getMasteryHistory = async (
  userId: string
) => {
  return prisma.masteryHistory.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,

      previousMastery: true,
      newMastery: true,
      delta: true,

      createdAt: true,

      topic: {
        select: {
          id: true,
          name: true,
        },
      },

      submission: {
        select: {
          id: true,
          submissionNumber: true,
          hintsViewed: true,
          verdict: true,

          problem: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            },
          },
        },
      },
    },
  });
};


export const getMasterySummary = async (
  userId: string
) => {
  const topics =
    await prisma.userTopicMastery.findMany({
      where: {
        userId,
      },

      select: {
        mastery: true,

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

  const history =
    await prisma.masteryHistory.findMany({
      where: {
        userId,
      },

      select: {
        topicId: true,
        delta: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return topics.map((topic) => {
    const topicHistory = history.filter(
      (entry) =>
        entry.topicId === topic.topic.id
    );

    const totalGain =
      topicHistory.reduce(
        (sum, entry) => sum + entry.delta,
        0
      );

    const latestEvent =
      topicHistory[0] ?? null;

    return {
      topic: topic.topic,

      currentMastery: Number(
        topic.mastery.toFixed(2)
      ),

      masteryEvents:
        topicHistory.length,

      totalGain: Number(
        totalGain.toFixed(2)
      ),

      latestGain: latestEvent
        ? Number(
            latestEvent.delta.toFixed(2)
          )
        : 0,

      lastUpdated:
        latestEvent?.createdAt ?? null,
    };
  });
};