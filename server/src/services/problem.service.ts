import prisma from "../db/prisma";
import { AppError } from "../utils/AppError";
import { CreateProblemInput } from "../validators/problem.validator";

export async function createProblem(data: CreateProblemInput) {
  const existingProblem = await prisma.problem.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingProblem) {
    throw new AppError("Problem slug already exists", 409);
  }

  // Verify every topic exists
  const topicIds = data.topics.map((t) => t.topicId);

  const existingTopics = await prisma.topic.findMany({
    where: {
      id: {
        in: topicIds,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingTopics.length !== topicIds.length) {
    throw new AppError("One or more topics do not exist", 404);
  }

  return prisma.problem.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      difficulty: data.difficulty,

      topics: {
        create: data.topics.map((topic) => ({
          topicId: topic.topicId,
          weight: topic.weight,
        })),
      },
    },

    include: {
      topics: {
        include: {
          topic: true,
        },
      },
    },
  });
}

export async function getAllProblems() {
  return prisma.problem.findMany({
    include: {
      topics: {
        include: {
          topic: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateProblem(
  id: string,
  data: CreateProblemInput
) {
  await getProblemById(id);

  return prisma.$transaction(async (tx) => {
    await tx.problemTopic.deleteMany({
      where: {
        problemId: id,
      },
    });

    return tx.problem.update({
      where: {
        id,
      },

      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        difficulty: data.difficulty,

        topics: {
          create: data.topics.map((topic) => ({
            topicId: topic.topicId,
            weight: topic.weight,
          })),
        },
      },

      include: {
        topics: {
          include: {
            topic: true,
          },
        },
      },
    });
  });
}

export async function deleteProblem(id: string) {
  await getProblemById(id);

  await prisma.problem.delete({
    where: {
      id,
    },
  });

  return {
    message: "Problem deleted successfully",
  };
}

export async function getProblemById(id: string) {
  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },

    include: {
      topics: {
        include: {
          topic: true,
        },
      },
    },
  });

  

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  return problem;

  
}

export async function getProblemProgress(
  problemId: string,
  userId: string
) {
  // Make sure problem exists
  await getProblemById(problemId);

  const [
    totalSubmissions,
    acceptedSubmissions,
    latestSubmission,
  ] = await prisma.$transaction([
    prisma.submission.count({
      where: {
        problemId,
        userId,
      },
    }),

    prisma.submission.count({
      where: {
        problemId,
        userId,
        verdict: "AC",
      },
    }),

    prisma.submission.findFirst({
      where: {
        problemId,
        userId,
      },

      orderBy: {
        submittedAt: "desc",
      },

      select: {
        verdict: true,
        submissionNumber: true,
        hintsViewed: true,
        submittedAt: true,
      },
    }),
  ]);

  return {
    attempted: totalSubmissions > 0,

    solved: acceptedSubmissions > 0,

    totalSubmissions,

    acceptedSubmissions,

    latestVerdict:
      latestSubmission?.verdict ?? null,

    latestSubmissionNumber:
      latestSubmission?.submissionNumber ?? null,

    latestHintsViewed:
      latestSubmission?.hintsViewed ?? 0,

    lastSubmittedAt:
      latestSubmission?.submittedAt ?? null,
  };
}

export async function getAllProblemProgress(
  userId: string
) {
  const problems = await prisma.problem.findMany({
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,

      submissions: {
        where: {
          userId,
        },

        orderBy: {
          submittedAt: "desc",
        },

        select: {
          verdict: true,
          submissionNumber: true,
          submittedAt: true,
        },
      },
    },
  });

  return problems.map((problem) => {
    const submissions = problem.submissions;

    const acceptedSubmissions =
      submissions.filter(
        (submission) =>
          submission.verdict === "AC"
      ).length;

    const latestSubmission =
      submissions[0] ?? null;

    return {
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,

      attempted: submissions.length > 0,

      solved: acceptedSubmissions > 0,

      totalSubmissions: submissions.length,

      acceptedSubmissions,

      latestVerdict:
        latestSubmission?.verdict ?? null,

      latestSubmissionNumber:
        latestSubmission?.submissionNumber ?? null,

      lastSubmittedAt:
        latestSubmission?.submittedAt ?? null,
    };
  });
}