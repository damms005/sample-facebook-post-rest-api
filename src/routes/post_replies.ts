import express from "express";
import { VALIDATION_RULE_REQUIRED, VALIDATION_SOURCE_PARAMS, VALIDATION_SOURCE_POST } from "../constants";
import { replyPost } from "../controllers/post_replies";
import { verifyToken } from "../services/auth";
import { validate } from "../services/validator";

const router = express.Router();

router.post(
	"/:id/reply",
	[
		verifyToken,
		validate({ id: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_PARAMS),
		validate({ replyText: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_POST),
	],
	replyPost
);

export default router;
