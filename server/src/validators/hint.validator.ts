import { z } from "zod";

export const createHintSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Hint content is required"),

  order: z
    .number()
    .int()
    .min(1, "Hint order must be at least 1"),
});

export const updateHintSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Hint content is required")
    .optional(),

  order: z
    .number()
    .int()
    .min(1, "Hint order must be at least 1")
    .optional(),
});

export type CreateHintInput = z.infer<
  typeof createHintSchema
>;

export type UpdateHintInput = z.infer<
  typeof updateHintSchema
>;