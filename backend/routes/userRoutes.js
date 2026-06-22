import express from "express";
import { assignRole } from "../controllers/userController.js";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/assign-role", authenticate, assignRole);

export default router;