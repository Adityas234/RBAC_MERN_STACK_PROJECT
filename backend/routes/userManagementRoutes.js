import express from "express";
import {
  createUser,
  getUsers,
  deleteUser
} from "../controllers/userManagmentController.js";

import { authenticate } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authorize.js";
import { assignRole } from "../controllers/userController.js";

const router = express.Router();

// CREATE USER
router.post(
  "/",
  authenticate,
  authorize("CREATE_USER"),
  createUser
);

// GET USERS
router.get(
  "/",
  authenticate,
  authorize("VIEW_USERS"),
  getUsers
);

// DELETE USER
router.delete(
  "/:id",
  authenticate,
  authorize("DELETE_USER"),
  deleteUser
);

router.post(
  "/assign-role",
  authenticate,
  assignRole
);

export default router;