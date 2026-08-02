import { z } from "zod";
import { Verdict } from "../generated/prisma/client";

export const createSubmissionSchema = z.object({
  problemId: z.string().cuid("Invalid problem ID"),

  verdict: z.nativeEnum(Verdict),

  hintsViewed: z
    .number()
    .int()
    .min(0)
    .default(0),
});

export type CreateSubmissionInput = z.infer<
  typeof createSubmissionSchema
>;