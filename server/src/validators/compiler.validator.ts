import { z } from "zod";

export const compilerSchema = z.object({
  language: z.enum(["cpp"]),
  code: z.string().min(1),
  input: z.string().optional().default(""),
});

export type CompilerInput = z.infer<
  typeof compilerSchema
>;