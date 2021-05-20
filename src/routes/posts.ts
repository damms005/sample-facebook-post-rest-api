import express from "express";
import { createPost, getPost, deletePost, updatePost } from "../controllers/posts";
import { verifyToken } from "../services/auth";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/:id", verifyToken, getPost);
router.delete("/delete/:id", verifyToken, deletePost);
router.patch("/update/:id", verifyToken, updatePost);

export default router;
