import express from "express";
import { createPost, getAllPosts } from "../controllers/posts";
import { verifyToken } from "../services/auth";

const router = express.Router();

router.get("/", verifyToken, getAllPosts);
router.post("/create", verifyToken, createPost);
router.delete("/delete", verifyToken, getAllPosts);
router.patch("/update/:id", verifyToken, getAllPosts);

//post - store
//get - fetch
//put - full update
//patch - partial update
//delete - zap

export default router;
