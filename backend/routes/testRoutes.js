import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.post(
  "/create-user",
  authenticate,
  authorize("CREATE_USER"),
  (req, res) => {
    res.json({ message: "User created successfully" });
  }
);

export default router;