import express from "express";
import { likePost, unlikePost } from "../controllers/post_likes";
import { verifyToken } from "../services/auth";

const router = express.Router();

router.post("/create", verifyToken, likePost);
router.delete("/delete/:id", verifyToken, unlikePost);

export default router;
