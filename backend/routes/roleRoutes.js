import express from "express";
import {
  createRole,
  updateRole,
  deleteRole,
  getRoles
} from "../controllers/roleController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.post("/create", authenticate, authorize("MANAGE_ROLES"), createRole);

router.put("/update", authenticate, authorize("MANAGE_ROLES"), updateRole);

router.delete("/delete/:id", authenticate, authorize("MANAGE_ROLES"), deleteRole);

router.get(
  "/",
  authenticate,
  getRoles
);

export default router;