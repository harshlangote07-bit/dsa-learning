import { z } from "zod";
import { Verdict } from "../generated/prisma/client";

export const submissionSchema = z
  .object({
    problemId: z.string(),
    verdict: z.nativeEnum(Verdict),
  })
  .strict();