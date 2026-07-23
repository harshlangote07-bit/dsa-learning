import { Router } from "express";
import { getTopics } from "../controllers/topic.controller";

const router = Router();

router.get("/", getTopics);

export default router;