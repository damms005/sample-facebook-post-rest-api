import express from "express";
import { replyPost } from "../controllers/post_replies";
import { verifyToken } from "../services/auth";

const router = express.Router();

router.post("/create", verifyToken, replyPost);

export default router;
