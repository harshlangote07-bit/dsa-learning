import { z } from "zod";
import { Verdict, Language } from "../generated/prisma/client";

export const createSubmissionSchema = z.object({
  problemId: z.string().cuid("Invalid problem ID"),

  language: z.nativeEnum(Language),

  code: z.string().min(1),

  verdict: z.nativeEnum(Verdict),

  executionTime: z.number().int().min(0).default(0),

  hintsViewed: z.number().int().min(0).default(0),
});

export type CreateSubmissionInput = z.infer<
  typeof createSubmissionSchema
>;