import { z } from "zod";
import { Difficulty } from "../generated/prisma/client";

export const problemTopicSchema = z.object({
  topicId: z.string().cuid("Invalid topic ID"),
  weight: z
    .number()
    .min(0, "Weight must be at least 0")
    .max(1, "Weight cannot exceed 1"),
});

export const createProblemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers and hyphens only"),

  description: z
    .string()
    .trim()
    .min(10)
    .max(5000),

  difficulty: z.nativeEnum(Difficulty),

  topics: z
    .array(problemTopicSchema)
    .min(1, "At least one topic is required"),
});

export type CreateProblemInput = z.infer<typeof createProblemSchema>;