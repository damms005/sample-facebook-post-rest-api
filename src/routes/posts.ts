import express from "express";
import { createPost, getPost, deletePost, updatePost } from "../controllers/posts";
import { verifyToken } from "../services/auth";
import { validate } from "../services/validator";
import { VALIDATION_SOURCE_POST, VALIDATION_RULE_REQUIRED } from "../constants";

const router = express.Router();

router.post("/create", [verifyToken, validate({ postBody: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_POST)], createPost);

router.get("/:id", [verifyToken, validate({ email: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_POST)], getPost);

router.delete("/delete/:id", [verifyToken, validate({ email: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_POST)], deletePost);

router.patch("/update/:id", [verifyToken, validate({ email: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_POST)], updatePost);

export default router;
