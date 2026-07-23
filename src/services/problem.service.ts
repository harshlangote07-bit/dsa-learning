import prisma from "../db/prisma";

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
      title: "asc",
    },
  });
}

export async function getProblemById(id: string) {
  return prisma.problem.findUnique({
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
}