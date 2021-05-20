import express from "express";
import { VALIDATION_SOURCE_POST, VALIDATION_RULE_REQUIRED, VALIDATION_SOURCE_PARAMS } from "../constants";
import { verifyToken } from "../services/auth";
import { validate } from "../services/validator";
import { createPost, getPost, deletePost, updatePost } from "../controllers/posts";

const router = express.Router();

router.post("/create", [verifyToken, validate({ postBody: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_POST)], createPost);

router.get("/:id", [verifyToken, validate({ id: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_PARAMS)], getPost);

router.delete("/:id/delete", [verifyToken, validate({ id: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_PARAMS)], deletePost);

router.patch("/:id/update", [verifyToken, validate({ id: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_PARAMS)], updatePost);

export default router;
