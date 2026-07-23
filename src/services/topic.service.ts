import prisma from "../db/prisma";

export async function getAllTopics() {
  return prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });
}