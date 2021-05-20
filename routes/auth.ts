import express from "express";
import { register, login, resetPassword, finalizePasswordResetToken } from "../controllers/auth";
import { validateData } from "../services/validator";
import { VALIDATION_RULE_REQUIRED, VALIDATION_RULE_EMAIL, VALIDATION_SOURCE_POST } from "../constants";

const router = express.Router();

router.post(
	"/register",
	validateData(
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
router.post("/login", login);
router.post("/reset", resetPassword);
router.get("/reset/:token", finalizePasswordResetToken);

export default router;
