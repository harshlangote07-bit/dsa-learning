import { Router } from "express";

import {
  createSubmission,
  getSubmissions,
  getSubmission,
} from "../controllers/submission.controller";

import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createSubmissionSchema } from "../validators/submission.validator";

const router = Router();

// Create + judge submission
router.post(
  "/",
  authenticate,
  validate({
    body: createSubmissionSchema,
  }),
  createSubmission
);

// Get current user's submission history
router.get(
  "/",
  authenticate,
  getSubmissions
);

router.get(
  "/:id",
  authenticate,
  getSubmission
);

export default router;