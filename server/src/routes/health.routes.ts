import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.json({
    success: true,
    message: "DSA Learning API is running",
  });
});

export default router;

