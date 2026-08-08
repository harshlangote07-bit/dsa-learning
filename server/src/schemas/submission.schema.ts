import { z } from "zod";
import { Verdict, Language } from "../generated/prisma/client";

export const submissionSchema = z
  .object({
    problemId: z.string(),

    language: z.nativeEnum(Language),

    code: z.string(),

    verdict: z.nativeEnum(Verdict),

    executionTime: z.number().optional(),

    hintsViewed: z.number().optional(),
  })
  .strict();