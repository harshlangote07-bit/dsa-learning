import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { runCode } from "../controllers/compiler.controller";

const router = Router();

router.post(
  "/run",
  authenticate,
  runCode
);

export default router;