import { Router } from "express";
import { Role } from "../generated/prisma/client";

import * as problemController from "../controllers/problem.controller";
import * as testcaseController from "../controllers/testcase.controller";
import * as judgeController from "../controllers/judge.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const router = Router();

// ===========================
// Public Problem APIs
// ===========================

router.get("/", problemController.getProblems);

router.get("/:id", problemController.getProblem);

// ===========================
// Admin Problem APIs
// ===========================

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

// ===========================
// Test Case APIs
// ===========================

// ADMIN -> all test cases
// USER  -> public test cases only
router.get(
  "/:problemId/testcases",
  authenticate,
  testcaseController.getProblemTestCases
);

// Admin only
router.post(
  "/:problemId/testcases",
  authenticate,
  authorize(Role.ADMIN),
  testcaseController.createTestCase
);

router.put(
  "/:problemId/testcases/:testcaseId",
  authenticate,
  authorize(Role.ADMIN),
  testcaseController.updateTestCase
);

router.delete(
  "/:problemId/testcases/:testcaseId",
  authenticate,
  authorize(Role.ADMIN),
  testcaseController.deleteTestCase
);

router.get("/:id", problemController.getProblem);

router.post(
  "/:problemId/judge",
  authenticate,
  judgeController.judgeCode
);

export default router;