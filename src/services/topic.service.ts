import prisma from "../db/prisma";
import { AppError } from "../utils/AppError";
import { CreateTopicInput } from "../validators/topic.validator";

export async function createTopic(data: CreateTopicInput) {
  const existingTopic = await prisma.topic.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingTopic) {
    throw new AppError("Topic already exists", 409);
  }

  return prisma.topic.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function getAllTopics() {
  return prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getTopicById(id: string) {
  const topic = await prisma.topic.findUnique({
    where: {
      id,
    },
  });

  if (!topic) {
    throw new AppError("Topic not found", 404);
  }

  return topic;
}

export async function updateTopic(
  id: string,
  data: CreateTopicInput
) {
  await getTopicById(id);

  const duplicateTopic = await prisma.topic.findFirst({
    where: {
      name: data.name,
      NOT: {
        id,
      },
    },
  });

  if (duplicateTopic) {
    throw new AppError("Topic name already exists", 409);
  }

  return prisma.topic.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function deleteTopic(id: string) {
  await getTopicById(id);

  await prisma.topic.delete({
    where: {
      id,
    },
  });

  return {
    message: "Topic deleted successfully",
  };
}