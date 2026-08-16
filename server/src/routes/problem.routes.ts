import { Router } from "express";
import { Role } from "../generated/prisma/client";

import * as problemController from "../controllers/problem.controller";
import * as testcaseController from "../controllers/testcase.controller";
import * as judgeController from "../controllers/judge.controller";
import * as hintController from "../controllers/hint.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const router = Router();

// ===========================
// Public Problem APIs
// ===========================

router.get("/", problemController.getProblems);

// All problems + current user's progress
router.get(
  "/progress",
  authenticate,
  problemController.getAllProblemProgress
);

// Single problem + current user's progress
router.get(
  "/:id/progress",
  authenticate,
  problemController.getProblemProgress
);

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

router.post(
  "/:problemId/judge",
  authenticate,
  judgeController.judgeCode
);

// ===========================
// Hint APIs
// ===========================

// USER + ADMIN -> get hints
router.get(
  "/:problemId/hints",
  authenticate,
  hintController.getProblemHints
);

// ADMIN only -> create hint
router.post(
  "/:problemId/hints",
  authenticate,
  authorize(Role.ADMIN),
  hintController.createHint
);

// ADMIN only -> update hint
router.put(
  "/:problemId/hints/:hintId",
  authenticate,
  authorize(Role.ADMIN),
  hintController.updateHint
);

// ADMIN only -> delete hint
router.delete(
  "/:problemId/hints/:hintId",
  authenticate,
  authorize(Role.ADMIN),
  hintController.deleteHint
);

router.post(
  "/:problemId/hints/:hintId/view",
  authenticate,
  hintController.viewHint
);

export default router;