import express from "express";
import { VALIDATION_RULE_REQUIRED, VALIDATION_RULE_EMAIL, VALIDATION_SOURCE_POST } from "../constants";
import { register, login, resetPassword, finalizePasswordResetToken } from "../controllers/auth";
import { validate } from "../services/validator";

const router = express.Router();

router.post(
	"/register",
	validate(
		{
			firstname: [VALIDATION_RULE_REQUIRED],
			lastname: [VALIDATION_RULE_REQUIRED],
			password: [VALIDATION_RULE_REQUIRED],
			email: [VALIDATION_RULE_REQUIRED, VALIDATION_RULE_EMAIL],
		},
		VALIDATION_SOURCE_POST
	),
	register
);
router.post(
	"/login",
	validate(
		{
			email: [VALIDATION_RULE_REQUIRED, VALIDATION_RULE_EMAIL],
			password: [VALIDATION_RULE_REQUIRED],
		},
		VALIDATION_SOURCE_POST
	),
	login
);
router.post(
	"/reset",
	validate(
		{
			email: [VALIDATION_RULE_REQUIRED, VALIDATION_RULE_EMAIL],
			newPassword: [VALIDATION_RULE_REQUIRED],
		},
		VALIDATION_SOURCE_POST
	),
	resetPassword
);
router.get("/reset/:token", finalizePasswordResetToken);

export default router;
