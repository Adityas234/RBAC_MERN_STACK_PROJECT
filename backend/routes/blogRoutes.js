import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";

import {

createBlog,

getBlogs,

getMyBlogs,

updateBlog,

deleteBlog

} from "../controllers/blogController.js";

const router = express.Router();

router.post("/", authenticate, createBlog);

router.get("/", authenticate, getBlogs);

router.get("/my", authenticate, getMyBlogs);

router.put("/:id", authenticate, updateBlog);

router.delete("/:id", authenticate, deleteBlog);

export default router;