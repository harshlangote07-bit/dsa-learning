import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

type ValidationSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction): void => {
    // Validate request body
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: "Body validation failed",
          errors: result.error.issues,
        });
        return;
      }

      req.body = result.data;
    }

    // Validate route params
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: "Params validation failed",
          errors: result.error.issues,
        });
        return;
      }

      // We only validate params; no reassignment needed.
    }

    // Validate query params
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: "Query validation failed",
          errors: result.error.issues,
        });
        return;
      }

      // We only validate query; no reassignment needed.
    }

    next();
  };