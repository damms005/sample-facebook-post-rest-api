import express from "express";
import { VALIDATION_RULE_REQUIRED, VALIDATION_SOURCE_PARAMS } from "../constants";
import { likePost, unlikePost } from "../controllers/post_likes";
import { verifyToken } from "../services/auth";
import { validate } from "../services/validator";

const router = express.Router();

router.post("/:id/like", [verifyToken, validate({ id: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_PARAMS)], likePost);
router.delete("/:id/unlike", [verifyToken, validate({ id: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_PARAMS)], unlikePost);

export default router;
