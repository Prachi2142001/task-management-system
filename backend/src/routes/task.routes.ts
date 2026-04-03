import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/tasks", authenticate, (req, res) => {
  res.json({ message: "Protected route accessed" });
});

export default router;
