import { z } from "zod";

export const createTopicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Topic name must be at least 2 characters")
    .max(50),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>;