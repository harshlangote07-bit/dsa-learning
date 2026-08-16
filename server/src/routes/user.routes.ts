import { Router } from "express";
import { Role } from "../generated/prisma/client";

import {
  getMe,
  getMasteryHistory,
  getMasterySummary
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const router = Router();

router.get(
  "/me/mastery",
  authenticate,
  getMasterySummary
);

router.get(
  "/me/mastery/history",
  authenticate,
  getMasteryHistory
);

router.get(
  "/me",
  authenticate,
  getMe
);

// Temporary RBAC test route
router.get(
  "/admin-test",
  authenticate,
  authorize(Role.ADMIN),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin 🚀",
    });
  }
);

export default router;