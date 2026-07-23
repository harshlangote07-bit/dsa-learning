import { Router } from "express";
import { getMastery } from "../controllers/mastery.controller";

const router = Router();

router.get("/users/:id/mastery", getMastery);

export default router;