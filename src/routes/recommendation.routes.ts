import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { recommendProblems } from "../controllers/recommendation.controller";

const router = Router();

router.get("/", authenticate, recommendProblems);

export default router;