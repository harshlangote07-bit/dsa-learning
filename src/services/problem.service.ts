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