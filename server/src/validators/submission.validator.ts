import { z } from "zod";
import { Language } from "../generated/prisma/client";

export const createSubmissionSchema = z.object({
  problemId: z.string().cuid("Invalid problem ID"),

  language: z.nativeEnum(Language),

  code: z
    .string()
    .min(1, "Code cannot be empty"),
});

export type CreateSubmissionInput = z.infer<
  typeof createSubmissionSchema
>;