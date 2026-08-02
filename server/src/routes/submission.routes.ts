import { Router } from "express";
import { createSubmission } from "../controllers/submission.controller";
import { validate } from "../middleware/validate";
import { submissionSchema } from "../schemas/submission.schema";
import { authenticate } from "../middleware/auth.middleware";


const router = Router();

router.post(
  "/",
  authenticate,
  validate({
    body: submissionSchema,
  }),
  createSubmission
);

export default router;