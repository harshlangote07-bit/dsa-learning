import { Router } from "express";
import { getProblems, getProblem, } from "../controllers/problem.controller";

const router = Router();

router.get("/", getProblems);

router.get("/:id", getProblem);

export default router;