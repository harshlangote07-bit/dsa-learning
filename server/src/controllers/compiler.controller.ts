import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { compilerSchema } from "../validators/compiler.validator";
import { runCpp } from "../services/compiler.service";

export const runCode = asyncHandler(
  async (req: Request, res: Response) => {
    const data = compilerSchema.parse(req.body);

    const result = await runCpp(
    data.code,
    data.input
    );
    res.status(200).json(result);
  }
);