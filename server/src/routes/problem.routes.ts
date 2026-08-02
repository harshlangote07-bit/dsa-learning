import { Router } from "express";
import { Role } from "../generated/prisma/client";

import * as problemController from "../controllers/problem.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const router = Router();

// Public
router.get("/", problemController.getProblems);
router.get("/:id", problemController.getProblem);

// Admin
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  problemController.createProblem
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  problemController.updateProblem
);

router.delete(
  "/:id",
  authenticate,
 authorize(Role.ADMIN),
  problemController.deleteProblem
);

export default router;