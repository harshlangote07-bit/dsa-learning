import { Router } from "express";
import { Role } from "../generated/prisma/client";

import * as topicController from "../controllers/topic.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const router = Router();

// Public
router.get("/", topicController.getAllTopics);
router.get("/:id", topicController.getTopicById);

// Admin
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  topicController.createTopic
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  topicController.updateTopic
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  topicController.deleteTopic
);

export default router;