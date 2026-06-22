import express from "express";
import Log from "../models/log.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// VIEW LOGS (admin only)
router.get(
  "/",
  authenticate,
  authorize("MANAGE_ROLES"), // or create separate VIEW_LOGS permission
  async (req, res) => {
    try {
      const logs = await Log.find({
        organizationId: req.user.organizationId
      })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;