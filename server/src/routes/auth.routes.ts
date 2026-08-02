import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { registerSchema } from "../schemas/auth.schema";
import { login } from "../controllers/auth.controller";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post(
  "/register",
  validate({
    body: registerSchema,
  }),
  register
);

router.post(
  "/login",
  validate({
    body: loginSchema,
  }),
  login
);

export default router;