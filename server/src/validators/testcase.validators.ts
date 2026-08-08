import { z } from "zod";

export const createTestCaseSchema = z.object({
  input: z.string(),

  expectedOutput: z.string(),

  isHidden: z.boolean().default(false),

  order: z.number().int().min(1),
});

export const updateTestCaseSchema =
  createTestCaseSchema.partial();

export type CreateTestCaseInput = z.infer<
  typeof createTestCaseSchema
>;

export type UpdateTestCaseInput = z.infer<
  typeof updateTestCaseSchema
>;